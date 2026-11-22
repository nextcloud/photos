<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB\Library;

use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

class LibraryStatusMapper {
	public function __construct(
		private readonly IDBConnection $connection,
	) {
	}

	/**
	 * Count the photos and videos below some folders of a storage, with their
	 * total size and the time of the newest upload.
	 *
	 * The upload time of a file is the later one of its upload time and of its
	 * modification time, as files that were not uploaded through WebDAV have
	 * no upload time.
	 *
	 * @param int $storageId Numeric id of the storage holding the files
	 * @param list<string> $folderPaths Folder paths inside the storage, without trailing slash
	 * @param list<int> $photoMimetypeIds Ids of the mimetypes counted as photos
	 * @param list<int> $videoMimetypeIds Ids of the mimetypes counted as videos
	 * @return array{photos: int, videos: int, size: int, lastUpload: ?int}
	 */
	public function getStatus(int $storageId, array $folderPaths, array $photoMimetypeIds, array $videoMimetypeIds): array {
		$status = ['photos' => 0, 'videos' => 0, 'size' => 0, 'lastUpload' => null];
		$mimetypeIds = [...$photoMimetypeIds, ...$videoMimetypeIds];
		if ($folderPaths === [] || $mimetypeIds === []) {
			return $status;
		}

		$qb = $this->connection->getQueryBuilder();
		$uploadTime = $qb->func()->greatest('file.mtime', $qb->createFunction('COALESCE(extended.upload_time, 0)'));
		$folderConditions = array_map(
			fn (string $path): string => $qb->expr()->like(
				'file.path',
				$qb->createNamedParameter($this->connection->escapeLikeParameter($path) . '/%'),
			),
			$folderPaths,
		);

		$qb->select('file.mimetype')
			->selectAlias($qb->func()->count('file.fileid'), 'file_count')
			->selectAlias($qb->func()->sum('file.size'), 'total_size')
			->selectAlias($qb->func()->max($uploadTime), 'last_upload')
			->from('filecache', 'file')
			->leftJoin('file', 'filecache_extended', 'extended', $qb->expr()->eq('file.fileid', 'extended.fileid'))
			->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypeIds, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->orX(...$folderConditions))
			->groupBy('file.mimetype');

		$result = $qb->executeQuery();
		while ($row = $result->fetch()) {
			$kind = in_array((int)$row['mimetype'], $photoMimetypeIds, true) ? 'photos' : 'videos';
			$status[$kind] += (int)$row['file_count'];
			$status['size'] += max(0, (int)$row['total_size']);
			$status['lastUpload'] = max($status['lastUpload'] ?? 0, (int)$row['last_upload']);
		}
		$result->closeCursor();

		return $status;
	}
}
