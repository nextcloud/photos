<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022 Robin Appelman <robin@icewind.nl>
 *
 * @license GNU AGPL version 3 or any later version
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

namespace OCA\Photos\Album;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use OCA\Photos\Exception\AlreadyInAlbumException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IMimeTypeLoader;
use OCP\IDBConnection;

class AlbumMapper {
	private IDBConnection $connection;
	private IMimeTypeLoader $mimeTypeLoader;
	private ITimeFactory $timeFactory;

	public function __construct(IDBConnection $connection, IMimeTypeLoader $mimeTypeLoader, ITimeFactory $timeFactory) {
		$this->connection = $connection;
		$this->mimeTypeLoader = $mimeTypeLoader;
		$this->timeFactory = $timeFactory;
	}

	public function create(string $userId, string $name, string $location = ""): AlbumInfo {
		$created = $this->timeFactory->getTime();
		$query = $this->connection->getQueryBuilder();
		$query->insert("photos_albums")
			->values([
				'user' => $query->createNamedParameter($userId),
				'name' => $query->createNamedParameter($name),
				'location' => $query->createNamedParameter($location),
				'created' => $query->createNamedParameter($created, IQueryBuilder::PARAM_INT),
				'last_added_photo' => $query->createNamedParameter(-1, IQueryBuilder::PARAM_INT),
			]);
		$query->executeStatement();
		$id = $query->getLastInsertId();

		return new AlbumInfo($id, $userId, $name, $location, $created, -1);
	}

	public function get(int $id): ?AlbumInfo {
		$query = $this->connection->getQueryBuilder();
		$query->select("name", "user", "location", "created", "last_added_photo")
			->from("photos_albums")
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$row = $query->executeQuery()->fetch();
		if ($row) {
			return new AlbumInfo($id, $row['user'], $row['name'], $row['location'], (int)$row['created'], (int)$row['last_added_photo']);
		} else {
			return null;
		}
	}

	/**
	 * @param string $userId
	 * @return AlbumInfo[]
	 */
	public function getForUser(string $userId): array {
		$query = $this->connection->getQueryBuilder();
		$query->select("album_id", "name", "location", "created", "last_added_photo")
			->from("photos_albums")
			->where($query->expr()->eq('user', $query->createNamedParameter($userId)));
		$rows = $query->executeQuery()->fetchAll();
		return array_map(function (array $row) use ($userId) {
			return new AlbumInfo((int)$row['album_id'], $userId, $row['name'], $row['location'], (int)$row['created'], (int)$row['last_added_photo']);
		}, $rows);
	}

	public function rename(int $id, string $newName): void {
		$query = $this->connection->getQueryBuilder();
		$query->update("photos_albums")
			->set("name", $query->createNamedParameter($newName))
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();
	}

	public function setLocation(int $id, string $newLocation): void {
		$query = $this->connection->getQueryBuilder();
		$query->update("photos_albums")
			->set("location", $query->createNamedParameter($newLocation))
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();
	}

	public function delete(int $id): void {
		$this->connection->beginTransaction();
		$query = $this->connection->getQueryBuilder();
		$query->delete("photos_albums")
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();


		$query = $this->connection->getQueryBuilder();
		$query->delete("photos_albums_files")
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();
		$this->connection->commit();
	}

	/**
	 * @param string $userId
	 * @return AlbumWithFiles[]
	 */
	public function getForUserWithFiles(string $userId): array {
		$query = $this->connection->getQueryBuilder();
		$query->select("fileid", "mimetype", "a.album_id", "size", "mtime", "etag", "location", "created", "last_added_photo", "added")
			->selectAlias("f.name", "file_name")
			->selectAlias("a.name", "album_name")
			->from("photos_albums", "a")
			->leftJoin("a", "photos_albums_files", "p", $query->expr()->eq("a.album_id", "p.album_id"))
			->leftJoin("p", "filecache", "f", $query->expr()->eq("p.file_id", "f.fileid"))
			->where($query->expr()->eq('user', $query->createNamedParameter($userId)));
		$rows = $query->executeQuery()->fetchAll();

		$filesByAlbum = [];
		$albumsById = [];
		foreach ($rows as $row) {
			$albumId = (int)$row['album_id'];
			if ($row['fileid']) {
				$mimeId = $row['mimetype'];
				$mimeType = $this->mimeTypeLoader->getMimetypeById($mimeId);
				$filesByAlbum[$albumId][] = new AlbumFile((int)$row['fileid'], $row['file_name'], $mimeType, (int)$row['size'], (int)$row['mtime'], $row['etag'], (int)$row['added']);
			}

			if (!isset($albumsById[$albumId])) {
				$albumsById[$albumId] = new AlbumInfo($albumId, $userId, $row['album_name'], $row['location'], (int)$row['created'], (int)$row['last_added_photo']);
			}
		}

		$result = [];
		foreach ($albumsById as $id => $album) {
			$result[] = new AlbumWithFiles($album, $filesByAlbum[$id] ?? []);
		}
		return $result;
	}

	public function addFile(int $albumId, int $fileId): void {
		$added = $this->timeFactory->getTime();
		try {
			$query = $this->connection->getQueryBuilder();
			$query->insert("photos_albums_files")
				->values([
					"album_id" => $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT),
					"file_id" => $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT),
					"added" => $query->createNamedParameter($added, IQueryBuilder::PARAM_INT),
				]);
			$query->executeStatement();
		} catch (UniqueConstraintViolationException $e) {
			throw new AlreadyInAlbumException("File already in album", 0, $e);
		}

		$query = $this->connection->getQueryBuilder();
		$query->update("photos_albums")
			->set('last_added_photo', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT))
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();
	}

	public function removeFile(int $albumId, int $fileId): void {
		$query = $this->connection->getQueryBuilder();
		$query->delete("photos_albums_files")
			->where($query->expr()->eq("album_id", $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq("file_id", $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();

		$query = $this->connection->getQueryBuilder();
		$query->update("photos_albums")
			->set('last_added_photo', $query->createNamedParameter($this->getLastAdded($albumId), IQueryBuilder::PARAM_INT))
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();
	}

	private function getLastAdded(int $albumId): int {
		$query = $this->connection->getQueryBuilder();
		$query->select("file_id")
			->from("photos_albums_files")
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->orderBy("added", "DESC")
			->setMaxResults(1);
		$id = $query->executeQuery()->fetchOne();
		if ($id === false) {
			return -1;
		} else {
			return (int)$id;
		}
	}
}
