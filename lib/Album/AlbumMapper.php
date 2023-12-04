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
use OCP\IGroupManager;
use OCP\IL10N;
use OCP\IUserManager;
use OCP\Security\ISecureRandom;

class AlbumMapper {
	private IDBConnection $connection;
	private IMimeTypeLoader $mimeTypeLoader;
	private ITimeFactory $timeFactory;
	private IUserManager $userManager;
	private IGroupManager $groupManager;
	protected IL10N $l;
	protected ISecureRandom $random;

	// Same mapping as IShare.
	public const TYPE_USER = 0;
	public const TYPE_GROUP = 1;
	public const TYPE_LINK = 3;

	public function __construct(
		IDBConnection $connection,
		IMimeTypeLoader $mimeTypeLoader,
		ITimeFactory $timeFactory,
		IUserManager $userManager,
		IGroupManager $groupManager,
		IL10N $l,
		ISecureRandom $random
	) {
		$this->connection = $connection;
		$this->mimeTypeLoader = $mimeTypeLoader;
		$this->timeFactory = $timeFactory;
		$this->userManager = $userManager;
		$this->groupManager = $groupManager;
		$this->l = $l;
		$this->random = $random;
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

	/**
	 * @param int $fileId
	 * @return AlbumInfo[]
	 */
	public function getForFile(int $fileId): array {
		$query = $this->connection->getQueryBuilder();
		$query->select("a.album_id", "name", "user", "location", "created", "last_added_photo")
			->from("photos_albums", "a")
			->leftJoin("a", "photos_albums_files", "p", $query->expr()->eq("a.album_id", "p.album_id"))
			->where($query->expr()->eq('file_id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$rows = $query->executeQuery()->fetchAll();
		return array_map(function (array $row) {
			return new AlbumInfo((int)$row['album_id'], $row['user'], $row['name'], $row['location'], (int)$row['created'], (int)$row['last_added_photo']);
		}, $rows);
	}

	/**
	 * @param string $userId
	 * @param int $fileId
	 * @return AlbumInfo[]
	 */
	public function getForUserAndFile(string $userId, int $fileId): array {
		$query = $this->connection->getQueryBuilder();
		$query->select("a.album_id", "name", "user", "location", "created", "last_added_photo")
			->from("photos_albums", "a")
			->leftJoin("a", "photos_albums_files", "p", $query->expr()->eq("a.album_id", "p.album_id"))
			->where($query->expr()->eq('user', $query->createNamedParameter($userId)))
			->andWhere($query->expr()->eq('file_id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$rows = $query->executeQuery()->fetchAll();
		return array_map(function (array $row) {
			return new AlbumInfo((int)$row['album_id'], $row['user'], $row['name'], $row['location'], (int)$row['created'], (int)$row['last_added_photo']);
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

		$query = $this->connection->getQueryBuilder();
		$query->delete("photos_albums_collabs")
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();

		$this->connection->commit();
	}

	/**
	 * @param int $albumId
	 * @param string $userId
	 * @return AlbumFile[]
	 */
	public function getForAlbumIdAndUserWithFiles(int $albumId, string $userId): array {
		$query = $this->connection->getQueryBuilder();
		$query->select("fileid", "mimetype", "a.album_id", "size", "mtime", "etag", "added", "owner")
			->selectAlias("f.name", "file_name")
			->selectAlias("a.name", "album_name")
			->from("photos_albums", "a")
			->leftJoin("a", "photos_albums_files", "p", $query->expr()->eq("a.album_id", "p.album_id"))
			->leftJoin("p", "filecache", "f", $query->expr()->eq("p.file_id", "f.fileid"))
			->where($query->expr()->eq('a.album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('user', $query->createNamedParameter($userId)));
		$rows = $query->executeQuery()->fetchAll();

		$files = [];
		foreach ($rows as $row) {
			$albumId = (int)$row['album_id'];
			if ($row['fileid']) {
				$mimeId = $row['mimetype'];
				$mimeType = $this->mimeTypeLoader->getMimetypeById($mimeId);
				$files[] = new AlbumFile((int)$row['fileid'], $row['file_name'], $mimeType, (int)$row['size'], (int)$row['mtime'], $row['etag'], (int)$row['added'], $row['owner']);
			}
		}

		return $files;
	}

	/**
	 * @param int $albumId
	 * @param int $fileId
	 * @return AlbumFile
	 */
	public function getForAlbumIdAndFileId(int $albumId, int $fileId): AlbumFile {
		$query = $this->connection->getQueryBuilder();
		$query->select("fileid", "mimetype", "a.album_id", "user", "size", "mtime", "etag", "location", "created", "last_added_photo", "added", "owner")
			->selectAlias("f.name", "file_name")
			->selectAlias("a.name", "album_name")
			->from("photos_albums", "a")
			->leftJoin("a", "photos_albums_files", "p", $query->expr()->eq("a.album_id", "p.album_id"))
			->leftJoin("p", "filecache", "f", $query->expr()->eq("p.file_id", "f.fileid"))
			->where($query->expr()->eq('a.album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('file_id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$row = $query->executeQuery()->fetchAll()[0];

		$mimeId = $row['mimetype'];
		$mimeType = $this->mimeTypeLoader->getMimetypeById($mimeId);
		return new AlbumFile((int)$row['fileid'], $row['file_name'], $mimeType, (int)$row['size'], (int)$row['mtime'], $row['etag'], (int)$row['added'], $row['owner']);
	}

	public function addFile(int $albumId, int $fileId, string $owner): void {
		$added = $this->timeFactory->getTime();
		try {
			$query = $this->connection->getQueryBuilder();
			$query->insert("photos_albums_files")
				->values([
					"album_id" => $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT),
					"file_id" => $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT),
					"added" => $query->createNamedParameter($added, IQueryBuilder::PARAM_INT),
					"owner" => $query->createNamedParameter($owner),
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

	/**
	 * Remove all files added by a user from an album.
	 */
	public function removeFilesForUser(int $albumId, string $userId) {
		// Remove all photos by this user from the album:
		$query = $this->connection->getQueryBuilder();
		$query->delete('photos_albums_files')
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('owner', $query->createNamedParameter($userId)))
			->executeStatement();

		// Update the last added photo:
		$query = $this->connection->getQueryBuilder();
		$query->update("photos_albums")
			->set('last_added_photo', $query->createNamedParameter($this->getLastAdded($albumId), IQueryBuilder::PARAM_INT))
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->executeStatement();
	}

	/**
	 * Remove a given file from any albums in which it was added by a given user.
	 */
	public function removeFileWithOwner(int $fileId, string $ownerId): void {
		// Get concerned albums before deleting them.
		$query = $this->connection->getQueryBuilder();
		$albumsRows = $query->select('album_id')
			->from("photos_albums_files")
			->where($query->expr()->eq("owner", $query->createNamedParameter($ownerId)))
			->andWhere($query->expr()->eq("file_id", $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)))
			->executeQuery()
			->fetchAll();

		// Remove any occurrence of fileId when owner is ownerId.
		$query = $this->connection->getQueryBuilder();
		$query->delete("photos_albums_files")
			->where($query->expr()->eq("owner", $query->createNamedParameter($ownerId)))
			->andWhere($query->expr()->eq("file_id", $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)))
			->executeStatement();

		// Update last_added_photo for concerned albums.
		foreach ($albumsRows as $row) {
			$query = $this->connection->getQueryBuilder();
			$query->update("photos_albums")
				->set('last_added_photo', $query->createNamedParameter($this->getLastAdded($row['album_id']), IQueryBuilder::PARAM_INT))
				->where($query->expr()->eq('album_id', $query->createNamedParameter($row['album_id'], IQueryBuilder::PARAM_INT)));
			$query->executeStatement();
		}
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

	/**
	 * @param int $albumId
	 * @return array<array{'id': string, 'label': string, 'type': int}>
	 */
	public function getCollaborators(int $albumId): array {
		$query = $this->connection->getQueryBuilder();
		$query->select("collaborator_id", "collaborator_type")
			->from("photos_albums_collabs")
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)));

		$rows = $query->executeQuery()->fetchAll();

		$collaborators = array_map(function (array $row) {
			/** @var string|null */
			$displayName = null;

			switch ($row['collaborator_type']) {
				case self::TYPE_USER:
					$displayName = $this->userManager->get($row['collaborator_id'])?->getDisplayName();
					break;
				case self::TYPE_GROUP:
					$displayName = $this->groupManager->get($row['collaborator_id'])?->getDisplayName();
					break;
				case self::TYPE_LINK:
					$displayName = $this->l->t('Public link');
					break;
				default:
					throw new \Exception('Invalid collaborator type: ' . $row['collaborator_type']);
			}

			if (is_null($displayName)) {
				return null;
			}

			return [
				'id' => $row['collaborator_id'],
				'label' => $displayName,
				'type' => (int)$row['collaborator_type'],
			];
		}, $rows);

		return array_values(array_filter($collaborators, fn ($c) => $c !== null));
	}


	/**
	 * @param int $albumId
	 * @param string $userId
	 * @return bool
	 */
	public function isCollaborator(int $albumId, string $userId): bool {
		$query = $this->connection->getQueryBuilder();
		$query->select("collaborator_id", "collaborator_type")
			->from("photos_albums_collabs")
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)));

		$rows = $query->executeQuery()->fetchAll();

		foreach ($rows as $row) {
			switch ($row['collaborator_type']) {
				case self::TYPE_USER:
					if ($row['collaborator_id'] === $userId) {
						return true;
					}
					break;
				case self::TYPE_GROUP:
					if ($this->groupManager->isInGroup($userId, $row['collaborator_id'])) {
						return true;
					}
					break;
				default:
					break;
			}
		}

		return false;
	}

	/**
	 * @param int $albumId
	 * @param array{'id': string, 'type': int} $collaborators
	 */
	public function setCollaborators(int $albumId, array $collaborators): void {
		$existingCollaborators = $this->getCollaborators($albumId);

		// Different behavior if type is link to prevent creating multiple link.
		function computeKey($c) {
			return ($c['type'] === AlbumMapper::TYPE_LINK ? '' : $c['id']).$c['type'];
		}

		$collaboratorsToAdd = array_udiff($collaborators, $existingCollaborators, fn ($a, $b) => strcmp(computeKey($a), computeKey($b)));
		$collaboratorsToRemove = array_udiff($existingCollaborators, $collaborators, fn ($a, $b) => strcmp(computeKey($a), computeKey($b)));

		$this->connection->beginTransaction();

		foreach ($collaboratorsToAdd as $collaborator) {
			switch ($collaborator['type']) {
				case self::TYPE_USER:
					if (is_null($this->userManager->get($collaborator['id']))) {
						throw new \Exception('Unknown collaborator: ' . $collaborator['id']);
					}
					break;
				case self::TYPE_GROUP:
					if (is_null($this->groupManager->get($collaborator['id']))) {
						throw new \Exception('Unknown collaborator: ' . $collaborator['id']);
					}
					break;
				case self::TYPE_LINK:
					$collaborator['id'] = $this->random->generate(32, ISecureRandom::CHAR_UPPER . ISecureRandom::CHAR_LOWER . ISecureRandom::CHAR_DIGITS);
					break;
				default:
					throw new \Exception('Invalid collaborator type: ' . $collaborator['type']);
			}

			$query = $this->connection->getQueryBuilder();
			$query->insert('photos_albums_collabs')
				->setValue('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT))
				->setValue('collaborator_id', $query->createNamedParameter($collaborator['id']))
				->setValue('collaborator_type', $query->createNamedParameter($collaborator['type'], IQueryBuilder::PARAM_INT))
				->executeStatement();
		}

		foreach ($collaboratorsToRemove as $collaborator) {
			switch ($collaborator['type']) {
				case self::TYPE_USER:
					$this->deleteUserFromAlbumCollaboratorsList($collaborator['id'], $albumId);
					break;
				default:
					$query = $this->connection->getQueryBuilder();
					$query->delete('photos_albums_collabs')
						->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
						->andWhere($query->expr()->eq('collaborator_id', $query->createNamedParameter($collaborator['id'])))
						->andWhere($query->expr()->eq('collaborator_type', $query->createNamedParameter($collaborator['type'], IQueryBuilder::PARAM_INT)))
						->executeStatement();
			}
		}

		$this->connection->commit();
	}

	/**
	 * @param string $collaboratorId
	 * @param int $collaboratorType
	 * @return AlbumInfo[]
	 */
	public function getSharedAlbumsForCollaborator(string $collaboratorId, int $collaboratorType): array {
		$query = $this->connection->getQueryBuilder();
		$rows = $query
			->select("a.album_id", "name", "user", "location", "created", "last_added_photo")
			->from("photos_albums_collabs", "c")
			->leftJoin("c", "photos_albums", "a", $query->expr()->eq("a.album_id", "c.album_id"))
			->where($query->expr()->eq('collaborator_id', $query->createNamedParameter($collaboratorId)))
			->andWhere($query->expr()->eq('collaborator_type', $query->createNamedParameter($collaboratorType, IQueryBuilder::PARAM_INT)))
			->executeQuery()
			->fetchAll();

		return array_map(function (array $row) {
			return new AlbumInfo(
				(int)$row['album_id'],
				$row['user'],
				$row['name'].' ('.$row['user'].')',
				$row['location'],
				(int)$row['created'],
				(int)$row['last_added_photo']
			);
		}, $rows);
	}

	/**
	 * @param string $collaboratorId
	 * @param string $collaboratorsType - The type of the collaborator, either a user or a group.
	 * @return AlbumWithFiles[]
	 */
	public function getSharedAlbumsForCollaboratorWithFiles(string $collaboratorId, int $collaboratorType): array {
		$query = $this->connection->getQueryBuilder();
		$rows = $query
			->select("fileid", "mimetype", "a.album_id", "size", "mtime", "etag", "location", "created", "last_added_photo", "added", 'owner')
			->selectAlias("f.name", "file_name")
			->selectAlias("a.name", "album_name")
			->selectAlias("a.user", "album_user")
			->from("photos_albums_collabs", "c")
			->leftJoin("c", "photos_albums", "a", $query->expr()->eq("a.album_id", "c.album_id"))
			->leftJoin("a", "photos_albums_files", "p", $query->expr()->eq("a.album_id", "p.album_id"))
			->leftJoin("p", "filecache", "f", $query->expr()->eq("p.file_id", "f.fileid"))
			->where($query->expr()->eq('collaborator_id', $query->createNamedParameter($collaboratorId)))
			->andWhere($query->expr()->eq('collaborator_type', $query->createNamedParameter($collaboratorType, IQueryBuilder::PARAM_INT)))
			->executeQuery()
			->fetchAll();

		$filesByAlbum = [];
		$albumsById = [];
		foreach ($rows as $row) {
			$albumId = (int)$row['album_id'];
			if ($row['fileid']) {
				$mimeId = $row['mimetype'];
				$mimeType = $this->mimeTypeLoader->getMimetypeById($mimeId);
				$filesByAlbum[$albumId][] = new AlbumFile((int)$row['fileid'], $row['file_name'], $mimeType, (int)$row['size'], (int)$row['mtime'], $row['etag'], (int)$row['added'], $row['owner']);
			}

			if (!isset($albumsById[$albumId])) {
				$albumName = $row['album_name'];
				// Suffix album name with the album owner to prevent duplicates.
				// Not done for public link as it would leak the owner's uid.
				if ($collaboratorType !== self::TYPE_LINK) {
					$albumName = $row['album_name'].' ('.$row['album_user'].')';
				}
				$albumsById[$albumId] = new AlbumInfo($albumId, $row['album_user'], $albumName, $row['location'], (int)$row['created'], (int)$row['last_added_photo'], $collaboratorType);
			}
		}

		$result = [];
		foreach ($albumsById as $id => $album) {
			$result[] = new AlbumWithFiles($album, $this, $filesByAlbum[$id] ?? []);
		}
		return $result;
	}

	/**
	 * @param string $userId
	 * @param int $albumId
	 * @return void
	 */
	public function deleteUserFromAlbumCollaboratorsList(string $userId, int $albumId): void {
		$query = $this->connection->getQueryBuilder();
		$query->delete('photos_albums_collabs')
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('collaborator_id', $query->createNamedParameter($userId)))
			->andWhere($query->expr()->eq('collaborator_type', $query->createNamedParameter(self::TYPE_USER, IQueryBuilder::PARAM_INT)))
			->executeStatement();

		// Remove all photos by this user from the album:
		$this->removeFilesForUser($albumId, $userId);
	}

	/**
	 * @param string $groupId
	 * @param int $albumId
	 * @return void
	 */
	public function deleteGroupFromAlbumCollaboratorsList(string $groupId, int $albumId): void {
		$query = $this->connection->getQueryBuilder();
		$query->delete('photos_albums_collabs')
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('collaborator_id', $query->createNamedParameter($groupId)))
			->andWhere($query->expr()->eq('collaborator_type', $query->createNamedParameter(self::TYPE_GROUP, IQueryBuilder::PARAM_INT)))
			->executeStatement();
	}

	/**
	 * @param string $collaboratorId
	 * @param int $collaboratorType
	 * @param int $fileId
	 * @return AlbumInfo[]
	 */
	public function getAlbumsForCollaboratorIdAndFileId(string $collaboratorId, int $collaboratorType, int $fileId): array {
		$query = $this->connection->getQueryBuilder();
		$rows = $query
			->select("a.album_id", "name", "user", "location", "created", "last_added_photo")
			->from("photos_albums_collabs", "c")
			->leftJoin("c", "photos_albums", "a", $query->expr()->eq("a.album_id", "c.album_id"))
			->leftJoin("a", "photos_albums_files", "p", $query->expr()->eq("a.album_id", "p.album_id"))
			->where($query->expr()->eq('collaborator_id', $query->createNamedParameter($collaboratorId)))
			->andWhere($query->expr()->eq('collaborator_type', $query->createNamedParameter($collaboratorType, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('file_id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)))
			->groupBy('a.album_id')
			->executeQuery()
			->fetchAll();


		return array_map(function (array $row) {
			return new AlbumInfo(
				(int)$row['album_id'],
				$row['user'],
				$row['name'].' ('.$row['user'].')',
				$row['location'],
				(int)$row['created'],
				(int)$row['last_added_photo']
			);
		}, $rows);
	}
}
