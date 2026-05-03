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
	 */
	public function upsert(
		string $userId,
		int $fileId,
		string $mimetype,
		int $size,
		int $mtime,
		?int $takenAt,
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
	public function estimateTotalForUser(string $userId, int $storageId): int {
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
