<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Command;

use OCA\Photos\Import\ImmichImporter;
use OCA\Photos\Import\ImportException;
use OCA\Photos\Import\ImportReport;
use OCA\Photos\Service\ImmichApiService;
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
 * Recreate the albums and favorites of an Immich user for the photos and
 * videos already copied from Immich into a folder.
 */
class ImportImmichAlbumsCommand extends Command {
	public function __construct(
		private readonly IUserManager $userManager,
		private readonly IRootFolder $rootFolder,
		private readonly ImmichApiService $immichApiService,
		private readonly ImmichImporter $importer,
	) {
		parent::__construct();
	}

	#[\Override]
	protected function configure(): void {
		$this->setName('photos:import-immich-albums')
			->setDescription('Recreate the albums and favorites of an Immich user for the files copied from Immich into a folder')
			->addArgument('user', InputArgument::REQUIRED, 'User owning the files')
			->addArgument('immich-url', InputArgument::REQUIRED, 'URL of the Immich server. Example: https://immich.example.com')
			->addOption('api-key', null, InputOption::VALUE_REQUIRED, 'Immich API key with the album.read and asset.read permissions, defaults to the IMMICH_API_KEY environment variable')
			->addOption('match-folder', null, InputOption::VALUE_REQUIRED, 'Folder of the copied files, relative to the files of the user. Example: Immich')
			->addOption('dry-run', null, InputOption::VALUE_NONE, 'Only report what would be changed');
	}

	#[\Override]
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$userId = (string)$input->getArgument('user');
		$apiKey = (string)($input->getOption('api-key') ?? getenv('IMMICH_API_KEY'));
		$path = (string)$input->getOption('match-folder');
		$dryRun = (bool)$input->getOption('dry-run');

		$apiUrl = $this->immichApiService->getApiUrl((string)$input->getArgument('immich-url'));
		if ($apiUrl === null) {
			$output->writeln('<error>The Immich URL must be an http or https URL</error>');
			return 1;
		}
		if ($apiKey === '') {
			$output->writeln('<error>An Immich API key is required</error>');
			return 1;
		}
		if ($path === '') {
			$output->writeln('<error>The --match-folder option is required</error>');
			return 1;
		}

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
		try {
			// Only administrators run occ, they may reach Immich in the local network.
			$this->importer->importAlbums($userId, $folder, $apiUrl, $apiKey, $dryRun, $report, true);
		} catch (ImportException $e) {
			$output->writeln('<error>' . $e->getMessage() . '</error>');
			return 1;
		}

		$would = $dryRun ? 'Would be ' : '';
		$output->writeln(sprintf('Immich albums: %d', $report->get('albums')));
		$output->writeln(sprintf('Immich favorites: %d', $report->get('favorites')));
		foreach ([
			'album_created' => $would . 'created albums: %d',
			'album_file' => $would . 'added to albums: %d',
			'favorite' => $would . 'marked as favorite: %d',
			'not_found' => 'Assets without matching file: %d',
			'ambiguous' => 'Assets skipped, several matching files: %d',
		] as $result => $format) {
			$output->writeln(sprintf(ucfirst($format), $report->get($result)));
		}

		return 0;
	}
}
