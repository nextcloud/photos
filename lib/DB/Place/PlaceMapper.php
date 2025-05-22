<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB\Place;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IMimeTypeLoader;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IDBConnection;

class PlaceMapper {
	public function __construct(
		private readonly IDBConnection $connection,
		private readonly IMimeTypeLoader $mimeTypeLoader,
		private readonly IRootFolder $rootFolder,
		private readonly IFilesMetadataManager $filesMetadataManager,
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
		$metadataQuery->joinIndex(PlaceMetadataProvider::METADATA_KEY);
		$rows = $qb->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypes, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->isNotNull('meta_value_string'))
			->executeQuery()
			->fetchAll();

		return array_map(fn ($row): PlaceInfo => new PlaceInfo($userId, $row['meta_value_string']), $rows);
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
		$metadataQuery->joinIndex(PlaceMetadataProvider::METADATA_KEY);
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
		$metadataQuery->joinIndex(PlaceMetadataProvider::METADATA_KEY);
		$rows = $qb->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypes, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->eq('meta_value_string', $qb->createNamedParameter($place)))
			->andWhere($qb->expr()->isNotNull('meta_value_string'))
			->executeQuery()
			->fetchAll();

		return array_map(
			fn ($row): PlaceFile => new PlaceFile(
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
		$metadataQuery->joinIndex(PlaceMetadataProvider::METADATA_KEY);
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
}
