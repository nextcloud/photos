<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Album;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use OCA\Photos\Exception\AlreadyInAlbumException;
use OCA\Photos\Filters\FiltersManager;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IMimeTypeLoader;
use OCP\IDBConnection;
use OCP\IGroupManager;
use OCP\IL10N;
use OCP\IUserManager;
use OCP\Security\ISecureRandom;

class AlbumMapper {

	// Same mapping as IShare.
	public const TYPE_USER = 0;
	public const TYPE_GROUP = 1;
	public const TYPE_LINK = 3;

	public function __construct(
		private readonly IDBConnection $connection,
		private readonly IMimeTypeLoader $mimeTypeLoader,
		private readonly ITimeFactory $timeFactory,
		private readonly IUserManager $userManager,
		private readonly IGroupManager $groupManager,
		private readonly IL10N $l,
		private readonly ISecureRandom $random,
		private readonly FiltersManager $filtersManager,
	) {
	}

	public function create(string $userId, string $name, string $location = '', ?string $filters = null): AlbumInfo {
		$created = $this->timeFactory->getTime();
		$query = $this->connection->getQueryBuilder();
		$query->insert('photos_albums')
			->values([
				'user' => $query->createNamedParameter($userId),
				'name' => $query->createNamedParameter($name),
				'location' => $query->createNamedParameter($location),
				'created' => $query->createNamedParameter($created, IQueryBuilder::PARAM_INT),
				'last_added_photo' => $query->createNamedParameter(-1, IQueryBuilder::PARAM_INT),
				'filters' => $query->createNamedParameter($filters, IQueryBuilder::PARAM_STR),
			]);
		$query->executeStatement();
		$id = $query->getLastInsertId();

		return new AlbumInfo($id, $userId, $name, $location, $created, -1, $filters);
	}

	public function get(int $id): ?AlbumInfo {
		$query = $this->connection->getQueryBuilder();
		$query->select('name', 'user', 'location', 'created', 'last_added_photo', 'filters')
			->from('photos_albums')
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$row = $query->executeQuery()->fetch();
		if ($row) {
			return new AlbumInfo($id, $row['user'], $row['name'], $row['location'], (int)$row['created'], (int)$row['last_added_photo'], $row['filters']);
		} else {
			return null;
		}
	}

	/**
	 * @return AlbumInfo[]
	 */
	public function getForUser(string $userId): array {
		$query = $this->connection->getQueryBuilder();
		$query->select('album_id', 'name', 'location', 'created', 'last_added_photo', 'filters')
			->from('photos_albums')
			->where($query->expr()->eq('user', $query->createNamedParameter($userId)));
		$rows = $query->executeQuery()->fetchAll();
		return array_map(fn (array $row): AlbumInfo => new AlbumInfo((int)$row['album_id'], $userId, $row['name'], $row['location'], (int)$row['created'], (int)$row['last_added_photo'], $row['filters']), $rows);
	}

	/**
	 * @return AlbumInfo
	 */
	public function getByName(string $albumName, string $userName): ?AlbumInfo {
		$query = $this->connection->getQueryBuilder();
		$query->select('album_id', 'location', 'created', 'last_added_photo', 'filters')
			->from('photos_albums')
			->where($query->expr()->eq('name', $query->createNamedParameter($albumName)))
			->andWhere($query->expr()->eq('user', $query->createNamedParameter($userName)));
		$row = $query->executeQuery()->fetch();
		if ($row) {
			return new AlbumInfo((int)$row['album_id'], $userName, $albumName, $row['location'], (int)$row['created'], (int)$row['last_added_photo'], $row['filters']);
		} else {
			return null;
		}
	}

	/**
	 * @return AlbumInfo[]
	 */
	public function getForFile(int $fileId): array {
		$query = $this->connection->getQueryBuilder();
		$query->select('a.album_id', 'name', 'user', 'location', 'created', 'last_added_photo', 'filters')
			->from('photos_albums', 'a')
			->leftJoin('a', 'photos_albums_files', 'p', $query->expr()->eq('a.album_id', 'p.album_id'))
			->where($query->expr()->eq('file_id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$rows = $query->executeQuery()->fetchAll();
		return array_map(fn (array $row): AlbumInfo => new AlbumInfo((int)$row['album_id'], $row['user'], $row['name'], $row['location'], (int)$row['created'], (int)$row['last_added_photo'], $row['filters']), $rows);
	}

	/**
	 * @return AlbumInfo[]
	 */
	public function getForUserAndFile(string $userId, int $fileId): array {
		$query = $this->connection->getQueryBuilder();
		$query->select('a.album_id', 'name', 'user', 'location', 'created', 'last_added_photo', 'filters')
			->from('photos_albums', 'a')
			->leftJoin('a', 'photos_albums_files', 'p', $query->expr()->eq('a.album_id', 'p.album_id'))
			->where($query->expr()->eq('user', $query->createNamedParameter($userId)))
			->andWhere($query->expr()->eq('file_id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$rows = $query->executeQuery()->fetchAll();
		return array_map(fn (array $row): AlbumInfo => new AlbumInfo((int)$row['album_id'], $row['user'], $row['name'], $row['location'], (int)$row['created'], (int)$row['last_added_photo'], $row['filters']), $rows);
	}

	public function rename(int $id, string $newName): void {
		$query = $this->connection->getQueryBuilder();
		$query->update('photos_albums')
			->set('name', $query->createNamedParameter($newName))
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();
	}

	public function setLocation(int $id, string $newLocation): void {
		$query = $this->connection->getQueryBuilder();
		$query->update('photos_albums')
			->set('location', $query->createNamedParameter($newLocation))
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();
	}

	public function delete(int $id): void {
		$this->connection->beginTransaction();

		$query = $this->connection->getQueryBuilder();
		$query->delete('photos_albums')
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();

		$query = $this->connection->getQueryBuilder();
		$query->delete('photos_albums_files')
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();

		$query = $this->connection->getQueryBuilder();
		$query->delete('photos_albums_collabs')
			->where($query->expr()->eq('album_id', $query->createNamedParameter($id, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();

		$this->connection->commit();
	}

	/**
	 * @return AlbumFile[]
	 */
	public function getForAlbumIdAndUserWithFiles(int $albumId, string $userId, array $filters): array {
		$query = $this->connection->getQueryBuilder();
		$query->select('fileid', 'mimetype', 'a.album_id', 'size', 'mtime', 'etag', 'added', 'owner')
			->selectAlias('f.name', 'file_name')
			->selectAlias('a.name', 'album_name')
			->from('photos_albums', 'a')
			->leftJoin('a', 'photos_albums_files', 'p', $query->expr()->eq('a.album_id', 'p.album_id'))
			->leftJoin('p', 'filecache', 'f', $query->expr()->eq('p.file_id', 'f.fileid'))
			->where($query->expr()->eq('a.album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('user', $query->createNamedParameter($userId)));
		$rows = $query->executeQuery()->fetchAll();

		$files = [];
		foreach ($rows as $row) {
			if ($row['fileid']) {
				$mimeType = $this->mimeTypeLoader->getMimetypeById((int)$row['mimetype']);
				$files[] = new AlbumFile((int)$row['fileid'], $row['file_name'], $mimeType, (int)$row['size'], (int)$row['mtime'], $row['etag'], (int)$row['added'], $row['owner'], 'user');
			}
		}

		$fileIds = array_map(fn ($file) => $file->getFileId(), $files);

		$smartAlbumFiles = array_filter(
			$this->filtersManager->getFilesBasedOnFilters($userId, $filters),
			fn ($file) => array_search($file->getFileId(), $fileIds) === false,
		);

		return [...$files, ...$smartAlbumFiles];
	}

	public function getForAlbumIdAndFileId(int $albumId, int $fileId): ?AlbumFile {
		$query = $this->connection->getQueryBuilder();
		$query->select('fileid', 'mimetype', 'a.album_id', 'user', 'size', 'mtime', 'etag', 'location', 'created', 'last_added_photo', 'added', 'owner')
			->selectAlias('f.name', 'file_name')
			->selectAlias('a.name', 'album_name')
			->from('photos_albums', 'a')
			->leftJoin('a', 'photos_albums_files', 'p', $query->expr()->eq('a.album_id', 'p.album_id'))
			->leftJoin('p', 'filecache', 'f', $query->expr()->eq('p.file_id', 'f.fileid'))
			->where($query->expr()->eq('a.album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('file_id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$row = $query->executeQuery()->fetchAll()[0];

		if ($row === null) {
			return null;
		}

		$mimeType = $this->mimeTypeLoader->getMimetypeById((int)$row['mimetype']);
		return new AlbumFile((int)$row['fileid'], $row['file_name'], $mimeType, (int)$row['size'], (int)$row['mtime'], $row['etag'], (int)$row['added'], $row['owner'], 'user');
	}

	public function addFile(int $albumId, int $fileId, string $owner): void {
		$added = $this->timeFactory->getTime();
		try {
			$query = $this->connection->getQueryBuilder();
			$query->insert('photos_albums_files')
				->values([
					'album_id' => $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT),
					'file_id' => $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT),
					'added' => $query->createNamedParameter($added, IQueryBuilder::PARAM_INT),
					'owner' => $query->createNamedParameter($owner),
				]);
			$query->executeStatement();
		} catch (UniqueConstraintViolationException $e) {
			throw new AlreadyInAlbumException('File already in album', 0, $e);
		}

		$query = $this->connection->getQueryBuilder();
		$query->update('photos_albums')
			->set('last_added_photo', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT))
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();
	}

	public function removeFile(int $albumId, int $fileId): void {
		$query = $this->connection->getQueryBuilder();
		$query->delete('photos_albums_files')
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('file_id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$query->executeStatement();

		$query = $this->connection->getQueryBuilder();
		$query->update('photos_albums')
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
		$query->update('photos_albums')
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
			->from('photos_albums_files')
			->where($query->expr()->eq('owner', $query->createNamedParameter($ownerId)))
			->andWhere($query->expr()->eq('file_id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)))
			->executeQuery()
			->fetchAll();

		// Remove any occurrence of fileId when owner is ownerId.
		$query = $this->connection->getQueryBuilder();
		$query->delete('photos_albums_files')
			->where($query->expr()->eq('owner', $query->createNamedParameter($ownerId)))
			->andWhere($query->expr()->eq('file_id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)))
			->executeStatement();

		// Update last_added_photo for concerned albums.
		foreach ($albumsRows as $row) {
			$query = $this->connection->getQueryBuilder();
			$query->update('photos_albums')
				->set('last_added_photo', $query->createNamedParameter($this->getLastAdded($row['album_id']), IQueryBuilder::PARAM_INT))
				->where($query->expr()->eq('album_id', $query->createNamedParameter($row['album_id'], IQueryBuilder::PARAM_INT)));
			$query->executeStatement();
		}
	}

	private function getLastAdded(int $albumId): int {
		$query = $this->connection->getQueryBuilder();
		$query->select('file_id')
			->from('photos_albums_files')
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->orderBy('added', 'DESC')
			->setMaxResults(1);
		$id = $query->executeQuery()->fetchOne();
		if ($id === false) {
			return -1;
		} else {
			return (int)$id;
		}
	}

	/**
	 * @return array<array{'id': string, 'label': string, 'type': int}>
	 */
	public function getCollaborators(int $albumId): array {
		$query = $this->connection->getQueryBuilder();
		$query->select('collaborator_id', 'collaborator_type')
			->from('photos_albums_collabs')
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)));

		$rows = $query->executeQuery()->fetchAll();

		$collaborators = array_map(function (array $row) {
			/** @var string|null */
			$displayName = null;

			$displayName = match ($row['collaborator_type']) {
				self::TYPE_USER => $this->userManager->get($row['collaborator_id'])?->getDisplayName(),
				self::TYPE_GROUP => $this->groupManager->get($row['collaborator_id'])?->getDisplayName(),
				self::TYPE_LINK => $this->l->t('Public link'),
				default => throw new \Exception('Invalid collaborator type: ' . $row['collaborator_type']),
			};

			if (is_null($displayName)) {
				return null;
			}

			return [
				'id' => $row['collaborator_id'],
				'label' => $displayName,
				'type' => (int)$row['collaborator_type'],
			];
		}, $rows);

		return array_values(array_filter($collaborators, fn ($c): bool => $c !== null));
	}


	public function isCollaborator(int $albumId, string $userId): bool {
		$query = $this->connection->getQueryBuilder();
		$query->select('collaborator_id', 'collaborator_type')
			->from('photos_albums_collabs')
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
	 * @param array{'id': string, 'type': int} $collaborators
	 */
	public function setCollaborators(int $albumId, array $collaborators): void {
		$existingCollaborators = $this->getCollaborators($albumId);

		// Different behavior if type is link to prevent creating multiple link.
		$computeKey = (fn ($c): string => ($c['type'] === AlbumMapper::TYPE_LINK ? '' : $c['id']) . $c['type']);

		$collaboratorsToAdd = array_udiff($collaborators, $existingCollaborators, fn ($a, $b): int => strcmp($computeKey($a), $computeKey($b)));
		$collaboratorsToRemove = array_udiff($existingCollaborators, $collaborators, fn ($a, $b): int => strcmp($computeKey($a), $computeKey($b)));

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
	 * @return AlbumInfo[]
	 */
	public function getSharedAlbumsForCollaborator(string $collaboratorId, int $collaboratorType): array {
		$query = $this->connection->getQueryBuilder();
		$rows = $query
			->select('a.album_id', 'name', 'user', 'location', 'created', 'last_added_photo', 'filters')
			->from('photos_albums_collabs', 'c')
			->leftJoin('c', 'photos_albums', 'a', $query->expr()->eq('a.album_id', 'c.album_id'))
			->where($query->expr()->eq('collaborator_id', $query->createNamedParameter($collaboratorId)))
			->andWhere($query->expr()->eq('collaborator_type', $query->createNamedParameter($collaboratorType, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->isNotNull('a.album_id'))
			->executeQuery()
			->fetchAll();

		return array_map(fn (array $row): AlbumInfo => new AlbumInfo(
			(int)$row['album_id'],
			$row['user'],
			$row['name'] . ' (' . $row['user'] . ')',
			$row['location'],
			(int)$row['created'],
			(int)$row['last_added_photo'],
			$row['filters'],
		), $rows);
	}

	/**
	 * @return AlbumWithFiles[]
	 */
	public function getSharedAlbumsForCollaboratorWithFiles(string $collaboratorId, int $collaboratorType): array {
		$query = $this->connection->getQueryBuilder();
		$rows = $query
			->select('fileid', 'mimetype', 'a.album_id', 'size', 'mtime', 'etag', 'location', 'created', 'last_added_photo', 'added', 'owner', 'filters')
			->selectAlias('f.name', 'file_name')
			->selectAlias('a.name', 'album_name')
			->selectAlias('a.user', 'album_user')
			->from('photos_albums_collabs', 'c')
			->leftJoin('c', 'photos_albums', 'a', $query->expr()->eq('a.album_id', 'c.album_id'))
			->leftJoin('a', 'photos_albums_files', 'p', $query->expr()->eq('a.album_id', 'p.album_id'))
			->leftJoin('p', 'filecache', 'f', $query->expr()->eq('p.file_id', 'f.fileid'))
			->where($query->expr()->eq('collaborator_id', $query->createNamedParameter($collaboratorId)))
			->andWhere($query->expr()->eq('collaborator_type', $query->createNamedParameter($collaboratorType, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->isNotNull('a.album_id'))
			->executeQuery()
			->fetchAll();

		$filesByAlbum = [];
		$albumsById = [];
		foreach ($rows as $row) {
			$albumId = (int)$row['album_id'];
			if ($row['fileid']) {
				$mimeType = $this->mimeTypeLoader->getMimetypeById((int)$row['mimetype']);
				$filesByAlbum[$albumId][] = new AlbumFile(
					(int)$row['fileid'],
					$row['file_name'],
					$mimeType,
					(int)$row['size'],
					(int)$row['mtime'],
					$row['etag'],
					(int)$row['added'],
					$row['owner'],
					'user',
				);
			}

			if (!isset($albumsById[$albumId])) {
				$albumName = $row['album_name'];
				// Suffix album name with the album owner to prevent duplicates.
				// Not done for public link as it would leak the owner's uid.
				if ($collaboratorType !== self::TYPE_LINK) {
					$albumName = $row['album_name'] . ' (' . $row['album_user'] . ')';
				}
				$albumsById[$albumId] = new AlbumInfo(
					$albumId,
					$row['album_user'],
					$albumName,
					$row['location'],
					(int)$row['created'],
					(int)$row['last_added_photo'],
					$row['filters'],
					$collaboratorType,
				);
			}
		}

		$result = [];
		foreach ($albumsById as $id => $album) {
			$filesByAlbum[$id] ??= [];
			$fileIds = array_map(fn ($file) => $file->getFileId(), $filesByAlbum[$id]);

			$smartAlbumFiles = array_filter(
				$this->filtersManager->getFilesBasedOnFilters($album->getUserId(), $album->getDecodedFilters()),
				fn ($file) => array_search($file->getFileId(), $fileIds) === false,
			);

			$result[] = new AlbumWithFiles($album, $this, [...$filesByAlbum[$id], ...$smartAlbumFiles]);
		}
		return $result;
	}

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

	public function deleteGroupFromAlbumCollaboratorsList(string $groupId, int $albumId): void {
		$query = $this->connection->getQueryBuilder();
		$query->delete('photos_albums_collabs')
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('collaborator_id', $query->createNamedParameter($groupId)))
			->andWhere($query->expr()->eq('collaborator_type', $query->createNamedParameter(self::TYPE_GROUP, IQueryBuilder::PARAM_INT)))
			->executeStatement();
	}

	/**
	 * @return AlbumInfo[]
	 */
	public function getAlbumsForCollaboratorIdAndFileId(string $collaboratorId, int $collaboratorType, int $fileId): array {
		$query = $this->connection->getQueryBuilder();
		$rows = $query
			->select('a.album_id', 'name', 'user', 'location', 'created', 'last_added_photo', 'filters')
			->from('photos_albums_collabs', 'c')
			->leftJoin('c', 'photos_albums', 'a', $query->expr()->eq('a.album_id', 'c.album_id'))
			->leftJoin('a', 'photos_albums_files', 'p', $query->expr()->eq('a.album_id', 'p.album_id'))
			->where($query->expr()->eq('collaborator_id', $query->createNamedParameter($collaboratorId)))
			->andWhere($query->expr()->eq('collaborator_type', $query->createNamedParameter($collaboratorType, IQueryBuilder::PARAM_INT)))
			->andWhere($query->expr()->eq('file_id', $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)))
			->groupBy('a.album_id')
			->executeQuery()
			->fetchAll();


		return array_map(fn (array $row): AlbumInfo => new AlbumInfo(
			(int)$row['album_id'],
			$row['user'],
			$row['name'] . ' (' . $row['user'] . ')',
			$row['location'],
			(int)$row['created'],
			(int)$row['last_added_photo'],
			$row['filters'],
		), $rows);
	}

	public function setAlbumFilters(int $albumId, string $filters): void {
		$query = $this->connection->getQueryBuilder();
		$query->update('photos_albums')
			->set('filters', $query->createNamedParameter($filters))
			->where($query->expr()->eq('album_id', $query->createNamedParameter($albumId, IQueryBuilder::PARAM_STR)));
		$query->executeStatement();
	}
}
