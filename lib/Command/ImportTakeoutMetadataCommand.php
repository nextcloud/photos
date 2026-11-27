<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Command;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCA\Photos\Service\MediaPlaceManager;
use OCA\Photos\Service\TakeoutSidecarService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IFilesMetadata;
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
	private const RESULT_UPDATED = 'updated';
	private const RESULT_EXIF_DATE = 'exif_date';
	private const RESULT_NO_SIDECAR = 'no_sidecar';
	private const RESULT_INVALID_SIDECAR = 'invalid_sidecar';
	private const RESULT_NOT_EDITABLE = 'not_editable';
	private const RESULT_UNCHANGED = 'unchanged';

	public function __construct(
		private readonly IUserManager $userManager,
		private readonly IRootFolder $rootFolder,
		private readonly IFilesMetadataManager $filesMetadataManager,
		private readonly MediaPlaceManager $mediaPlaceManager,
		private readonly TakeoutSidecarService $sidecarService,
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

		$results = array_fill_keys([
			self::RESULT_UPDATED,
			self::RESULT_UNCHANGED,
			self::RESULT_EXIF_DATE,
			self::RESULT_NO_SIDECAR,
			self::RESULT_INVALID_SIDECAR,
			self::RESULT_NOT_EDITABLE,
		], 0);

		$this->importFolder($folder, $force, $dryRun, $output, $results);

		$output->writeln(sprintf('Media files: %d', array_sum($results)));
		$output->writeln(sprintf($dryRun ? 'Would be updated: %d' : 'Updated: %d', $results[self::RESULT_UPDATED]));
		$output->writeln(sprintf('Already up to date: %d', $results[self::RESULT_UNCHANGED]));
		$output->writeln(sprintf('Skipped, capture date in EXIF data: %d', $results[self::RESULT_EXIF_DATE]));
		$output->writeln(sprintf('Skipped, no sidecar: %d', $results[self::RESULT_NO_SIDECAR]));
		$output->writeln(sprintf('Skipped, sidecar without date or position: %d', $results[self::RESULT_INVALID_SIDECAR]));
		$output->writeln(sprintf('Skipped, not editable: %d', $results[self::RESULT_NOT_EDITABLE]));

		return 0;
	}

	/**
	 * @param array<string, int> $results Number of media files, by result
	 */
	private function importFolder(Folder $folder, bool $force, bool $dryRun, OutputInterface $output, array &$results): void {
		$nodes = $folder->getDirectoryListing();

		$fileNames = [];
		$filesByName = [];
		foreach ($nodes as $node) {
			if ($node instanceof File) {
				$fileNames[] = $node->getName();
				$filesByName[$node->getName()] = $node;
			}
		}

		$sidecars = $this->sidecarService->indexSidecars($fileNames);

		foreach ($nodes as $node) {
			if ($node instanceof Folder) {
				$this->importFolder($node, $force, $dryRun, $output, $results);
				continue;
			}

			if (!$node instanceof File || !$this->isMedia($node)) {
				continue;
			}

			$sidecarName = $this->sidecarService->findSidecar($node->getName(), $sidecars);
			$result = $sidecarName === null
				? self::RESULT_NO_SIDECAR
				: $this->importFile($node, $filesByName[$sidecarName], $force, $dryRun);

			$results[$result]++;
			$output->writeln($node->getPath() . ': ' . $result, OutputInterface::VERBOSITY_VERBOSE);
		}
	}

	private function isMedia(File $file): bool {
		$mimeType = $file->getMimeType();
		return in_array($mimeType, Application::IMAGE_MIMES, true)
			|| in_array($mimeType, Application::VIDEO_MIMES, true);
	}

	/**
	 * @return self::RESULT_* The outcome for the media file
	 */
	private function importFile(File $file, File $sidecar, bool $force, bool $dryRun): string {
		if (!$file->isUpdateable()) {
			return self::RESULT_NOT_EDITABLE;
		}

		$takeoutMetadata = $sidecar->getSize() <= TakeoutSidecarService::MAX_SIDECAR_SIZE
			? $this->sidecarService->parseSidecar($sidecar->getContent())
			: null;
		if ($takeoutMetadata === null) {
			return self::RESULT_INVALID_SIDECAR;
		}

		$metadata = $this->filesMetadataManager->getMetadataForNode($file, true);

		if (!$force && $this->hasExifDate($metadata)) {
			return self::RESULT_EXIF_DATE;
		}

		if ($takeoutMetadata['takenAt'] !== null) {
			$metadata->setInt(OriginalDateTimeMetadataProvider::METADATA_KEY, $takeoutMetadata['takenAt'], true);
		}

		$gps = $takeoutMetadata['gps'];
		if ($gps !== null && $this->shouldReplaceGps($metadata, $gps, $force)) {
			$metadata->setArray(ExifMetadataProvider::METADATA_KEY_GPS, $gps);

			$place = $this->mediaPlaceManager->getPlaceForMetadata($metadata);
			if ($place === null) {
				$metadata->unset(PlaceMetadataProvider::METADATA_KEY);
			} else {
				$metadata->setString(PlaceMetadataProvider::METADATA_KEY, $place, true);
			}
		}

		if (!$metadata->updated()) {
			return self::RESULT_UNCHANGED;
		}

		if (!$dryRun) {
			$this->filesMetadataManager->saveMetadata($metadata);
		}

		return self::RESULT_UPDATED;
	}

	/**
	 * Whether OriginalDateTimeMetadataProvider takes the capture date from the EXIF data.
	 */
	private function hasExifDate(IFilesMetadata $metadata): bool {
		return $metadata->hasKey(ExifMetadataProvider::METADATA_KEY_EXIF)
			&& !empty($metadata->getArray(ExifMetadataProvider::METADATA_KEY_EXIF)['DateTimeOriginal']);
	}

	/**
	 * Positions read from the stored metadata may have lost the decimal point
	 * of their coordinates, hence the loose comparison.
	 */
	private function shouldReplaceGps(IFilesMetadata $metadata, array $gps, bool $force): bool {
		if (!$metadata->hasKey(ExifMetadataProvider::METADATA_KEY_GPS)) {
			return true;
		}

		return $force && $metadata->getArray(ExifMetadataProvider::METADATA_KEY_GPS) != $gps;
	}
}
