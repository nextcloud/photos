<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Command;

use OCA\Photos\Import\ImportReport;
use OCA\Photos\Import\TakeoutImporter;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IUserManager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Apply the capture date and position stored in the JSON sidecars of a Google
 * Takeout export to the photos and videos next to them.
 */
class ImportTakeoutMetadataCommand extends Command {
	public function __construct(
		private readonly IUserManager $userManager,
		private readonly IRootFolder $rootFolder,
		private readonly TakeoutImporter $importer,
	) {
		parent::__construct();
	}

	#[\Override]
	protected function configure(): void {
		$this->setName('photos:import-takeout-metadata')
			->setDescription('Apply the capture date and position from the JSON sidecars of a Google Takeout export')
			->addArgument('user', InputArgument::REQUIRED, 'User owning the files')
			->addArgument('folder', InputArgument::REQUIRED, 'Folder of the export, relative to the files of the user. Example: Takeout/Google Photos')
			->addOption('force', 'f', InputOption::VALUE_NONE, 'Also update files with a capture date in their EXIF data, and replace their position')
			->addOption('dry-run', null, InputOption::VALUE_NONE, 'Only report what would be updated');
	}

	#[\Override]
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$userId = (string)$input->getArgument('user');
		$path = (string)$input->getArgument('folder');
		$force = (bool)$input->getOption('force');
		$dryRun = (bool)$input->getOption('dry-run');

		$user = $this->userManager->get($userId);
		if ($user === null) {
			$output->writeln("<error>User $userId was not found</error>");
			return 1;
		}

		try {
			$folder = $this->rootFolder->getUserFolder($user->getUID())->get($path);
		} catch (NotFoundException) {
			$folder = null;
		}

		if (!$folder instanceof Folder) {
			$output->writeln("<error>Folder $path was not found</error>");
			return 1;
		}

		$report = new ImportReport(static function (string $result, ?string $path) use ($output): void {
			$output->writeln($path . ': ' . $result, OutputInterface::VERBOSITY_VERBOSE);
		});
		$this->importer->import($user->getUID(), $folder, ['force' => $force], $dryRun, $report);

		$output->writeln(sprintf('Media files: %d', $report->get(TakeoutImporter::RESULT_MEDIA)));
		$output->writeln(sprintf($dryRun ? 'Would be updated: %d' : 'Updated: %d', $report->get(TakeoutImporter::RESULT_UPDATED)));
		$output->writeln(sprintf('Already up to date: %d', $report->get(TakeoutImporter::RESULT_UNCHANGED)));
		$output->writeln(sprintf('Skipped, capture date in EXIF data: %d', $report->get(TakeoutImporter::RESULT_EXIF_DATE)));
		$output->writeln(sprintf('Skipped, no sidecar: %d', $report->get(TakeoutImporter::RESULT_NO_SIDECAR)));
		$output->writeln(sprintf('Skipped, sidecar without date or position: %d', $report->get(TakeoutImporter::RESULT_INVALID_SIDECAR)));
		$output->writeln(sprintf('Skipped, not editable: %d', $report->get(TakeoutImporter::RESULT_NOT_EDITABLE)));

		return 0;
	}
}
