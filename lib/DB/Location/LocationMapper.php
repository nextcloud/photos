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

namespace OCA\Photos\DB\Location;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IMimeTypeLoader;
use OCP\Files\IRootFolder;
use OCP\IDBConnection;

class LocationMapper {
	public const METADATA_TYPE = 'photos_location';

	public function __construct(
		private IDBConnection $connection,
		private IMimeTypeLoader $mimeTypeLoader,
		private IRootFolder $rootFolder,
	) {
	}

	/** @return LocationInfo[] */
	public function findLocationsForUser(string $userId): array {
		$mountId = $this->rootFolder
			->getUserFolder($userId)
			->getMountPoint()
			->getMountId();
		$mimepart = $this->mimeTypeLoader->getId('image');

		$qb = $this->connection->getQueryBuilder();

		$rows = $qb->selectDistinct('meta.metadata')
			->from('mounts', 'mount')
			->join('mount', 'filecache', 'file', $qb->expr()->eq('file.storage', 'mount.storage_id', IQueryBuilder::PARAM_INT))
			->join('file', 'file_metadata', 'meta', $qb->expr()->eq('file.fileid', 'meta.id', IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('mount.id', $qb->createNamedParameter($mountId), IQueryBuilder::PARAM_INT))
			->andWhere($qb->expr()->eq('file.mimepart', $qb->createNamedParameter($mimepart, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('meta.group_name', $qb->createNamedParameter(self::METADATA_TYPE)))
			->executeQuery()
			->fetchAll();

		return array_map(fn ($row) => new LocationInfo($userId, $row['metadata']), $rows);
	}

	/** @return LocationFile[] */
	public function findFilesForUserAndLocation(string $userId, string $location) {
		$mountId = $this->rootFolder
			->getUserFolder($userId)
			->getMountPoint()
			->getMountId();
		$mimepart = $this->mimeTypeLoader->getId('image');

		$qb = $this->connection->getQueryBuilder();

		$rows = $qb->select('file.fileid', 'file.name', 'file.mimetype', 'file.size', 'file.mtime', 'file.etag', 'meta.metadata')
			->from('mounts', 'mount')
			->join('mount', 'filecache', 'file', $qb->expr()->eq('file.storage', 'mount.storage_id', IQueryBuilder::PARAM_INT))
			->join('file', 'file_metadata', 'meta', $qb->expr()->eq('file.fileid', 'meta.id', IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('mount.id', $qb->createNamedParameter($mountId), IQueryBuilder::PARAM_INT))
			->andWhere($qb->expr()->eq('file.mimepart', $qb->createNamedParameter($mimepart, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('meta.group_name', $qb->createNamedParameter(self::METADATA_TYPE)))
			->andWhere($qb->expr()->eq('meta.metadata', $qb->createNamedParameter($location)))
			->executeQuery()
			->fetchAll();

		return array_map(
			fn ($row) => new LocationFile(
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

	public function setLocationForFile(string $location, int $fileId): void {
		try {
			$query = $this->connection->getQueryBuilder();
			$query->insert('file_metadata')
				->values([
					"id" => $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT),
					"group_name" => $query->createNamedParameter(self::METADATA_TYPE),
					"metadata" => $query->createNamedParameter($location),
				])
				->executeStatement();
		} catch (\Exception $ex) {
			if ($ex->getPrevious() instanceof UniqueConstraintViolationException) {
				$this->updateLocationForFile($location, $fileId);
			}
		}
	}

	public function updateLocationForFile(string $location, int $fileId): void {
		$query = $this->connection->getQueryBuilder();
		$query->update('file_metadata')
			->set("metadata", $query->createNamedParameter($location))
			->where($query->expr()->eq('id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('group_name', $query->createNamedParameter(self::METADATA_TYPE)))
			->executeStatement();
	}
}
