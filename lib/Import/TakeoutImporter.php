<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Import;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCA\Photos\Service\MediaPlaceManager;
use OCA\Photos\Service\TakeoutSidecarService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IFilesMetadata;
use OCP\IL10N;

/**
 * Apply the capture date and position stored in the JSON sidecars of a Google
 * Takeout export to the photos and videos next to them.
 */
class TakeoutImporter implements IImporter {
	public const RESULT_MEDIA = 'media';
	public const RESULT_UPDATED = 'updated';
	public const RESULT_EXIF_DATE = 'exif_date';
	public const RESULT_NO_SIDECAR = 'no_sidecar';
	public const RESULT_INVALID_SIDECAR = 'invalid_sidecar';
	public const RESULT_NOT_EDITABLE = 'not_editable';
	public const RESULT_UNCHANGED = 'unchanged';

	public function __construct(
		private readonly IFilesMetadataManager $filesMetadataManager,
		private readonly MediaPlaceManager $mediaPlaceManager,
		private readonly TakeoutSidecarService $sidecarService,
		private readonly IL10N $l10n,
	) {
	}

	#[\Override]
	public function getId(): string {
		return 'google-takeout';
	}

	#[\Override]
	public function getName(): string {
		return $this->l10n->t('Google Photos (Takeout)');
	}

	#[\Override]
	public function getDescription(): string {
		return $this->l10n->t('Sets the capture date and the location of your photos and videos from the JSON files Google Takeout saves next to them. Dates recorded by the camera are kept. Your files are not modified, moved or copied.');
	}

	#[\Override]
	public function getFolderHint(): string {
		return $this->l10n->t('Choose the folder where you uploaded your Takeout export, for example "Takeout/Google Photos".');
	}

	#[\Override]
	public function getFields(): array {
		return [
			['id' => 'force', 'type' => 'checkbox', 'label' => $this->l10n->t('Also replace dates and locations recorded by the camera')],
		];
	}

	#[\Override]
	public function getSummaryLabels(): array {
		return [
			'found' => [
				self::RESULT_MEDIA => $this->l10n->t('Photos and videos'),
			],
			'changed' => [
				self::RESULT_UPDATED => $this->l10n->t('Capture date or location set'),
			],
			'skipped' => [
				self::RESULT_UNCHANGED => $this->l10n->t('Already up to date'),
				self::RESULT_EXIF_DATE => $this->l10n->t('Kept the date recorded by the camera'),
				self::RESULT_NO_SIDECAR => $this->l10n->t('No Takeout JSON file found'),
				self::RESULT_INVALID_SIDECAR => $this->l10n->t('JSON file without date or location'),
				self::RESULT_NOT_EDITABLE => $this->l10n->t('Not editable'),
			],
		];
	}

	#[\Override]
	public function validateOptions(string $userId, array $options): void {
	}

	/**
	 * The "force" option also updates files with a capture date in their EXIF
	 * data, and replaces their position.
	 */
	#[\Override]
	public function import(string $userId, Folder $folder, array $options, bool $dryRun, ImportReport $report): void {
		$this->importFolder($folder, ($options['force'] ?? false) === true, $dryRun, $report);

		$report->set(self::RESULT_MEDIA, array_sum($report->getCounts()));
	}

	private function importFolder(Folder $folder, bool $force, bool $dryRun, ImportReport $report): void {
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
				$this->importFolder($node, $force, $dryRun, $report);
				continue;
			}

			if (!$node instanceof File || !$this->isMedia($node)) {
				continue;
			}

			$sidecarName = $this->sidecarService->findSidecar($node->getName(), $sidecars);
			$result = $sidecarName === null
				? self::RESULT_NO_SIDECAR
				: $this->importFile($node, $filesByName[$sidecarName], $force, $dryRun);

			$report->add($result, $node->getPath());
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
