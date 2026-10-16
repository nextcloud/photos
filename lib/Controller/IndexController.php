<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\PhotoIndexMapper;
use OCA\Photos\DB\PhotoMetadataEditMapper;
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
		private readonly PhotoMetadataEditMapper $editMapper,
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
	public function timeline(?int $before = null, int $limit = 100, ?string $kind = null): JSONResponse {
		// Cap to a reasonable page; protects against pathological
		// clients while still letting initial loads cover ~one screen
		// of justified-grid tiles in a single round trip.
		$limit = max(1, min($limit, 500));

		// Sanity-check `kind`: only the two values the mapper
		// understands. Any other input is treated as "all media" so
		// a typo doesn't silently return zero results.
		$normalisedKind = ($kind === 'images' || $kind === 'videos') ? $kind : null;

		$rows = $this->mapper->getEnrichedTimelineForUser(
			$this->userId,
			$this->getHomeStorageId(),
			$before,
			$limit,
			$normalisedKind,
		);

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
		$editsByFileId = $this->editMapper->getForUserFiles($this->userId, $fileIds);

		$items = [];
		foreach ($rows as $row) {
			$metadata = $metadataByFileId[$row['file_id']] ?? null;
			$edits = $editsByFileId[$row['file_id']] ?? null;
			$items[] = $this->composeItem($row, $metadata, $edits);
		}

		return new JSONResponse([
			'items' => $items,
			'nextBefore' => $items === [] ? null : end($items)['takenAt'],
		]);
	}

	/**
	 * Indexed search — same enriched-row response as `timeline()` but
	 * filtered to rows whose filename contains `q`, OR are tagged
	 * with a system tag whose name contains `q`, OR were captured in
	 * a date range parsed out of `q` ("2023" / "May 2023" / "2023-05").
	 *
	 * Bypasses the DAV SEARCH backend entirely — useful when DAV
	 * SEARCH is misbehaving (e.g. NC34 dev builds with strict lazy
	 * AppConfig validation throwing inside `getKnownMetadata()`),
	 * and faster anyway because we avoid parsing the SearchDAV body.
	 */
	#[NoAdminRequired]
	public function search(string $q, ?int $before = null, int $limit = 100, ?string $kind = null): JSONResponse {
		$query = trim($q);
		if ($query === '') {
			return new JSONResponse(['items' => [], 'nextBefore' => null]);
		}

		$limit = max(1, min($limit, 500));
		$normalisedKind = ($kind === 'images' || $kind === 'videos') ? $kind : null;
		$dateRange = $this->parseDateRange($query);

		$rows = $this->mapper->searchUserTimeline(
			$this->userId,
			$this->getHomeStorageId(),
			$query,
			$dateRange,
			$before,
			$limit,
			$normalisedKind,
		);

		// Same metadata enrichment as the timeline path so the client
		// can reuse the same response decoder.
		$fileIds = array_map(static fn (array $r) => $r['file_id'], $rows);
		$metadataByFileId = [];
		if ($fileIds !== []) {
			try {
				$metadataByFileId = $this->metadataManager->getMetadataForFiles($fileIds);
			} catch (\Throwable) {
				$metadataByFileId = [];
			}
		}
		$editsByFileId = $this->editMapper->getForUserFiles($this->userId, $fileIds);

		$items = [];
		foreach ($rows as $row) {
			$metadata = $metadataByFileId[$row['file_id']] ?? null;
			$edits = $editsByFileId[$row['file_id']] ?? null;
			$items[] = $this->composeItem($row, $metadata, $edits);
		}

		return new JSONResponse([
			'items' => $items,
			'nextBefore' => $items === [] ? null : end($items)['takenAt'],
		]);
	}

	/**
	 * Year ("2023"), year-month ("2023-05" / "2023-5" / "5/2023") or
	 * named-month-year ("May 2023" / "Mai 2023") → [start, end) unix
	 * seconds. Returns null when the term doesn't look like a date.
	 *
	 * Tight grammar on purpose so a generic word like "dog" doesn't
	 * accidentally match a date and OR in irrelevant rows.
	 *
	 * @return array{start: int, end: int}|null
	 */
	private function parseDateRange(string $term): ?array {
		// Year-only, 1900..2100.
		if (preg_match('/^(\d{4})$/', $term, $m) === 1) {
			$year = (int)$m[1];
			if ($year < 1900 || $year > 2100) {
				return null;
			}
			$start = (new \DateTimeImmutable("$year-01-01T00:00:00Z"))->getTimestamp();
			$end = (new \DateTimeImmutable(($year + 1) . '-01-01T00:00:00Z'))->getTimestamp();
			return ['start' => $start, 'end' => $end];
		}

		// Year-month numeric variants.
		$numericFormats = ['Y-m', 'Y-n', 'n/Y', 'm/Y'];
		foreach ($numericFormats as $format) {
			$dt = \DateTimeImmutable::createFromFormat('!' . $format, $term, new \DateTimeZone('UTC'));
			if ($dt !== false) {
				$start = $dt->getTimestamp();
				$end = $dt->modify('+1 month')->getTimestamp();
				return ['start' => $start, 'end' => $end];
			}
		}

		// Named-month variants. PHP's `F Y` / `M Y` parse English month
		// names; locale-specific names need an explicit IntlDateFormatter
		// which is more setup than the value justifies for now.
		$namedFormats = ['F Y', 'M Y'];
		foreach ($namedFormats as $format) {
			$dt = \DateTimeImmutable::createFromFormat('!' . $format, $term, new \DateTimeZone('UTC'));
			if ($dt !== false) {
				$start = $dt->getTimestamp();
				$end = $dt->modify('+1 month')->getTimestamp();
				return ['start' => $start, 'end' => $end];
			}
		}

		return null;
	}

	/**
	 * Compose the JSON shape `timeline()` returns for one row +
	 * metadata pair. Extracted so `search()` can reuse the exact
	 * same response decoder client-side. `$edits` (when present)
	 * applies the user's per-photo overrides on top of the
	 * EXIF-derived values — `taken_at` from the override wins over
	 * the EXIF capture time, and the GPS override replaces the
	 * EXIF GPS array entirely. The frontend reads from the same
	 * `metadata` keys it always has.
	 *
	 * @param array{
	 *   file_id: int, name: string, path: string, mimetype: string, size: int,
	 *   mtime: int, taken_at: int, etag: string, permissions: int, favorite: int,
	 * } $row
	 * @param \OCP\FilesMetadata\Model\IFilesMetadata|null $metadata
	 * @param array{taken_at: ?int, gps_lat: ?float, gps_lng: ?float}|null $edits
	 * @return array<string, mixed>
	 */
	private function composeItem(array $row, $metadata, ?array $edits = null): array {
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
			$photoSize = $metadata->hasKey('photos-size')
				? $metadata->getArray('photos-size')
				: null;
			$takenAtMeta = $metadata->hasKey(OriginalDateTimeMetadataProvider::METADATA_KEY)
				? $metadata->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY)
				: null;
		}

		// Layer the per-user override on top of the EXIF view.
		// `editedTakenAt` flows into both the response's top-level
		// `takenAt` (timeline sort key) and the metadata bag's
		// `photos-original_date_time` (display key) so the photos
		// UI stays internally consistent.
		$editedTakenAt = $edits['taken_at'] ?? null;
		$resolvedTakenAt = $editedTakenAt ?? $takenAtMeta ?? $row['taken_at'];

		$editedLat = $edits['gps_lat'] ?? null;
		$editedLng = $edits['gps_lng'] ?? null;
		if ($editedLat !== null && $editedLng !== null) {
			// Replace the EXIF GPS array entirely. `latitude` /
			// `longitude` keys match what ExifMetadataProvider
			// produces, so the slideshow / metadata dialog don't
			// need to know about overrides — they read the same
			// shape.
			$gps = [
				'latitude' => $editedLat,
				'longitude' => $editedLng,
			];
		} elseif ($edits !== null && $editedLat === null && $editedLng === null && array_key_exists('gps_lat', $edits)) {
			// Edits row exists but GPS was explicitly cleared —
			// hide the EXIF GPS too so the dialog reflects the
			// user's intent ("no location for this photo").
			$gps = null;
		}

		return [
			'fileId' => $row['file_id'],
			'name' => $row['name'],
			'path' => $row['path'],
			'mimetype' => $row['mimetype'],
			'size' => $row['size'],
			'mtime' => $row['mtime'],
			'takenAt' => $resolvedTakenAt,
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
				'photos-original_date_time' => $resolvedTakenAt,
			],
		];
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
