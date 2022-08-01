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

use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IMimeTypeLoader;
use OCP\IDBConnection;

class AlbumMapper {
	private IDBConnection $connection;
	private IMimeTypeLoader $mimeTypeLoader;

	public function __construct(IDBConnection $connection, IMimeTypeLoader $mimeTypeLoader) {
		$this->connection = $connection;
		$this->mimeTypeLoader = $mimeTypeLoader;
	}

	public function create(string $userId, string $name): AlbumInfo {
		$query = $this->connection->getQueryBuilder();
		$query->insert("photos_albums")
			->values([
				'user' => $query->createNamedParameter($userId),
				'name' => $query->createNamedParameter($name),
			]);
		$query->executeStatement();
		$id = $query->getLastInsertId();

		return new AlbumInfo($id, $userId, $name);
	}

	public function get(int $id): ?AlbumInfo {
		$query = $this->connection->getQueryBuilder();
		$query->select("name", "user")
			->from("photos_albums")
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$row = $query->executeQuery()->fetch();
		if ($row) {
			return new AlbumInfo($id, $row['user'], $row['name']);
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
		$query->select("album_id", "name")
			->from("photos_albums")
			->where($query->expr()->eq('user', $query->createNamedParameter($userId)));
		$rows = $query->executeQuery()->fetchAll();
		return array_map(function (array $row) use ($userId) {
			return new AlbumInfo($row['album_id'], $userId, $row['name']);
		}, $rows);
	}

	public function rename(int $id, string $newName): void {
		$query = $this->connection->getQueryBuilder();
		$query->update("photos_albums")
			->set("name", $query->createNamedParameter($newName))
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
		$query->select("fileid", "mimetype", "a.album_id", "size", "mtime", "etag")
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
			$albumId = $row['album_id'];
			if ($row['fileid']) {
				$mimeId = $row['mimetype'];
				$mimeType = $this->mimeTypeLoader->getMimetypeById($mimeId);
				$filesByAlbum[$albumId][] = new AlbumFile($row['fileid'], $row['file_name'], $mimeType, $row['size'], $row['mtime'], $row['etag']);
			}

			if (!isset($albumsById[$albumId])) {
				$albumsById[$albumId] = new AlbumInfo($albumId, $userId, $row['album_name']);
			}
		}

		$result = [];
		foreach ($albumsById as $id => $album) {
			$result[] = new AlbumWithFiles($album, $filesByAlbum[$id] ?? []);
		}
		return $result;
	}

	public function addFile(int $albumId, int $fileId): void {
		$query = $this->connection->getQueryBuilder();
		$query->insert("photos_albums_files")
			->values([
				"album_id" => $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT),
				"file_id" => $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)
			]);
		$query->executeStatement();
	}

	public function removeFile(int $albumId, int $fileId): void {
		$query = $this->connection->getQueryBuilder();
		$query->delete("photos_albums_files")
			->where($query->expr()->eq("album_id", $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq("file_id", $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();
	}
}
