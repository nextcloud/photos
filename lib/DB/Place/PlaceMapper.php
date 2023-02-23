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

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IMimeTypeLoader;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IDBConnection;

class PlaceMapper {
	public const METADATA_TYPE = 'photos_place';

	public function __construct(
		private IDBConnection $connection,
		private IMimeTypeLoader $mimeTypeLoader,
		private IRootFolder $rootFolder,
	) {
	}

	/** @return PlaceInfo[] */
	public function findPlacesForUser(string $userId): array {
		$storageId = $this->rootFolder
			->getUserFolder($userId)
			->getMountPoint()
			->getNumericStorageId();

		$mimepart = $this->mimeTypeLoader->getId('image');

		$qb = $this->connection->getQueryBuilder();

		$rows = $qb->selectDistinct('meta.metadata')
			->from('file_metadata', 'meta')
			->join('meta', 'filecache', 'file', $qb->expr()->eq('file.fileid', 'meta.id', IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('file.mimepart', $qb->createNamedParameter($mimepart, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('meta.group_name', $qb->createNamedParameter(self::METADATA_TYPE)))
			->executeQuery()
			->fetchAll();

		return array_map(fn ($row) => new PlaceInfo($userId, $row['metadata']), $rows);
	}

	/** @return PlaceInfo */
	public function findPlaceForUser(string $userId, string $place): PlaceInfo {
		$storageId = $this->rootFolder
			->getUserFolder($userId)
			->getMountPoint()
			->getNumericStorageId();

		$mimepart = $this->mimeTypeLoader->getId('image');

		$qb = $this->connection->getQueryBuilder();

		$rows = $qb->selectDistinct('meta.metadata')
			->from('file_metadata', 'meta')
			->join('meta', 'filecache', 'file', $qb->expr()->eq('file.fileid', 'meta.id', IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('file.mimepart', $qb->createNamedParameter($mimepart, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('meta.group_name', $qb->createNamedParameter(self::METADATA_TYPE)))
			->andWhere($qb->expr()->eq('meta.metadata', $qb->createNamedParameter($place)))
			->executeQuery()
			->fetchAll();

		if (count($rows) !== 1) {
			throw new NotFoundException();
		}

		return new PlaceInfo($userId, $rows[0]['metadata']);
	}

	/** @return PlaceFile[] */
	public function findFilesForUserAndPlace(string $userId, string $place) {
		$storageId = $this->rootFolder
			->getUserFolder($userId)
			->getMountPoint()
			->getNumericStorageId();

		$mimepart = $this->mimeTypeLoader->getId('image');

		$qb = $this->connection->getQueryBuilder();

		$rows = $qb->select('file.fileid', 'file.name', 'file.mimetype', 'file.size', 'file.mtime', 'file.etag', 'meta.metadata')
			->from('file_metadata', 'meta')
			->join('meta', 'filecache', 'file', $qb->expr()->eq('file.fileid', 'meta.id', IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('file.mimepart', $qb->createNamedParameter($mimepart, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('meta.group_name', $qb->createNamedParameter(self::METADATA_TYPE)))
			->andWhere($qb->expr()->eq('meta.metadata', $qb->createNamedParameter($place)))
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
				$row['metadata']
			),
			$rows,
		);
	}

	public function findFileForUserAndPlace(string $userId, string $place, string $fileId, string $fileName): PlaceFile {
		$storageId = $this->rootFolder
			->getUserFolder($userId)
			->getMountPoint()
			->getNumericStorageId();

		$mimepart = $this->mimeTypeLoader->getId('image');

		$qb = $this->connection->getQueryBuilder();

		$rows = $qb->select('file.fileid', 'file.name', 'file.mimetype', 'file.size', 'file.mtime', 'file.etag', 'meta.metadata')
			->from('file_metadata', 'meta')
			->join('meta', 'filecache', 'file', $qb->expr()->eq('file.fileid', 'meta.id', IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('file.mimepart', $qb->createNamedParameter($mimepart, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('file.fileid', $qb->createNamedParameter($fileId)))
			->andWhere($qb->expr()->eq('file.name', $qb->createNamedParameter($fileName)))
			->andWhere($qb->expr()->eq('meta.group_name', $qb->createNamedParameter(self::METADATA_TYPE)))
			->andWhere($qb->expr()->eq('meta.metadata', $qb->createNamedParameter($place)))
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
			$rows[0]['metadata']
		);
	}

	public function setPlaceForFile(string $place, int $fileId): void {
		try {
			$query = $this->connection->getQueryBuilder();
			$query->insert('file_metadata')
				->values([
					"id" => $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT),
					"group_name" => $query->createNamedParameter(self::METADATA_TYPE),
					"metadata" => $query->createNamedParameter($place),
				])
				->executeStatement();
		} catch (\Exception $ex) {
			if ($ex->getPrevious() instanceof UniqueConstraintViolationException) {
				$this->updatePlaceForFile($place, $fileId);
			}
		}
	}

	public function updatePlaceForFile(string $place, int $fileId): void {
		$query = $this->connection->getQueryBuilder();
		$query->update('file_metadata')
			->set("metadata", $query->createNamedParameter($place))
			->where($query->expr()->eq('id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('group_name', $query->createNamedParameter(self::METADATA_TYPE)))
			->executeStatement();
	}
}
