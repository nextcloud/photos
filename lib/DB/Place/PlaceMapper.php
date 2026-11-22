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
		$qb->from('filecache', 'file');
		$this->selectPlaceAndCountry($qb);
		$rows = $qb->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypes, IQueryBuilder::PARAM_INT_ARRAY)))
			->executeQuery()
			->fetchAll();

		return $this->placesFromRows($userId, $rows);
	}

	/** @return PlaceInfo */
	public function findPlaceForUser(string $userId, string $place): PlaceInfo {
		$storageId = $this->rootFolder
			->getUserFolder($userId)
			->getMountPoint()
			->getNumericStorageId();

		$mimetypes = array_map(fn ($mimetype) => $this->mimeTypeLoader->getId($mimetype), Application::IMAGE_MIMES);

		$qb = $this->connection->getQueryBuilder();
		$qb->from('filecache', 'file');
		$placeColumn = $this->selectPlaceAndCountry($qb);
		$rows = $qb->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypes, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->eq($placeColumn, $qb->createNamedParameter($place)))
			->executeQuery()
			->fetchAll();

		$places = $this->placesFromRows($userId, $rows);
		if (count($places) !== 1) {
			throw new NotFoundException();
		}

		return $places[0];
	}

	/**
	 * Select the place and country of the files, counting the files of each pair.
	 *
	 * @return string the place column, to filter on
	 */
	private function selectPlaceAndCountry(IQueryBuilder $qb): string {
		$metadataQuery = $this->filesMetadataManager->getMetadataQuery($qb, 'file', 'fileid');
		$placeColumn = $metadataQuery->joinIndex(PlaceMetadataProvider::METADATA_KEY, true) . '.meta_value_string';
		$countryColumn = $metadataQuery->joinIndex(PlaceMetadataProvider::METADATA_KEY_COUNTRY) . '.meta_value_string';

		$qb->selectAlias($placeColumn, 'place')
			->selectAlias($countryColumn, 'country')
			->selectAlias($qb->func()->count('file.fileid'), 'files')
			->groupBy($placeColumn, $countryColumn);

		return $placeColumn;
	}

	/**
	 * One place per name, in the country most of its files lie in.
	 *
	 * Distinct cities can share a name, and files reverse geocoded before
	 * countries were stored have none.
	 *
	 * @param array<array{place: string, country: ?string, files: int|string}> $rows
	 * @return list<PlaceInfo>
	 */
	private function placesFromRows(string $userId, array $rows): array {
		/** @var array<string, array<string, int>> $countries */
		$countries = [];
		foreach ($rows as $row) {
			$countries[$row['place']] ??= [];
			$country = (string)$row['country'];
			if ($country !== '') {
				$countries[$row['place']][$country] = (int)$row['files'];
			}
		}

		$places = [];
		foreach ($countries as $place => $fileCounts) {
			uksort($fileCounts, fn (string $a, string $b): int => [$fileCounts[$b], $a] <=> [$fileCounts[$a], $b]);
			$places[] = new PlaceInfo($userId, (string)$place, (string)(array_key_first($fileCounts) ?? ''));
		}

		return $places;
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
		$metadataQuery->joinIndex(PlaceMetadataProvider::METADATA_KEY, true);
		$rows = $qb->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypes, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->eq('meta_value_string', $qb->createNamedParameter($place)))
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
		$metadataQuery->joinIndex(PlaceMetadataProvider::METADATA_KEY, true);
		$rows = $qb->where($qb->expr()->eq('file.storage', $qb->createNamedParameter($storageId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('file.fileid', $qb->createNamedParameter($fileId)))
			->andWhere($qb->expr()->eq('file.name', $qb->createNamedParameter($fileName)))
			->andWhere($qb->expr()->in('file.mimetype', $qb->createNamedParameter($mimetypes, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($qb->expr()->eq('meta_value_string', $qb->createNamedParameter($place)))
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
