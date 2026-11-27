<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB\Timeline;

use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IDBConnection;

class TimelineMapper {
	private const int SECONDS_PER_DAY = 86400;

	/**
	 * Days added to the timestamps before the integer division, so that it
	 * also rounds down the timestamps before 1970.
	 */
	private const int DAY_OFFSET = 1000000;

	public function __construct(
		private readonly IDBConnection $connection,
		private readonly IFilesMetadataManager $filesMetadataManager,
	) {
	}

	/**
	 * Count the files per UTC day of their capture time, newest day first.
	 * Files without a capture time count on the day of their modification time.
	 *
	 * @param int $storageId Numeric id of the storage holding the files
	 * @param list<string> $folderPaths Folder paths inside the storage, without trailing slash
	 * @param list<int> $mimetypeIds Ids of the counted mimetypes
	 * @return list<array{day: string, count: int}>
	 */
	public function countFilesPerDay(int $storageId, array $folderPaths, array $mimetypeIds): array {
		if ($folderPaths === [] || $mimetypeIds === []) {
			return [];
		}

		$qb = $this->connection->getQueryBuilder();
		$qb->from('filecache', 'file');

		$metadataQuery = $this->filesMetadataManager->getMetadataQuery($qb, 'file', 'fileid');
		$metadataQuery->joinIndex(OriginalDateTimeMetadataProvider::METADATA_KEY);
		$timestamp = $qb->func()->coalesce(
			$metadataQuery->getMetadataValueField(OriginalDateTimeMetadataProvider::METADATA_KEY),
			'file.mtime',
		);
		$dayNumber = $qb->createFunction($this->divideByDay('(' . (string)$timestamp . ' + ' . (self::DAY_OFFSET * self::SECONDS_PER_DAY) . ')'));

		$folderConditions = array_map(
			fn (string $path): string => $qb->expr()->like(
				'file.path',
				$qb->createNamedParameter($this->connection->escapeLikeParameter($path) . '/%'),
			),
			$folderPaths,
		);

		$qb->selectAlias($dayNumber, 'day_number')
			->selectAlias($qb->func()->count('file.fileid'), 'file_count')
			->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypeIds, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->orX(...$folderConditions))
			->groupBy($dayNumber)
			->orderBy('day_number', 'DESC');

		$result = $qb->executeQuery();
		$days = [];
		while ($row = $result->fetch()) {
			$days[] = [
				'day' => gmdate('Y-m-d', ((int)$row['day_number'] - self::DAY_OFFSET) * self::SECONDS_PER_DAY),
				'count' => (int)$row['file_count'],
			];
		}
		$result->closeCursor();

		return $days;
	}

	/**
	 * SQL for the integer division of a non-negative integer expression by
	 * the length of a day.
	 */
	private function divideByDay(string $expression): string {
		return match ($this->connection->getDatabaseProvider()) {
			IDBConnection::PLATFORM_MYSQL, IDBConnection::PLATFORM_MARIADB => $expression . ' DIV ' . self::SECONDS_PER_DAY,
			IDBConnection::PLATFORM_ORACLE => 'FLOOR(' . $expression . ' / ' . self::SECONDS_PER_DAY . ')',
			default => $expression . ' / ' . self::SECONDS_PER_DAY,
		};
	}
}
