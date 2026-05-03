<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\PhotoIndexMapper;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCA\Photos\Service\PhotoIndexService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\JSONResponse;
use OCP\Files\IRootFolder;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IRequest;

/**
 * Index status + indexed timeline endpoints.
 *
 * Status drives the migration banner. Timeline is the fast indexed
 * read path — clients fall back to the DAV REPORT one when status
 * reports the index isn't ready yet.
 */
class IndexController extends Controller {
	public function __construct(
		IRequest $request,
		private readonly PhotoIndexService $indexService,
		private readonly PhotoIndexMapper $mapper,
		private readonly IRootFolder $rootFolder,
		private readonly IFilesMetadataManager $metadataManager,
		private readonly string $userId,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	/**
	 * @return JSONResponse{
	 *   ready: bool,
	 *   indexed: int,
	 *   total: int,
	 * }
	 *
	 * `ready` is true when the per-user backfill flag is set. While
	 * false, clients show the migration banner and keep reading via
	 * the slow DAV path.
	 */
	#[NoAdminRequired]
	public function status(): JSONResponse {
		$indexed = $this->mapper->countForUser($this->userId);
		$total = $this->indexService->getCachedTotalForUser($this->userId);
		if ($total === null) {
			// First call after a fresh install — compute and cache.
			try {
				$total = $this->mapper->estimateTotalForUser($this->getHomeStorageId());
				$this->indexService->setCachedTotalForUser($this->userId, $total);
			} catch (\Throwable) {
				$total = $indexed;
			}
		}

		// Total can drift below indexed when a backfill scans shared
		// mounts the estimate didn't count — clamp so the banner
		// never reads "120 of 100".
		if ($indexed > $total) {
			$total = $indexed;
			$this->indexService->setCachedTotalForUser($this->userId, $total);
		}

		return new JSONResponse([
			'ready' => $this->indexService->isBackfillDoneForUser($this->userId),
			'indexed' => $indexed,
			'total' => $total,
		]);
	}

	/**
	 * Indexed timeline — enriched rows by descending capture date.
	 * `before` is exclusive (pass the previous page's last
	 * `taken_at` to step backwards in time). Each row carries the
	 * filecache fields the client needs to construct a File object
	 * (path, etag, permissions, owner, etc.) plus the EXIF / IFD0 /
	 * GPS / blurhash / size metadata read from `oc_files_metadata`
	 * via IFilesMetadataManager — replaces the per-tile DAV PROPFIND
	 * round trips of the legacy fetcher.
	 */
	#[NoAdminRequired]
	public function timeline(?int $before = null, int $limit = 100): JSONResponse {
		// Cap to a reasonable page; protects against pathological
		// clients while still letting initial loads cover ~one screen
		// of justified-grid tiles in a single round trip.
		$limit = max(1, min($limit, 500));

		$rows = $this->mapper->getEnrichedTimelineForUser($this->userId, $this->getHomeStorageId(), $before, $limit);

		// Batch-fetch metadata for the page in a single DB call. The
		// metadata manager caches per-fileId, so the "miss" cost is
		// paid once per page rather than once per tile.
		$fileIds = array_map(static fn (array $r) => $r['file_id'], $rows);
		$metadataByFileId = [];
		if ($fileIds !== []) {
			try {
				$metadataByFileId = $this->metadataManager->getMetadataForFiles($fileIds);
			} catch (\Throwable) {
				// Metadata fetch failures shouldn't break the timeline;
				// the client gracefully renders without EXIF/blurhash.
				$metadataByFileId = [];
			}
		}

		$items = [];
		foreach ($rows as $row) {
			$metadata = $metadataByFileId[$row['file_id']] ?? null;

			// All four keys may be absent (older files, non-images, or
			// metadata not yet populated). The frontend tolerates null
			// — File.attributes just won't carry the corresponding
			// entry.
			$exif = null;
			$ifd0 = null;
			$gps = null;
			$place = null;
			$photoSize = null;
			$takenAtMeta = null;

			if ($metadata !== null) {
				$exif = $metadata->hasKey(ExifMetadataProvider::METADATA_KEY_EXIF)
					? $metadata->getArray(ExifMetadataProvider::METADATA_KEY_EXIF)
					: null;
				$ifd0 = $metadata->hasKey(ExifMetadataProvider::METADATA_KEY_IFD0)
					? $metadata->getArray(ExifMetadataProvider::METADATA_KEY_IFD0)
					: null;
				$gps = $metadata->hasKey(ExifMetadataProvider::METADATA_KEY_GPS)
					? $metadata->getArray(ExifMetadataProvider::METADATA_KEY_GPS)
					: null;
				$place = $metadata->hasKey(PlaceMetadataProvider::METADATA_KEY)
					? $metadata->getString(PlaceMetadataProvider::METADATA_KEY)
					: null;
				// SizeMetadataProvider stores under the literal
				// `photos-size` (no shared constant). Hard-coding the
				// key here matches the listener directly.
				$photoSize = $metadata->hasKey('photos-size')
					? $metadata->getArray('photos-size')
					: null;
				$takenAtMeta = $metadata->hasKey(OriginalDateTimeMetadataProvider::METADATA_KEY)
					? $metadata->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY)
					: null;
			}

			$items[] = [
				'fileId' => $row['file_id'],
				'name' => $row['name'],
				'path' => $row['path'],
				'mimetype' => $row['mimetype'],
				'size' => $row['size'],
				'mtime' => $row['mtime'],
				'takenAt' => $takenAtMeta ?? $row['taken_at'],
				'etag' => $row['etag'],
				'permissions' => $row['permissions'],
				'favorite' => $row['favorite'],
				'ownerId' => $this->userId,
				'metadata' => [
					'photos-exif' => $exif,
					'photos-ifd0' => $ifd0,
					'photos-gps' => $gps,
					'photos-place' => $place,
					'photos-size' => $photoSize,
					'photos-original_date_time' => $takenAtMeta,
				],
			];
		}

		return new JSONResponse([
			'items' => $items,
			'nextBefore' => $items === [] ? null : end($items)['takenAt'],
		]);
	}

	/**
	 * The numeric storage id of the current user's primary mount.
	 * Used to scope both the indexed timeline and the migration-total
	 * estimate to the user's home (group folders / external storage
	 * remain reachable through the legacy DAV fetcher fallback).
	 */
	private function getHomeStorageId(): int {
		return (int)$this->rootFolder
			->getUserFolder($this->userId)
			->getMountPoint()
			->getNumericStorageId();
	}
}
