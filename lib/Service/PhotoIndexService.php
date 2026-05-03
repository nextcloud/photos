<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\PhotoIndexMapper;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Mount\IMovableMount;
use OCP\Files\Node;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IConfig;
use Psr\Log\LoggerInterface;

/**
 * Owns inserts/updates into `oc_photos_index`.
 *
 * `taken_at` is read from the existing `photos-original_date_time`
 * metadata if present (the OriginalDateTimeMetadataProvider listener
 * already populates that during the normal metadata pipeline). When
 * the metadata isn't there yet — typically during backfill of older
 * files that pre-date the metadata system — we fall back to mtime;
 * the live event will refresh the row once metadata extraction runs.
 */
class PhotoIndexService {
	public const APP_KEY_BACKFILL_DONE_PREFIX = 'index.backfillDone.';
	public const APP_KEY_BACKFILL_TOTAL_PREFIX = 'index.backfillTotal.';
	public const APP_KEY_BACKFILL_LAST_USER = 'index.backfillLastUser';

	public function __construct(
		private readonly PhotoIndexMapper $mapper,
		private readonly IFilesMetadataManager $metadataManager,
		private readonly IRootFolder $rootFolder,
		private readonly IConfig $config,
		private readonly ITimeFactory $time,
		private readonly LoggerInterface $logger,
	) {
	}

	public function isPhotoOrVideo(Node $node): bool {
		if (!$node instanceof File) {
			return false;
		}
		$mime = $node->getMimeType();
		return in_array($mime, Application::IMAGE_MIMES, true)
			|| in_array($mime, Application::VIDEO_MIMES, true);
	}

	/**
	 * Index a single file for a single user. No-ops on non-photos.
	 * Safe to call repeatedly.
	 */
	public function indexNodeForUser(Node $node, string $userId): void {
		if (!$this->isPhotoOrVideo($node)) {
			return;
		}
		/** @var File $node */
		$takenAt = $this->extractTakenAt($node);
		try {
			$this->mapper->upsert(
				$userId,
				$node->getId(),
				$node->getMimeType(),
				$node->getSize(),
				$node->getMTime(),
				$takenAt,
				$this->time->getTime(),
			);
		} catch (\Throwable $e) {
			// Indexing must never break the upload path. Log and move on;
			// the backfill job will pick the file up later.
			$this->logger->warning('photos index: upsert failed for file {fileId}', [
				'fileId' => $node->getId(),
				'userId' => $userId,
				'exception' => $e,
			]);
		}
	}

	/**
	 * Read the cached EXIF capture time written by
	 * OriginalDateTimeMetadataProvider, or null if not yet populated.
	 */
	public function extractTakenAt(File $node): ?int {
		try {
			$metadata = $this->metadataManager->getMetadata($node->getId(), false);
			if ($metadata->hasKey(OriginalDateTimeMetadataProvider::METADATA_KEY)) {
				$value = $metadata->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY);
				if ($value > 0) {
					return $value;
				}
			}
		} catch (\Throwable) {
			// Metadata may not exist yet for newly written files. Fall
			// back to mtime in the mapper.
		}
		return null;
	}

	public function deleteFile(int $fileId): void {
		$this->mapper->deleteByFileId($fileId);
	}

	/**
	 * Walk the user's primary folder and index every photo/video found.
	 * Honours the time budget by returning early when over it; the
	 * caller is expected to resume on the next tick.
	 *
	 * @return int Number of files indexed in this pass
	 */
	public function backfillUser(string $userId, int $deadlineEpoch): int {
		$count = 0;
		try {
			$userFolder = $this->rootFolder->getUserFolder($userId);
		} catch (\Throwable $e) {
			$this->logger->warning('photos index: cannot resolve user folder for {userId}', [
				'userId' => $userId,
				'exception' => $e,
			]);
			return 0;
		}

		$count += $this->scanFolder($userFolder, $userId, $deadlineEpoch);

		// Mark complete only if we walked the whole tree without
		// hitting the deadline. Caller decides whether to advance the
		// `lastUser` cursor.
		if ($this->time->getTime() < $deadlineEpoch) {
			$this->config->setAppValue(
				Application::APP_ID,
				self::APP_KEY_BACKFILL_DONE_PREFIX . $userId,
				'1',
			);
		}

		return $count;
	}

	private function scanFolder(Folder $folder, string $userId, int $deadlineEpoch): int {
		$count = 0;

		// Skip movable mounts (shares, group folders) — those have their
		// own owner-side rows and the recipient's view is best refreshed
		// via live events when shares mutate.
		if ($folder->getMountPoint() instanceof IMovableMount && $folder->getInternalPath() === '') {
			return 0;
		}

		foreach ($folder->getDirectoryListing() as $node) {
			if ($this->time->getTime() >= $deadlineEpoch) {
				return $count;
			}
			if ($node instanceof Folder) {
				$count += $this->scanFolder($node, $userId, $deadlineEpoch);
				continue;
			}
			if ($this->isPhotoOrVideo($node)) {
				$this->indexNodeForUser($node, $userId);
				$count++;
			}
		}
		return $count;
	}

	public function isBackfillDoneForUser(string $userId): bool {
		return $this->config->getAppValue(
			Application::APP_ID,
			self::APP_KEY_BACKFILL_DONE_PREFIX . $userId,
			'0',
		) === '1';
	}

	/**
	 * Cached estimate of how many photos the user owns; refreshed
	 * lazily by the status endpoint. Stored so the progress bar
	 * doesn't oscillate when filecache rows are added during a scan.
	 */
	public function getCachedTotalForUser(string $userId): ?int {
		$value = $this->config->getAppValue(
			Application::APP_ID,
			self::APP_KEY_BACKFILL_TOTAL_PREFIX . $userId,
			'',
		);
		return $value === '' ? null : (int)$value;
	}

	public function setCachedTotalForUser(string $userId, int $total): void {
		$this->config->setAppValue(
			Application::APP_ID,
			self::APP_KEY_BACKFILL_TOTAL_PREFIX . $userId,
			(string)$total,
		);
	}
}
