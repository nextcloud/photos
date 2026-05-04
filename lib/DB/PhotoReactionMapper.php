<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB;

use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

/**
 * Reaction CRUD on `oc_photos_reactions`. Composite PK so QBMapper
 * doesn't fit; direct DB access mirrors `PhotoIndexMapper`'s style.
 *
 * The mapper's surface is intentionally small — toggle, list-by-
 * album, list-by-file. The controller shapes the data into the
 * "aggregated by emoji" form the frontend wants.
 */
class PhotoReactionMapper {
	public function __construct(
		private readonly IDBConnection $connection,
	) {
	}

	/**
	 * Toggle: insert if absent, delete if present. Returns true
	 * if the row exists after the call (i.e. was added), false if
	 * removed. The (album_id, file_id, user_id, emoji) PK is the
	 * fence: a duplicate insert is a no-op.
	 */
	public function toggle(int $albumId, int $fileId, string $userId, string $emoji, int $now): bool {
		$qb = $this->connection->getQueryBuilder();
		$qb->insert('photos_reactions')
			->values([
				'album_id' => $qb->createNamedParameter($albumId, IQueryBuilder::PARAM_INT),
				'file_id' => $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT),
				'user_id' => $qb->createNamedParameter($userId),
				'emoji' => $qb->createNamedParameter($emoji),
				'created_at' => $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT),
			]);

		try {
			$qb->executeStatement();
			return true;
		} catch (\OCP\DB\Exception $e) {
			if ($e->getReason() !== \OCP\DB\Exception::REASON_UNIQUE_CONSTRAINT_VIOLATION) {
				throw $e;
			}
			// Already reacted with this emoji — toggle off.
			$delete = $this->connection->getQueryBuilder();
			$delete->delete('photos_reactions')
				->where($delete->expr()->eq('album_id', $delete->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
				->andWhere($delete->expr()->eq('file_id', $delete->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)))
				->andWhere($delete->expr()->eq('user_id', $delete->createNamedParameter($userId)))
				->andWhere($delete->expr()->eq('emoji', $delete->createNamedParameter($emoji)));
			$delete->executeStatement();
			return false;
		}
	}

	/**
	 * Reactions for a single photo. Used by the slideshow / photo
	 * dialog to render the emoji bar with per-emoji counts +
	 * whether the current user has already reacted.
	 *
	 * @return list<array{emoji: string, user_id: string, created_at: int}>
	 */
	public function getForFile(int $albumId, int $fileId): array {
		$qb = $this->connection->getQueryBuilder();
		$qb->select('emoji', 'user_id', 'created_at')
			->from('photos_reactions')
			->where($qb->expr()->eq('album_id', $qb->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)))
			->orderBy('created_at', 'ASC');
		$result = $qb->executeQuery();
		$rows = [];
		while ($row = $result->fetch()) {
			$rows[] = [
				'emoji' => (string)$row['emoji'],
				'user_id' => (string)$row['user_id'],
				'created_at' => (int)$row['created_at'],
			];
		}
		$result->closeCursor();
		return $rows;
	}

	public function deleteByAlbum(int $albumId): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->delete('photos_reactions')
			->where($qb->expr()->eq('album_id', $qb->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}

	public function deleteByFileId(int $fileId): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->delete('photos_reactions')
			->where($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}
}
