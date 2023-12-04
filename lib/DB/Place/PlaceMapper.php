<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\Photos\DB\Place;

use OCA\Photos\AppInfo\Application;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IMimeTypeLoader;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IDBConnection;

class PlaceMapper {
	public const METADATA_KEY = 'photos-place';

	public function __construct(
		private IDBConnection $connection,
		private IMimeTypeLoader $mimeTypeLoader,
		private IRootFolder $rootFolder,
		private IFilesMetadataManager $filesMetadataManager,
	) {
	}

	/** @return PlaceInfo[] */
	public function findPlacesForUser(string $userId): array {
		$storageId = $this->rootFolder
			->getUserFolder($userId)
			->getMountPoint()
			->getNumericStorageId();


		$mimetypes = array_map(fn ($mimetype) => $this->mimeTypeLoader->getId($mimetype), Application::IMAGE_MIMES);

		$qb = $this->connection->getQueryBuilder();

		$qb->selectDistinct('meta_value_string')
			->from('filecache', 'file');
		$metadataQuery = $this->filesMetadataManager->getMetadataQuery($qb, 'file', 'fileid');
		$metadataQuery->joinIndex(self::METADATA_KEY);
		$rows = $qb->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypes, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->isNotNull('meta_value_string'))
			->executeQuery()
			->fetchAll();

		return array_map(fn ($row) => new PlaceInfo($userId, $row['meta_value_string']), $rows);
	}

	/** @return PlaceInfo */
	public function findPlaceForUser(string $userId, string $place): PlaceInfo {
		$storageId = $this->rootFolder
			->getUserFolder($userId)
			->getMountPoint()
			->getNumericStorageId();

		$mimetypes = array_map(fn ($mimetype) => $this->mimeTypeLoader->getId($mimetype), Application::IMAGE_MIMES);

		$qb = $this->connection->getQueryBuilder();

		$qb->selectDistinct('meta_value_string')
			->from('filecache', 'file');
		$metadataQuery = $this->filesMetadataManager->getMetadataQuery($qb, 'file', 'fileid');
		$metadataQuery->joinIndex(self::METADATA_KEY);
		$rows = $qb->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypes, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->eq('meta_value_string', $qb->createNamedParameter($place)))
			->andWhere($qb->expr()->isNotNull('meta_value_string'))
			->executeQuery()
			->fetchAll();

		if (count($rows) !== 1) {
			throw new NotFoundException();
		}

		return new PlaceInfo($userId, $rows[0]['meta_value_string']);
	}

	/** @return PlaceFile[] */
	public function findFilesForUserAndPlace(string $userId, string $place) {
		$storageId = $this->rootFolder
			->getUserFolder($userId)
			->getMountPoint()
			->getNumericStorageId();

		$mimetypes = array_map(fn ($mimetype) => $this->mimeTypeLoader->getId($mimetype), Application::IMAGE_MIMES);

		$qb = $this->connection->getQueryBuilder();

		$rows = $qb->select('file.fileid', 'file.name', 'file.mimetype', 'file.size', 'file.mtime', 'file.etag', 'meta_value_string')
			->from('filecache', 'file');
		$metadataQuery = $this->filesMetadataManager->getMetadataQuery($qb, 'file', 'fileid');
		$metadataQuery->joinIndex(self::METADATA_KEY);
		$rows = $qb->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypes, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->eq('meta_value_string', $qb->createNamedParameter($place)))
			->andWhere($qb->expr()->isNotNull('meta_value_string'))
			->executeQuery()
			->fetchAll();

		return array_map(
			fn ($row) => new PlaceFile(
				(int)$row['fileid'],
				$row['name'],
				$this->mimeTypeLoader->getMimetypeById($row['mimetype']),
				(int)$row['size'],
				(int)$row['mtime'],
				$row['etag'],
				$row['meta_value_string']
			),
			$rows,
		);
	}

	public function findFileForUserAndPlace(string $userId, string $place, string $fileId, string $fileName): PlaceFile {
		$storageId = $this->rootFolder
			->getUserFolder($userId)
			->getMountPoint()
			->getNumericStorageId();

		$mimetypes = array_map(fn ($mimetype) => $this->mimeTypeLoader->getId($mimetype), Application::IMAGE_MIMES);

		$qb = $this->connection->getQueryBuilder();

		$rows = $qb->select('file.fileid', 'file.name', 'file.mimetype', 'file.size', 'file.mtime', 'file.etag', 'meta_value_string')
			->from('filecache', 'file');
		$metadataQuery = $this->filesMetadataManager->getMetadataQuery($qb, 'file', 'fileid');
		$metadataQuery->joinIndex(self::METADATA_KEY);
		$rows = $qb->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('file.fileid', $qb->createNamedParameter($fileId)))
			->andWhere($qb->expr()->eq('file.name', $qb->createNamedParameter($fileName)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypes, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->eq('meta_value_string', $qb->createNamedParameter($place)))
			->andWhere($qb->expr()->isNotNull('meta_value_string'))
			->executeQuery()
			->fetchAll();

		if (count($rows) !== 1) {
			throw new NotFoundException();
		}

		return new PlaceFile(
			(int)$rows[0]['fileid'],
			$rows[0]['name'],
			$this->mimeTypeLoader->getMimetypeById($rows[0]['mimetype']),
			(int)$rows[0]['size'],
			(int)$rows[0]['mtime'],
			$rows[0]['etag'],
			$rows[0]['meta_value_string']
		);
	}

	public function setPlaceForFile(string $place, int $fileId): void {
		$metadata = $this->filesMetadataManager->getMetadata($fileId, true);
		$metadata->setString('gps', $place, true);
	}
}
