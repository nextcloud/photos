<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB\OnThisDay;

use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IDBConnection;

class OnThisDayMapper {
	public function __construct(
		private readonly IDBConnection $connection,
		private readonly IFilesMetadataManager $filesMetadataManager,
	) {
	}

	/**
	 * Count the files whose capture time falls into each of the given ranges.
	 *
	 * @param int $storageId Numeric id of the storage holding the files
	 * @param list<string> $folderPaths Folder paths inside the storage, without trailing slash
	 * @param list<int> $mimetypeIds Ids of the counted mimetypes
	 * @param array<int, array{int, int}> $ranges Disjoint, inclusive capture time ranges in unix seconds, by key
	 * @return array<int, int> Number of files per range key, only for the ranges holding files
	 */
	public function countFilesPerRange(int $storageId, array $folderPaths, array $mimetypeIds, array $ranges): array {
		if ($folderPaths === [] || $mimetypeIds === [] || $ranges === []) {
			return [];
		}

		$qb = $this->connection->getQueryBuilder();
		$qb->from('filecache', 'file');

		$metadataQuery = $this->filesMetadataManager->getMetadataQuery($qb, 'file', 'fileid');
		$metadataQuery->joinIndex(OriginalDateTimeMetadataProvider::METADATA_KEY, true);
		$takenAt = $metadataQuery->getMetadataValueField(OriginalDateTimeMetadataProvider::METADATA_KEY);

		// The bounds are inlined as integer literals, so that the grouping
		// expression is the very same SQL as the selected one on every database.
		$rangeConditions = [];
		$rangeKey = 'CASE';
		foreach ($ranges as $key => [$start, $end]) {
			$condition = $takenAt . ' BETWEEN ' . (int)$start . ' AND ' . (int)$end;
			$rangeConditions[] = $condition;
			$rangeKey .= ' WHEN ' . $condition . ' THEN ' . (int)$key;
		}
		$rangeKey = $qb->createFunction($rangeKey . ' END');

		$folderConditions = array_map(
			fn (string $path): string => $qb->expr()->like(
				'file.path',
				$qb->createNamedParameter($this->connection->escapeLikeParameter($path) . '/%'),
			),
			$folderPaths,
		);

		$qb->selectAlias($rangeKey, 'range_key')
			->selectAlias($qb->func()->count('file.fileid'), 'file_count')
			->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypeIds, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->orX(...$folderConditions))
			->andWhere($qb->expr()->orX(...$rangeConditions))
			->groupBy($rangeKey);

		$result = $qb->executeQuery();
		$counts = [];
		while ($row = $result->fetch()) {
			$counts[(int)$row['range_key']] = (int)$row['file_count'];
		}
		$result->closeCursor();
		ksort($counts);

		return $counts;
	}
}
