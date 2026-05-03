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
 * Per-(user, file) EXIF override storage. Mirrors
 * `PhotoIndexMapper`'s direct-DB style — the composite PK is
 * incompatible with QBMapper's id-based contract.
 *
 * `upsert` writes whatever fields the caller provides. Passing
 * null for a field (e.g. takenAt) explicitly clears the override
 * for that field, so "reset to original" in the UI is a single
 * call rather than a separate clear-this-field endpoint.
 */
class PhotoMetadataEditMapper {
	public function __construct(
		private readonly IDBConnection $connection,
	) {
	}

	/**
	 * Insert or update the (user, file) row. All four override
	 * columns are written every call; pass null to clear an
	 * individual field while leaving the row in place.
	 */
	public function upsert(
		string $userId,
		int $fileId,
		?int $takenAt,
		?float $gpsLat,
		?float $gpsLng,
		int $updatedAt,
	): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->insert('photos_metadata_edits')
			->values([
				'user_id' => $qb->createNamedParameter($userId),
				'file_id' => $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT),
				'taken_at' => $qb->createNamedParameter($takenAt, $takenAt === null ? IQueryBuilder::PARAM_NULL : IQueryBuilder::PARAM_INT),
				'gps_lat' => $qb->createNamedParameter($gpsLat === null ? null : (string)$gpsLat),
				'gps_lng' => $qb->createNamedParameter($gpsLng === null ? null : (string)$gpsLng),
				'updated_at' => $qb->createNamedParameter($updatedAt, IQueryBuilder::PARAM_INT),
			]);

		try {
			$qb->executeStatement();
		} catch (\OCP\DB\Exception $e) {
			if ($e->getReason() !== \OCP\DB\Exception::REASON_UNIQUE_CONSTRAINT_VIOLATION) {
				throw $e;
			}
			// Row already exists — switch to UPDATE.
			$update = $this->connection->getQueryBuilder();
			$update->update('photos_metadata_edits')
				->set('taken_at', $update->createNamedParameter($takenAt, $takenAt === null ? IQueryBuilder::PARAM_NULL : IQueryBuilder::PARAM_INT))
				->set('gps_lat', $update->createNamedParameter($gpsLat === null ? null : (string)$gpsLat))
				->set('gps_lng', $update->createNamedParameter($gpsLng === null ? null : (string)$gpsLng))
				->set('updated_at', $update->createNamedParameter($updatedAt, IQueryBuilder::PARAM_INT))
				->where($update->expr()->eq('user_id', $update->createNamedParameter($userId)))
				->andWhere($update->expr()->eq('file_id', $update->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
			$update->executeStatement();
		}
	}

	/**
	 * @return array{taken_at: ?int, gps_lat: ?float, gps_lng: ?float}|null
	 */
	public function getForUserFile(string $userId, int $fileId): ?array {
		$qb = $this->connection->getQueryBuilder();
		$qb->select('taken_at', 'gps_lat', 'gps_lng')
			->from('photos_metadata_edits')
			->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)))
			->andWhere($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$result = $qb->executeQuery();
		$row = $result->fetch();
		$result->closeCursor();
		if ($row === false) {
			return null;
		}
		return [
			'taken_at' => $row['taken_at'] === null ? null : (int)$row['taken_at'],
			'gps_lat' => $row['gps_lat'] === null ? null : (float)$row['gps_lat'],
			'gps_lng' => $row['gps_lng'] === null ? null : (float)$row['gps_lng'],
		];
	}

	/**
	 * Bulk read used by the timeline / search composer to layer
	 * overrides on top of a page of rows in one query.
	 *
	 * @param int[] $fileIds
	 * @return array<int, array{taken_at: ?int, gps_lat: ?float, gps_lng: ?float}>
	 */
	public function getForUserFiles(string $userId, array $fileIds): array {
		if ($fileIds === []) {
			return [];
		}
		$qb = $this->connection->getQueryBuilder();
		$qb->select('file_id', 'taken_at', 'gps_lat', 'gps_lng')
			->from('photos_metadata_edits')
			->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)))
			->andWhere($qb->expr()->in('file_id', $qb->createNamedParameter($fileIds, IQueryBuilder::PARAM_INT_ARRAY)));
		$result = $qb->executeQuery();
		$out = [];
		while ($row = $result->fetch()) {
			$out[(int)$row['file_id']] = [
				'taken_at' => $row['taken_at'] === null ? null : (int)$row['taken_at'],
				'gps_lat' => $row['gps_lat'] === null ? null : (float)$row['gps_lat'],
				'gps_lng' => $row['gps_lng'] === null ? null : (float)$row['gps_lng'],
			];
		}
		$result->closeCursor();
		return $out;
	}

	public function deleteByFileId(int $fileId): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->delete('photos_metadata_edits')
			->where($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}
}
