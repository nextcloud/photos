<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Command;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\Exception\AlreadyInAlbumException;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Service\ICloudExportService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\ITagManager;
use OCP\IUserManager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Apply the capture dates, favorites and albums of an iCloud Photos export
 * from privacy.apple.com to the media files of the export.
 *
 * Photos hidden in iCloud are collected in a private album instead of their
 * albums and favorites: Photos has no hidden state, and the album keeps them
 * findable for the user to move them away, while the other albums and the
 * favorites look as they did.
 *
 * @psalm-import-type PhotoDetails from ICloudExportService
 */
class ImportICloudCommand extends Command {
	public const HIDDEN_ALBUM = 'Hidden (iCloud)';

	/** @var array<string, int> Number of files, by outcome */
	private array $results = [];

	public function __construct(
		private readonly IUserManager $userManager,
		private readonly IRootFolder $rootFolder,
		private readonly IFilesMetadataManager $filesMetadataManager,
		private readonly ITagManager $tagManager,
		private readonly AlbumMapper $albumMapper,
		private readonly ICloudExportService $exportService,
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

		$this->results = [];
		$mediaByFolder = [];
		$detailsFiles = [];
		$albumFiles = [];
		$this->scanFolder($folder, $mediaByFolder, $detailsFiles, $albumFiles);

		$mediaByName = [];
		foreach ($mediaByFolder as $media) {
			foreach ($media as $name => $file) {
				$mediaByName[$name][] = $file;
			}
		}

		$details = $this->matchDetails($detailsFiles, $mediaByFolder, $mediaByName);
		$this->applyDetails($details, $userId, $dryRun, $output);

		$albums = [];
		foreach ($albumFiles as [$name, $file]) {
			foreach ($this->exportService->parseAlbum($this->readCsv($file)) as $member) {
				$albums[$name][$member] = true;
			}
		}

		$hidden = [];
		foreach ($details as [$file, $photo]) {
			if ($photo['hidden'] && !$photo['deleted']) {
				$hidden[] = $file;
			}
		}

		foreach ($albums as $name => $members) {
			$files = [];
			foreach (array_keys($members) as $member) {
				$file = $this->findAlbumMember((string)$member, $mediaByName, $details);
				if ($file !== null) {
					$files[] = $file;
				}
			}
			$this->fillAlbum((string)$name, $files, $userId, $dryRun, $output);
		}
		$this->fillAlbum(self::HIDDEN_ALBUM, $hidden, $userId, $dryRun, $output);

		$would = $dryRun ? 'Would be ' : '';
		$output->writeln(sprintf('Media files: %d', array_sum(array_map('count', $mediaByFolder))));
		$output->writeln(sprintf('Media files with details: %d', count($details)));
		foreach ([
			'date' => $would . 'dated from the export: %d',
			'exif_date' => 'Kept, capture date in EXIF data: %d',
			'not_editable' => 'Not dated, not editable: %d',
			'favorite' => $would . 'marked as favorite: %d',
			'deleted' => 'Skipped, recently deleted in iCloud: %d',
			'album_created' => $would . 'created albums: %d',
			'album_file' => $would . 'added to albums: %d',
			'hidden' => $would . 'added to the album "' . self::HIDDEN_ALBUM . '": %d',
			'details_without_file' => 'Details without media file: %d',
			'member_not_found' => 'Album members not found: %d',
			'member_ambiguous' => 'Album members skipped, file name not unique: %d',
		] as $result => $format) {
			$output->writeln(sprintf(ucfirst($format), $this->results[$result] ?? 0));
		}

		return 0;
	}

	/**
	 * @param array<string, array<string, File>> $mediaByFolder Media files by name, by folder path
	 * @param list<File> $detailsFiles
	 * @param list<array{string, File}> $albumFiles Album names and their CSV files
	 */
	private function scanFolder(Folder $folder, array &$mediaByFolder, array &$detailsFiles, array &$albumFiles): void {
		$isAlbumFolder = strcasecmp($folder->getName(), 'Albums') === 0;

		foreach ($folder->getDirectoryListing() as $node) {
			if ($node instanceof Folder) {
				$this->scanFolder($node, $mediaByFolder, $detailsFiles, $albumFiles);
			} elseif ($node instanceof File) {
				$name = $node->getName();
				$albumName = $this->exportService->getAlbumName($name);
				if ($this->isMedia($node)) {
					$mediaByFolder[$folder->getPath()][$name] = $node;
				} elseif ($this->exportService->isPhotoDetailsFile($name)) {
					$detailsFiles[] = $node;
				} elseif ($isAlbumFolder && $albumName !== null) {
					$albumFiles[] = [$albumName, $node];
				}
			}
		}
	}

	private function isMedia(File $file): bool {
		$mimeType = $file->getMimeType();
		return in_array($mimeType, Application::IMAGE_MIMES, true)
			|| in_array($mimeType, Application::VIDEO_MIMES, true);
	}

	/**
	 * Details apply to the media files next to them, or to the only media
	 * file of the export with their name when the files were moved.
	 *
	 * @param list<File> $detailsFiles
	 * @param array<string, array<string, File>> $mediaByFolder Media files by name, by folder path
	 * @param array<string, list<File>> $mediaByName
	 * @return array<int, array{File, PhotoDetails}> Media files and their details, by file id
	 */
	private function matchDetails(array $detailsFiles, array $mediaByFolder, array $mediaByName): array {
		$details = [];
		foreach ($detailsFiles as $detailsFile) {
			$folderPath = $detailsFile->getParent()->getPath();
			$rows = $this->exportService->parsePhotoDetails($this->readCsv($detailsFile));

			foreach ($rows as $name => $photo) {
				$name = (string)$name;
				$file = $mediaByFolder[$folderPath][$name] ?? null;
				if ($file === null && count($mediaByName[$name] ?? []) === 1) {
					$file = $mediaByName[$name][0];
				}

				if ($file === null || $photo === null) {
					$this->count('details_without_file');
					continue;
				}
				$details[$file->getId()] = [$file, $photo];
			}
		}

		return $details;
	}

	/**
	 * @param array<int, array{File, PhotoDetails}> $details
	 */
	private function applyDetails(array $details, string $userId, bool $dryRun, OutputInterface $output): void {
		$tags = $this->tagManager->load('files', [], false, $userId);
		$favorites = array_fill_keys($tags?->getFavorites() ?: [], true);

		foreach ($details as $fileId => [$file, $photo]) {
			if ($photo['deleted']) {
				$this->count('deleted');
				continue;
			}

			if ($photo['takenAt'] !== null) {
				$result = $this->applyDate($file, $photo['takenAt'], $dryRun);
				if ($result !== null) {
					$this->count($result);
					$output->writeln($file->getPath() . ': ' . $result, OutputInterface::VERBOSITY_VERBOSE);
				}
			}

			if ($photo['favorite'] && !$photo['hidden'] && $tags !== null && !isset($favorites[$fileId])) {
				if (!$dryRun) {
					$tags->addToFavorites($fileId);
				}
				$this->count('favorite');
				$output->writeln($file->getPath() . ': favorite', OutputInterface::VERBOSITY_VERBOSE);
			}
		}
	}

	/**
	 * @return ?string The outcome, NULL if the date is already set
	 */
	private function applyDate(File $file, int $takenAt, bool $dryRun): ?string {
		$metadata = $this->filesMetadataManager->getMetadataForNode($file, true);
		if ($metadata->hasKey(ExifMetadataProvider::METADATA_KEY_EXIF)
			&& !empty($metadata->getArray(ExifMetadataProvider::METADATA_KEY_EXIF)['DateTimeOriginal'])) {
			return 'exif_date';
		}

		if ($metadata->hasKey(OriginalDateTimeMetadataProvider::METADATA_KEY)
			&& $metadata->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY) === $takenAt) {
			return null;
		}

		if (!$file->isUpdateable()) {
			return 'not_editable';
		}

		if (!$dryRun) {
			$metadata->setInt(OriginalDateTimeMetadataProvider::METADATA_KEY, $takenAt, true);
			$this->filesMetadataManager->saveMetadata($metadata);
		}

		return 'date';
	}

	/**
	 * Album CSVs only list file names, members whose name is used by several
	 * media files of the export are skipped rather than guessed.
	 *
	 * @param array<string, list<File>> $mediaByName
	 * @param array<int, array{File, PhotoDetails}> $details
	 */
	private function findAlbumMember(string $name, array $mediaByName, array $details): ?File {
		$candidates = $mediaByName[$name] ?? [];
		if (count($candidates) !== 1) {
			$this->count($candidates === [] ? 'member_not_found' : 'member_ambiguous');
			return null;
		}

		$photo = $details[$candidates[0]->getId()][1] ?? null;
		if ($photo !== null && ($photo['hidden'] || $photo['deleted'])) {
			return null;
		}

		return $candidates[0];
	}

	/**
	 * Add the files to the album of the user with that name, creating it when
	 * needed. Albums without files are not created.
	 *
	 * @param list<File> $files
	 */
	private function fillAlbum(string $name, array $files, string $userId, bool $dryRun, OutputInterface $output): void {
		if ($files === []) {
			return;
		}

		$album = $this->albumMapper->getByName($name, $userId);
		if ($album === null) {
			$this->count('album_created');
			$output->writeln("Album $name: created", OutputInterface::VERBOSITY_VERBOSE);
			if (!$dryRun) {
				$album = $this->albumMapper->create($userId, $name);
			}
		}

		$result = $name === self::HIDDEN_ALBUM ? 'hidden' : 'album_file';
		foreach ($files as $file) {
			if ($album !== null && $this->albumMapper->getForAlbumIdAndFileId($album->getId(), $file->getId()) !== null) {
				continue;
			}

			if (!$dryRun && $album !== null) {
				try {
					$this->albumMapper->addFile($album->getId(), $file->getId(), $userId);
				} catch (AlreadyInAlbumException) {
					continue;
				}
			}
			$this->count($result);
			$output->writeln($file->getPath() . ": added to album $name", OutputInterface::VERBOSITY_VERBOSE);
		}
	}

	/**
	 * @return string Content of the CSV file, empty if it is too large
	 */
	private function readCsv(File $file): string {
		return $file->getSize() > ICloudExportService::MAX_CSV_SIZE ? '' : $file->getContent();
	}

	private function count(string $result): void {
		$this->results[$result] = ($this->results[$result] ?? 0) + 1;
	}
}
