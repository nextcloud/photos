<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Command;

use OCA\Photos\Import\ICloudImporter;
use OCA\Photos\Import\ImportReport;
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
 * Apply the capture dates, favorites and albums of an iCloud Photos export
 * from privacy.apple.com to the media files of the export.
 */
class ImportICloudCommand extends Command {
	public function __construct(
		private readonly IUserManager $userManager,
		private readonly IRootFolder $rootFolder,
		private readonly ICloudImporter $importer,
	) {
		parent::__construct();
	}

	#[\Override]
	protected function configure(): void {
		$this->setName('photos:import-icloud')
			->setDescription('Apply the capture dates, favorites and albums of an iCloud Photos export from privacy.apple.com')
			->addArgument('user', InputArgument::REQUIRED, 'User owning the files')
			->addArgument('folder', InputArgument::REQUIRED, 'Folder of the extracted export, relative to the files of the user. Example: iCloud Photos')
			->addOption('dry-run', null, InputOption::VALUE_NONE, 'Only report what would be changed');
	}

	#[\Override]
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$userId = (string)$input->getArgument('user');
		$path = (string)$input->getArgument('folder');
		$dryRun = (bool)$input->getOption('dry-run');

		$user = $this->userManager->get($userId);
		if ($user === null) {
			$output->writeln("<error>User $userId was not found</error>");
			return 1;
		}
		$userId = $user->getUID();

		try {
			$folder = $this->rootFolder->getUserFolder($userId)->get($path);
		} catch (NotFoundException) {
			$folder = null;
		}
		if (!$folder instanceof Folder) {
			$output->writeln("<error>Folder $path was not found</error>");
			return 1;
		}

		$report = new ImportReport(static function (string $result, ?string $item) use ($output): void {
			$output->writeln($item . ': ' . $result, OutputInterface::VERBOSITY_VERBOSE);
		});
		$this->importer->import($userId, $folder, [], $dryRun, $report);

		$would = $dryRun ? 'Would be ' : '';
		$output->writeln(sprintf('Media files: %d', $report->get('media')));
		$output->writeln(sprintf('Media files with details: %d', $report->get('details')));
		foreach ([
			'date' => $would . 'dated from the export: %d',
			'exif_date' => 'Kept, capture date in EXIF data: %d',
			'not_editable' => 'Not dated, not editable: %d',
			'favorite' => $would . 'marked as favorite: %d',
			'deleted' => 'Skipped, recently deleted in iCloud: %d',
			'album_created' => $would . 'created albums: %d',
			'album_file' => $would . 'added to albums: %d',
			'hidden' => $would . 'added to the album "' . ICloudImporter::HIDDEN_ALBUM . '": %d',
			'details_without_file' => 'Details without media file: %d',
			'member_not_found' => 'Album members not found: %d',
			'member_ambiguous' => 'Album members skipped, file name not unique: %d',
		] as $result => $format) {
			$output->writeln(sprintf(ucfirst($format), $report->get($result)));
		}

		return 0;
	}
}
