<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Import;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\Exception\AlreadyInAlbumException;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Service\ICloudExportService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IL10N;
use OCP\ITagManager;

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
class ICloudImporter implements IImporter {
	public const HIDDEN_ALBUM = 'Hidden (iCloud)';

	public function __construct(
		private readonly IFilesMetadataManager $filesMetadataManager,
		private readonly ITagManager $tagManager,
		private readonly AlbumMapper $albumMapper,
		private readonly ICloudExportService $exportService,
		private readonly IL10N $l10n,
	) {
	}

	#[\Override]
	public function getId(): string {
		return 'icloud';
	}

	#[\Override]
	public function getName(): string {
		return $this->l10n->t('iCloud Photos');
	}

	#[\Override]
	public function getDescription(): string {
		return $this->l10n->t('Sets the capture dates, favorites and albums from the CSV files of an iCloud Photos export requested at privacy.apple.com. Photos hidden in iCloud are collected in the album "%s". Dates recorded by the camera are kept, your files are not modified, moved or copied.', [self::HIDDEN_ALBUM]);
	}

	#[\Override]
	public function getFolderHint(): string {
		return $this->l10n->t('Choose the folder where you uploaded your extracted iCloud export, the one containing the "Photos" and "Albums" folders or all parts of the export.');
	}

	#[\Override]
	public function getFields(): array {
		return [];
	}

	#[\Override]
	public function getSummaryLabels(): array {
		return [
			'found' => [
				'media' => $this->l10n->t('Photos and videos'),
				'details' => $this->l10n->t('Photos and videos described in the export'),
			],
			'changed' => [
				'date' => $this->l10n->t('Capture date set'),
				'favorite' => $this->l10n->t('Marked as favorite'),
				'album_created' => $this->l10n->t('Albums created'),
				'album_file' => $this->l10n->t('Added to albums'),
				'hidden' => $this->l10n->t('Added to the album "%s"', [self::HIDDEN_ALBUM]),
			],
			'skipped' => [
				'exif_date' => $this->l10n->t('Kept the date recorded by the camera'),
				'not_editable' => $this->l10n->t('Not editable'),
				'deleted' => $this->l10n->t('Recently deleted in iCloud'),
				'details_without_file' => $this->l10n->t('Described in the export, but no file found'),
				'member_not_found' => $this->l10n->t('Album photo not found'),
				'member_ambiguous' => $this->l10n->t('Album photo skipped, several files with its name'),
			],
		];
	}

	#[\Override]
	public function validateOptions(string $userId, array $options): void {
	}

	#[\Override]
	public function import(string $userId, Folder $folder, array $options, bool $dryRun, ImportReport $report): void {
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

		$details = $this->matchDetails($detailsFiles, $mediaByFolder, $mediaByName, $report);
		$this->applyDetails($details, $userId, $dryRun, $report);

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
				$file = $this->findAlbumMember((string)$member, $mediaByName, $details, $report);
				if ($file !== null) {
					$files[] = $file;
				}
			}
			$this->fillAlbum((string)$name, $files, $userId, $dryRun, $report);
		}
		$this->fillAlbum(self::HIDDEN_ALBUM, $hidden, $userId, $dryRun, $report);

		$report->set('media', array_sum(array_map('count', $mediaByFolder)));
		$report->set('details', count($details));
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
	private function matchDetails(array $detailsFiles, array $mediaByFolder, array $mediaByName, ImportReport $report): array {
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
					$report->add('details_without_file', $name);
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
	private function applyDetails(array $details, string $userId, bool $dryRun, ImportReport $report): void {
		$tags = $this->tagManager->load('files', [], false, $userId);
		$favorites = array_fill_keys($tags?->getFavorites() ?: [], true);

		foreach ($details as $fileId => [$file, $photo]) {
			if ($photo['deleted']) {
				$report->add('deleted', $file->getPath());
				continue;
			}

			if ($photo['takenAt'] !== null) {
				$result = $this->applyDate($file, $photo['takenAt'], $dryRun);
				if ($result !== null) {
					$report->add($result, $file->getPath());
				}
			}

			if ($photo['favorite'] && !$photo['hidden'] && $tags !== null && !isset($favorites[$fileId])) {
				if (!$dryRun) {
					$tags->addToFavorites($fileId);
				}
				$report->add('favorite', $file->getPath());
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
	private function findAlbumMember(string $name, array $mediaByName, array $details, ImportReport $report): ?File {
		$candidates = $mediaByName[$name] ?? [];
		if (count($candidates) !== 1) {
			$report->add($candidates === [] ? 'member_not_found' : 'member_ambiguous', $name);
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
	private function fillAlbum(string $name, array $files, string $userId, bool $dryRun, ImportReport $report): void {
		if ($files === []) {
			return;
		}

		$album = $this->albumMapper->getByName($name, $userId);
		if ($album === null) {
			$report->add('album_created', $name);
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
			$report->add($result, $file->getPath());
		}
	}

	/**
	 * @return string Content of the CSV file, empty if it is too large
	 */
	private function readCsv(File $file): string {
		return $file->getSize() > ICloudExportService::MAX_CSV_SIZE ? '' : $file->getContent();
	}
}
