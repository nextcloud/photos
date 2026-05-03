<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB;

use OCA\Photos\AppInfo\Application;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IMimeTypeLoader;
use OCP\IDBConnection;

/**
 * Direct DB access to `oc_photos_index`. Bypasses QBMapper because the
 * table uses a composite (user_id, file_id) primary key and QBMapper
 * is built around a single `id` column.
 *
 * `upsert()` uses MERGE semantics (insert or update on PK conflict)
 * because both the live event listener and the backfill job can race
 * each other on the same (user, file) pair — first write wins, second
 * silently refreshes the row.
 */
class PhotoIndexMapper {
	public function __construct(
		private readonly IDBConnection $connection,
		private readonly IMimeTypeLoader $mimeTypeLoader,
	) {
	}

	/**
	 * Insert or refresh a row. Safe to call from concurrent paths.
	 *
	 * `width` / `height` are denormalised from EXIF metadata so the
	 * timeline endpoint can serve the justified-grid layout straight
	 * from the index. They're nullable: a freshly-written file may
	 * be indexed before the metadata pipeline has produced
	 * `photos-size`, so the first index pass writes NULL and a
	 * subsequent NodeWritten / metadata-event re-index fills them in.
	 */
	public function upsert(
		string $userId,
		int $fileId,
		string $mimetype,
		int $size,
		int $mtime,
		?int $takenAt,
		?int $width,
		?int $height,
		int $indexedAt,
	): void {
		$isVideo = str_starts_with($mimetype, 'video/') ? 1 : 0;

		$qb = $this->connection->getQueryBuilder();
		$qb->insert('photos_index')
			->values([
				'user_id' => $qb->createNamedParameter($userId),
				'file_id' => $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT),
				'mimetype' => $qb->createNamedParameter($mimetype),
				'is_video' => $qb->createNamedParameter($isVideo, IQueryBuilder::PARAM_INT),
				'size' => $qb->createNamedParameter($size, IQueryBuilder::PARAM_INT),
				'mtime' => $qb->createNamedParameter($mtime, IQueryBuilder::PARAM_INT),
				'taken_at' => $qb->createNamedParameter($takenAt ?? $mtime, IQueryBuilder::PARAM_INT),
				'width' => $qb->createNamedParameter($width, $width === null ? IQueryBuilder::PARAM_NULL : IQueryBuilder::PARAM_INT),
				'height' => $qb->createNamedParameter($height, $height === null ? IQueryBuilder::PARAM_NULL : IQueryBuilder::PARAM_INT),
				'indexed_at' => $qb->createNamedParameter($indexedAt, IQueryBuilder::PARAM_INT),
			]);

		try {
			$qb->executeStatement();
		} catch (\OCP\DB\Exception $e) {
			// PK collision: refresh the existing row instead.
			if ($e->getReason() !== \OCP\DB\Exception::REASON_UNIQUE_CONSTRAINT_VIOLATION) {
				throw $e;
			}
			$update = $this->connection->getQueryBuilder();
			$update->update('photos_index')
				->set('mimetype', $update->createNamedParameter($mimetype))
				->set('is_video', $update->createNamedParameter($isVideo, IQueryBuilder::PARAM_INT))
				->set('size', $update->createNamedParameter($size, IQueryBuilder::PARAM_INT))
				->set('mtime', $update->createNamedParameter($mtime, IQueryBuilder::PARAM_INT))
				->set('taken_at', $update->createNamedParameter($takenAt ?? $mtime, IQueryBuilder::PARAM_INT))
				->set('width', $update->createNamedParameter($width, $width === null ? IQueryBuilder::PARAM_NULL : IQueryBuilder::PARAM_INT))
				->set('height', $update->createNamedParameter($height, $height === null ? IQueryBuilder::PARAM_NULL : IQueryBuilder::PARAM_INT))
				->set('indexed_at', $update->createNamedParameter($indexedAt, IQueryBuilder::PARAM_INT))
				->where($update->expr()->eq('user_id', $update->createNamedParameter($userId)))
				->andWhere($update->expr()->eq('file_id', $update->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
			$update->executeStatement();
		}
	}

	/**
	 * Remove all rows for a file across every user (called on
	 * NodeDeleted — we don't always know which user paths still
	 * mounted it, so we drop them all and let the backfill recreate
	 * them if the file resurfaces via a share elsewhere).
	 */
	public function deleteByFileId(int $fileId): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->delete('photos_index')
			->where($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}

	public function deleteForUser(string $userId): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->delete('photos_index')
			->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));
		$qb->executeStatement();
	}

	/**
	 * @return list<array{file_id: int, mimetype: string, mtime: int, taken_at: ?int}>
	 *
	 * Compact rows for the timeline. Sort key is `taken_at DESC` (we
	 * coalesce taken_at to mtime at insert time, so it's never null).
	 * `afterDate` is exclusive — pass the last row's `taken_at` to
	 * paginate forwards.
	 */
	public function getTimelineForUser(string $userId, ?int $beforeDate, int $limit): array {
		$qb = $this->connection->getQueryBuilder();
		$qb->select('file_id', 'mimetype', 'mtime', 'taken_at')
			->from('photos_index')
			->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)))
			->orderBy('taken_at', 'DESC')
			->addOrderBy('file_id', 'DESC')
			->setMaxResults($limit);

		if ($beforeDate !== null) {
			$qb->andWhere($qb->expr()->lt('taken_at', $qb->createNamedParameter($beforeDate, IQueryBuilder::PARAM_INT)));
		}

		$result = $qb->executeQuery();
		$rows = [];
		while ($row = $result->fetch()) {
			$rows[] = [
				'file_id' => (int)$row['file_id'],
				'mimetype' => (string)$row['mimetype'],
				'mtime' => (int)$row['mtime'],
				'taken_at' => $row['taken_at'] !== null ? (int)$row['taken_at'] : null,
			];
		}
		$result->closeCursor();
		return $rows;
	}

	/**
	 * Enriched timeline rows: index ⨝ filecache ⨝ vcategory_to_object
	 * (favorites). Replaces the DAV REPORT search that the client used
	 * to issue — one SQL with a covering index instead of a full-storage
	 * mimetype scan.
	 *
	 * EXIF / blurhash / GPS metadata aren't joined here; the controller
	 * fetches them in a single batch via IFilesMetadataManager which
	 * has its own per-fileId cache and avoids JOINing the variable-shape
	 * `oc_files_metadata` JSON column at SQL level.
	 *
	 * @return list<array{
	 *   file_id: int,
	 *   mimetype: string,
	 *   mtime: int,
	 *   taken_at: int,
	 *   size: int,
	 *   path: string,
	 *   name: string,
	 *   etag: string,
	 *   permissions: int,
	 *   storage_id: int,
	 *   favorite: int,
	 * }>
	 *
	 * `homeStorageId` filters rows to the user's primary storage so the
	 * client can construct DAV source URLs against `/files/<user>/...`
	 * without dealing with group-folder / external-storage path mapping.
	 * Photos outside the home storage stay reachable via the legacy
	 * DAV-report fetcher when the client falls back.
	 *
	 * `kind` scopes the result to images-only or videos-only — drives
	 * the /photos and /videos timeline tabs. `null` means "all media".
	 * The boolean form (`is_video`) is denormalised at insert time so
	 * this stays a pure index lookup with no mimetype string parsing
	 * at query time.
	 */
	public function getEnrichedTimelineForUser(string $userId, int $homeStorageId, ?int $beforeDate, int $limit, ?string $kind = null): array {
		$qb = $this->connection->getQueryBuilder();
		$qb->select(
			'idx.file_id',
			'idx.mimetype',
			'idx.mtime',
			'idx.taken_at',
			'idx.size',
			'idx.width',
			'idx.height',
			'fc.path',
			'fc.name',
			'fc.etag',
			'fc.permissions',
			'fc.storage',
			// COUNT() over the favorite join: 1 if the favorite tag is
			// mapped to this fileid for this user, else 0. Phrased as a
			// COUNT-of-tag.id rather than a CASE WHEN so we don't have
			// to rely on dialect-specific boolean coercion.
			$qb->func()->count('tag.id', 'favorite_count'),
		)
			->from('photos_index', 'idx')
			->leftJoin('idx', 'filecache', 'fc', $qb->expr()->eq('idx.file_id', 'fc.fileid'))
			->leftJoin(
				'fc',
				'vcategory_to_object',
				'tagmap',
				$qb->expr()->eq('fc.fileid', 'tagmap.objid'),
			)
			->leftJoin(
				'tagmap',
				'vcategory',
				'tag',
				$qb->expr()->andX(
					$qb->expr()->eq('tagmap.categoryid', 'tag.id'),
					$qb->expr()->eq('tag.type', $qb->createNamedParameter('files')),
					$qb->expr()->eq('tag.uid', $qb->createNamedParameter($userId)),
					$qb->expr()->eq('tag.category', $qb->createNamedParameter('_$!<Favorite>!$_')),
				),
			)
			->where($qb->expr()->eq('idx.user_id', $qb->createNamedParameter($userId)))
			->andWhere($qb->expr()->eq('fc.storage', $qb->createNamedParameter($homeStorageId, IQueryBuilder::PARAM_INT)))
			->groupBy(
				'idx.file_id',
				'idx.mimetype',
				'idx.mtime',
				'idx.taken_at',
				'idx.size',
				'idx.width',
				'idx.height',
				'fc.path',
				'fc.name',
				'fc.etag',
				'fc.permissions',
				'fc.storage',
			)
			->orderBy('idx.taken_at', 'DESC')
			->addOrderBy('idx.file_id', 'DESC')
			->setMaxResults($limit);

		if ($beforeDate !== null) {
			$qb->andWhere($qb->expr()->lt('idx.taken_at', $qb->createNamedParameter($beforeDate, IQueryBuilder::PARAM_INT)));
		}

		if ($kind === 'images') {
			$qb->andWhere($qb->expr()->eq('idx.is_video', $qb->createNamedParameter(0, IQueryBuilder::PARAM_INT)));
		} elseif ($kind === 'videos') {
			$qb->andWhere($qb->expr()->eq('idx.is_video', $qb->createNamedParameter(1, IQueryBuilder::PARAM_INT)));
		}

		$result = $qb->executeQuery();
		$rows = [];
		while ($row = $result->fetch()) {
			// Filter out rows whose filecache row vanished — that means
			// the index is stale; the live listener / next backfill
			// will tidy them up. Skipping keeps the API contract clean
			// for the client.
			if ($row['path'] === null) {
				continue;
			}
			$rows[] = [
				'file_id' => (int)$row['file_id'],
				'mimetype' => (string)$row['mimetype'],
				'mtime' => (int)$row['mtime'],
				'taken_at' => (int)$row['taken_at'],
				'size' => (int)$row['size'],
				'width' => $row['width'] === null ? null : (int)$row['width'],
				'height' => $row['height'] === null ? null : (int)$row['height'],
				'path' => (string)$row['path'],
				'name' => (string)$row['name'],
				'etag' => (string)$row['etag'],
				'permissions' => (int)$row['permissions'],
				'storage_id' => (int)$row['storage'],
				'favorite' => ((int)($row['favorite_count'] ?? 0)) > 0 ? 1 : 0,
			];
		}
		$result->closeCursor();
		return $rows;
	}

	/**
	 * Indexed search. Returns the same enriched rows as the timeline,
	 * filtered to those whose:
	 *   - filecache.name LIKE %term%, OR
	 *   - the file is tagged with a systemtag whose name LIKE %term%, OR
	 *   - the photo's `taken_at` falls inside the parsed `dateRange`
	 *     (the controller parses "2023" / "May 2023" / "2023-05" into
	 *     a [start, end) unix-second range; pass null to skip).
	 *
	 * `term` is escaped for LIKE wildcards by the caller. The systemtag
	 * tables aren't joined in `getEnrichedTimelineForUser` because most
	 * timeline queries don't need them — pulling them in here keeps the
	 * common timeline path lean.
	 *
	 * Same `homeStorageId` / `kind` semantics as the timeline.
	 *
	 * @param array{start: int, end: int}|null $dateRange
	 * @return list<array{
	 *   file_id: int,
	 *   mimetype: string,
	 *   mtime: int,
	 *   taken_at: int,
	 *   size: int,
	 *   path: string,
	 *   name: string,
	 *   etag: string,
	 *   permissions: int,
	 *   storage_id: int,
	 *   favorite: int,
	 * }>
	 */
	public function searchUserTimeline(
		string $userId,
		int $homeStorageId,
		string $term,
		?array $dateRange,
		?int $beforeDate,
		int $limit,
		?string $kind = null,
	): array {
		// Escape SQL LIKE wildcards in the user-supplied term so a
		// term containing `%` or `_` doesn't match more than expected.
		$escaped = addcslashes($term, '\\_%');
		$pattern = '%' . $escaped . '%';

		$qb = $this->connection->getQueryBuilder();
		$qb->select(
			'idx.file_id',
			'idx.mimetype',
			'idx.mtime',
			'idx.taken_at',
			'idx.size',
			'idx.width',
			'idx.height',
			'fc.path',
			'fc.name',
			'fc.etag',
			'fc.permissions',
			'fc.storage',
			$qb->func()->count('tag.id', 'favorite_count'),
		)
			->from('photos_index', 'idx')
			->leftJoin('idx', 'filecache', 'fc', $qb->expr()->eq('idx.file_id', 'fc.fileid'))
			// Favorites — same join as the timeline path.
			->leftJoin(
				'fc',
				'vcategory_to_object',
				'tagmap',
				$qb->expr()->eq('fc.fileid', 'tagmap.objid'),
			)
			->leftJoin(
				'tagmap',
				'vcategory',
				'tag',
				$qb->expr()->andX(
					$qb->expr()->eq('tagmap.categoryid', 'tag.id'),
					$qb->expr()->eq('tag.type', $qb->createNamedParameter('files')),
					$qb->expr()->eq('tag.uid', $qb->createNamedParameter($userId)),
					$qb->expr()->eq('tag.category', $qb->createNamedParameter('_$!<Favorite>!$_')),
				),
			)
			// System tags. Two joins: object→tag membership, then the
			// tag itself for the name match. Left-joined so files
			// without any tag still surface (matched on name / date).
			->leftJoin(
				'fc',
				'systemtag_object_mapping',
				'sttom',
				$qb->expr()->andX(
					$qb->expr()->eq('fc.fileid', $qb->expr()->castColumn('sttom.objectid', IQueryBuilder::PARAM_INT)),
					$qb->expr()->eq('sttom.objecttype', $qb->createNamedParameter('files')),
				),
			)
			->leftJoin(
				'sttom',
				'systemtag',
				'sttag',
				$qb->expr()->eq('sttom.systemtagid', 'sttag.id'),
			);

		$where = $qb->expr()->orX(
			$qb->expr()->iLike('fc.name', $qb->createNamedParameter($pattern)),
			$qb->expr()->iLike('sttag.name', $qb->createNamedParameter($pattern)),
		);
		if ($dateRange !== null) {
			$where->add($qb->expr()->andX(
				$qb->expr()->gte('idx.taken_at', $qb->createNamedParameter($dateRange['start'], IQueryBuilder::PARAM_INT)),
				$qb->expr()->lt('idx.taken_at', $qb->createNamedParameter($dateRange['end'], IQueryBuilder::PARAM_INT)),
			));
		}

		$qb->where($qb->expr()->eq('idx.user_id', $qb->createNamedParameter($userId)))
			->andWhere($qb->expr()->eq('fc.storage', $qb->createNamedParameter($homeStorageId, IQueryBuilder::PARAM_INT)))
			->andWhere($where)
			->groupBy(
				'idx.file_id',
				'idx.mimetype',
				'idx.mtime',
				'idx.taken_at',
				'idx.size',
				'idx.width',
				'idx.height',
				'fc.path',
				'fc.name',
				'fc.etag',
				'fc.permissions',
				'fc.storage',
			)
			->orderBy('idx.taken_at', 'DESC')
			->addOrderBy('idx.file_id', 'DESC')
			->setMaxResults($limit);

		if ($beforeDate !== null) {
			$qb->andWhere($qb->expr()->lt('idx.taken_at', $qb->createNamedParameter($beforeDate, IQueryBuilder::PARAM_INT)));
		}

		if ($kind === 'images') {
			$qb->andWhere($qb->expr()->eq('idx.is_video', $qb->createNamedParameter(0, IQueryBuilder::PARAM_INT)));
		} elseif ($kind === 'videos') {
			$qb->andWhere($qb->expr()->eq('idx.is_video', $qb->createNamedParameter(1, IQueryBuilder::PARAM_INT)));
		}

		$result = $qb->executeQuery();
		$rows = [];
		while ($row = $result->fetch()) {
			if ($row['path'] === null) {
				continue;
			}
			$rows[] = [
				'file_id' => (int)$row['file_id'],
				'mimetype' => (string)$row['mimetype'],
				'mtime' => (int)$row['mtime'],
				'taken_at' => (int)$row['taken_at'],
				'size' => (int)$row['size'],
				'width' => $row['width'] === null ? null : (int)$row['width'],
				'height' => $row['height'] === null ? null : (int)$row['height'],
				'path' => (string)$row['path'],
				'name' => (string)$row['name'],
				'etag' => (string)$row['etag'],
				'permissions' => (int)$row['permissions'],
				'storage_id' => (int)$row['storage'],
				'favorite' => ((int)($row['favorite_count'] ?? 0)) > 0 ? 1 : 0,
			];
		}
		$result->closeCursor();
		return $rows;
	}

	public function countForUser(string $userId): int {
		$qb = $this->connection->getQueryBuilder();
		$qb->select($qb->func()->count('*', 'cnt'))
			->from('photos_index')
			->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));
		$result = $qb->executeQuery();
		$row = $result->fetch();
		$result->closeCursor();
		return (int)($row['cnt'] ?? 0);
	}

	/**
	 * Estimate the total photos we expect to index for the user — used
	 * by the migration progress UI. Counts every file in the user's
	 * primary storage with a photo/video mimetype. Approximate by
	 * design: shared mounts and external storage are not included
	 * because they're scanned per-mount during backfill (and live
	 * events keep them up to date afterwards).
	 */
	public function estimateTotalForUser(int $storageId): int {
		$mimetypeIds = [];
		foreach ([...Application::IMAGE_MIMES, ...Application::VIDEO_MIMES] as $mime) {
			$id = $this->mimeTypeLoader->getId($mime);
			if ($id > 0) {
				$mimetypeIds[] = $id;
			}
		}

		if ($mimetypeIds === []) {
			return 0;
		}

		$qb = $this->connection->getQueryBuilder();
		$qb->select($qb->func()->count('*', 'cnt'))
			->from('filecache')
			->where($qb->expr()->eq('storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('mimetype', $qb->createNamedParameter($mimetypeIds, IQueryBuilder::PARAM_INT_ARRAY)));
		$result = $qb->executeQuery();
		$row = $result->fetch();
		$result->closeCursor();
		return (int)($row['cnt'] ?? 0);
	}
}
