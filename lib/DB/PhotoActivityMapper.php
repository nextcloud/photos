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
 * Append-only activity log. The mapper's surface is just `log()`
 * (called by the listener) and `getRecent()` (called by the
 * feed controller) — no updates, no per-row deletes (album-wide
 * cleanup happens via `deleteByAlbum` when the album itself goes).
 *
 * The schema is wide-open about `target_id` / `target_kind` /
 * `payload` so we can add new event types (share-added, album-
 * renamed) without another migration. Today it tracks file
 * additions, file removals, and reactions.
 */
class PhotoActivityMapper {
	public const ACTION_ADD_FILE = 'add_file';
	public const ACTION_REMOVE_FILE = 'remove_file';
	public const ACTION_REACT_ADD = 'react_add';
	public const ACTION_REACT_REMOVE = 'react_remove';

	public const KIND_FILE = 'file';
	public const KIND_USER = 'user';
	public const KIND_GROUP = 'group';

	public function __construct(
		private readonly IDBConnection $connection,
	) {
	}

	public function log(
		int $albumId,
		string $actorId,
		string $action,
		?string $targetId,
		?string $targetKind,
		?array $payload,
		int $now,
	): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->insert('photos_activity')
			->values([
				'album_id' => $qb->createNamedParameter($albumId, IQueryBuilder::PARAM_INT),
				'actor_id' => $qb->createNamedParameter($actorId),
				'action' => $qb->createNamedParameter($action),
				'target_id' => $qb->createNamedParameter($targetId),
				'target_kind' => $qb->createNamedParameter($targetKind),
				'payload' => $qb->createNamedParameter($payload === null ? null : json_encode($payload, JSON_THROW_ON_ERROR)),
				'created_at' => $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT),
			]);
		$qb->executeStatement();
	}

	/**
	 * Most recent N events for an album. Newest first because the
	 * feed renders top-to-bottom in reverse-chronological order.
	 *
	 * @return list<array{
	 *   id: int, album_id: int, actor_id: string, action: string,
	 *   target_id: ?string, target_kind: ?string, payload: ?array<string, mixed>, created_at: int,
	 * }>
	 */
	public function getRecent(int $albumId, int $limit = 50): array {
		$qb = $this->connection->getQueryBuilder();
		$qb->select('id', 'album_id', 'actor_id', 'action', 'target_id', 'target_kind', 'payload', 'created_at')
			->from('photos_activity')
			->where($qb->expr()->eq('album_id', $qb->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->orderBy('created_at', 'DESC')
			->addOrderBy('id', 'DESC')
			->setMaxResults(max(1, min($limit, 200)));

		$result = $qb->executeQuery();
		$rows = [];
		while ($row = $result->fetch()) {
			$payload = null;
			if ($row['payload'] !== null) {
				try {
					$payload = json_decode((string)$row['payload'], true, 64, JSON_THROW_ON_ERROR);
					if (!is_array($payload)) {
						$payload = null;
					}
				} catch (\JsonException) {
					$payload = null;
				}
			}
			$rows[] = [
				'id' => (int)$row['id'],
				'album_id' => (int)$row['album_id'],
				'actor_id' => (string)$row['actor_id'],
				'action' => (string)$row['action'],
				'target_id' => $row['target_id'] === null ? null : (string)$row['target_id'],
				'target_kind' => $row['target_kind'] === null ? null : (string)$row['target_kind'],
				'payload' => $payload,
				'created_at' => (int)$row['created_at'],
			];
		}
		$result->closeCursor();
		return $rows;
	}

	public function deleteByAlbum(int $albumId): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->delete('photos_activity')
			->where($qb->expr()->eq('album_id', $qb->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}
}
