<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\DB;

use OCA\Photos\DB\Place\PlaceInfo;
use OCA\Photos\DB\Place\PlaceMapper;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IMimeTypeLoader;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\Mount\IMountPoint;
use OCP\Files\NotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IDBConnection;
use OCP\Server;
use Test\TestCase;

/**
 * @group DB
 */
class PlaceMapperTest extends TestCase {
	private const STORAGE_ID = -4242;

	private IDBConnection $connection;
	private IMimeTypeLoader $mimeLoader;
	private PlaceMapper $mapper;
	/** @var int[] */
	private array $createdFiles = [];

	protected function setUp(): void {
		parent::setUp();

		$this->connection = Server::get(IDBConnection::class);
		$this->mimeLoader = Server::get(IMimeTypeLoader::class);

		$mountPoint = $this->createMock(IMountPoint::class);
		$mountPoint->method('getNumericStorageId')->willReturn(self::STORAGE_ID);
		$userFolder = $this->createMock(IUserFolder::class);
		$userFolder->method('getMountPoint')->willReturn($mountPoint);
		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->with('user1')->willReturn($userFolder);

		$this->mapper = new PlaceMapper(
			$this->connection,
			$this->mimeLoader,
			$rootFolder,
			Server::get(IFilesMetadataManager::class),
		);
	}

	protected function tearDown(): void {
		foreach (['filecache' => 'fileid', 'files_metadata_index' => 'file_id'] as $table => $column) {
			$query = $this->connection->getQueryBuilder();
			$query->delete($table)
				->where($query->expr()->in($column, $query->createNamedParameter($this->createdFiles, IQueryBuilder::PARAM_INT_ARRAY)))
				->executeStatement();
		}
		$this->createdFiles = [];

		parent::tearDown();
	}

	private function createPhoto(string $place, ?string $country): void {
		$name = 'photo' . count($this->createdFiles) . '.jpg';
		$query = $this->connection->getQueryBuilder();
		$query->insert('filecache')
			->values([
				'storage' => $query->createNamedParameter(self::STORAGE_ID, IQueryBuilder::PARAM_INT),
				'parent' => $query->createNamedParameter(-1, IQueryBuilder::PARAM_INT),
				'path' => $query->createNamedParameter('files/' . $name),
				'path_hash' => $query->createNamedParameter(md5('files/' . $name)),
				'name' => $query->createNamedParameter($name),
				'mimetype' => $query->createNamedParameter($this->mimeLoader->getId('image/jpeg'), IQueryBuilder::PARAM_INT),
				'mimepart' => $query->createNamedParameter($this->mimeLoader->getId('image'), IQueryBuilder::PARAM_INT),
				'size' => $query->createNamedParameter(10, IQueryBuilder::PARAM_INT),
				'mtime' => $query->createNamedParameter(10000, IQueryBuilder::PARAM_INT),
				'storage_mtime' => $query->createNamedParameter(10000, IQueryBuilder::PARAM_INT),
				'permissions' => $query->createNamedParameter(31, IQueryBuilder::PARAM_INT),
				'etag' => $query->createNamedParameter('dummy'),
			]);
		$query->executeStatement();
		$fileId = $query->getLastInsertId();
		$this->createdFiles[] = $fileId;

		$metadata = [PlaceMetadataProvider::METADATA_KEY => $place];
		if ($country !== null) {
			$metadata[PlaceMetadataProvider::METADATA_KEY_COUNTRY] = $country;
		}
		foreach ($metadata as $key => $value) {
			$query = $this->connection->getQueryBuilder();
			$query->insert('files_metadata_index')
				->values([
					'file_id' => $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT),
					'meta_key' => $query->createNamedParameter($key),
					'meta_value_string' => $query->createNamedParameter($value),
				])
				->executeStatement();
		}
	}

	/**
	 * @param PlaceInfo[] $places
	 * @return array<string, string> country codes, by place name
	 */
	private static function countriesByPlace(array $places): array {
		$countries = [];
		foreach ($places as $place) {
			$countries[$place->getPlace()] = $place->getCountryCode();
		}
		ksort($countries);
		return $countries;
	}

	public function testListsOnePlacePerNameWithItsCountry(): void {
		$this->createPhoto('Paris', 'FR');
		$this->createPhoto('Paris', 'FR');
		$this->createPhoto('Paris', 'US');
		$this->createPhoto('Paris', null);
		$this->createPhoto('Berlin', 'DE');
		$this->createPhoto('Vanves', null);

		$this->assertSame(
			['Berlin' => 'DE', 'Paris' => 'FR', 'Vanves' => ''],
			self::countriesByPlace($this->mapper->findPlacesForUser('user1')),
		);
	}

	public function testFindsAPlaceWithItsCountry(): void {
		$this->createPhoto('Paris', 'US');
		$this->createPhoto('Paris', 'FR');
		$this->createPhoto('Paris', 'FR');
		$this->createPhoto('Berlin', 'DE');

		$place = $this->mapper->findPlaceForUser('user1', 'Paris');

		$this->assertSame('Paris', $place->getPlace());
		$this->assertSame('FR', $place->getCountryCode());
	}

	public function testFindsAPlaceWithoutCountry(): void {
		$this->createPhoto('Vanves', null);

		$this->assertSame('', $this->mapper->findPlaceForUser('user1', 'Vanves')->getCountryCode());
	}

	public function testDoesNotFindAPlaceWithoutPhotos(): void {
		$this->createPhoto('Paris', 'FR');

		$this->expectException(NotFoundException::class);
		$this->mapper->findPlaceForUser('user1', 'Berlin');
	}
}
