<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\DB;

use OCA\Photos\DB\OnThisDay\OnThisDayMapper;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IMimeTypeLoader;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IDBConnection;
use OCP\Server;
use Test\TestCase;

/**
 * @group DB
 */
class OnThisDayMapperTest extends TestCase {
	private const int STORAGE_ID = -4252;
	private const int OTHER_STORAGE_ID = -4253;

	/** 2025-11-22 00:00:00 UTC */
	private const int ONE_YEAR_AGO = 1763769600;
	/** 2023-11-22 00:00:00 UTC */
	private const int THREE_YEARS_AGO = 1700611200;

	private IDBConnection $connection;
	private IMimeTypeLoader $mimeTypeLoader;
	private IFilesMetadataManager $metadataManager;
	private OnThisDayMapper $mapper;
	/** @var list<int> */
	private array $createdFiles = [];

	protected function setUp(): void {
		parent::setUp();

		$this->connection = Server::get(IDBConnection::class);
		$this->mimeTypeLoader = Server::get(IMimeTypeLoader::class);
		$this->metadataManager = Server::get(IFilesMetadataManager::class);
		$this->mapper = new OnThisDayMapper($this->connection, $this->metadataManager);
	}

	protected function tearDown(): void {
		$query = $this->connection->getQueryBuilder();
		$query->delete('filecache')
			->where($query->expr()->eq('fileid', $query->createParameter('fileid')));
		foreach ($this->createdFiles as $fileId) {
			$this->metadataManager->deleteMetadata($fileId);
			$query->setParameter('fileid', $fileId);
			$query->executeStatement();
		}
		$this->createdFiles = [];

		parent::tearDown();
	}

	private function createFile(string $path, ?int $takenAt, string $mimeType = 'image/jpeg', int $storageId = self::STORAGE_ID): void {
		$query = $this->connection->getQueryBuilder();
		$query->insert('filecache')
			->values([
				'storage' => $query->createNamedParameter($storageId, IQueryBuilder::PARAM_INT),
				'parent' => $query->createNamedParameter(-1, IQueryBuilder::PARAM_INT),
				'path' => $query->createNamedParameter($path),
				'path_hash' => $query->createNamedParameter(md5($path)),
				'name' => $query->createNamedParameter(basename($path)),
				'mimetype' => $query->createNamedParameter($this->mimeTypeLoader->getId($mimeType), IQueryBuilder::PARAM_INT),
				'mimepart' => $query->createNamedParameter($this->mimeTypeLoader->getId(explode('/', $mimeType)[0]), IQueryBuilder::PARAM_INT),
				'size' => $query->createNamedParameter(10, IQueryBuilder::PARAM_INT),
				'mtime' => $query->createNamedParameter(self::ONE_YEAR_AGO, IQueryBuilder::PARAM_INT),
				'storage_mtime' => $query->createNamedParameter(self::ONE_YEAR_AGO, IQueryBuilder::PARAM_INT),
				'permissions' => $query->createNamedParameter(31, IQueryBuilder::PARAM_INT),
				'etag' => $query->createNamedParameter('dummy'),
			]);
		$query->executeStatement();
		$fileId = $query->getLastInsertId();
		$this->createdFiles[] = $fileId;

		if ($takenAt !== null) {
			$metadata = $this->metadataManager->getMetadata($fileId, true);
			$metadata->setInt(OriginalDateTimeMetadataProvider::METADATA_KEY, $takenAt, true);
			$this->metadataManager->saveMetadata($metadata);
		}
	}

	/**
	 * @return array<int, array{int, int}>
	 */
	private function ranges(): array {
		return [
			1 => [self::ONE_YEAR_AGO, self::ONE_YEAR_AGO + 86399],
			3 => [self::THREE_YEARS_AGO, self::THREE_YEARS_AGO + 86399],
		];
	}

	/**
	 * @return list<int>
	 */
	private function mediaMimeIds(): array {
		return [
			$this->mimeTypeLoader->getId('image/jpeg'),
			$this->mimeTypeLoader->getId('video/mp4'),
		];
	}

	public function testCountsTheFilesOfEachRange(): void {
		$this->createFile('files/Photos/a.jpg', self::ONE_YEAR_AGO);
		$this->createFile('files/Photos/b.jpg', self::ONE_YEAR_AGO + 86399);
		$this->createFile('files/Photos/sub/c.mp4', self::THREE_YEARS_AGO + 3600, 'video/mp4');
		$this->createFile('files/Photos/d.jpg', self::ONE_YEAR_AGO - 1);
		$this->createFile('files/Photos/e.jpg', self::ONE_YEAR_AGO + 86400);

		$this->assertSame(
			[1 => 2, 3 => 1],
			$this->mapper->countFilesPerRange(self::STORAGE_ID, ['files/Photos'], $this->mediaMimeIds(), $this->ranges()),
		);
	}

	public function testOnlyCountsMatchingFiles(): void {
		$this->createFile('files/Photos/a.jpg', self::ONE_YEAR_AGO);
		$this->createFile('files/Photos/notes.txt', self::ONE_YEAR_AGO, 'text/plain');
		$this->createFile('files/PhotosXold/b.jpg', self::ONE_YEAR_AGO);
		$this->createFile('files/Other/c.jpg', self::ONE_YEAR_AGO);
		$this->createFile('files_trashbin/files/Photos/d.jpg', self::ONE_YEAR_AGO);
		$this->createFile('files/Photos/e.jpg', self::ONE_YEAR_AGO, storageId: self::OTHER_STORAGE_ID);
		$this->createFile('files/Photos/f.jpg', null);

		$this->assertSame(
			[1 => 1],
			$this->mapper->countFilesPerRange(self::STORAGE_ID, ['files/Photos'], $this->mediaMimeIds(), $this->ranges()),
		);
	}

	public function testCountsFilesInOverlappingFoldersOnce(): void {
		$this->createFile('files/Photos/2025/a.jpg', self::ONE_YEAR_AGO);

		$this->assertSame(
			[1 => 1],
			$this->mapper->countFilesPerRange(self::STORAGE_ID, ['files/Photos', 'files/Photos/2025', 'files'], $this->mediaMimeIds(), $this->ranges()),
		);
	}

	public function testWithoutFoldersMimetypesOrRanges(): void {
		$this->createFile('files/Photos/a.jpg', self::ONE_YEAR_AGO);

		$this->assertSame([], $this->mapper->countFilesPerRange(self::STORAGE_ID, [], $this->mediaMimeIds(), $this->ranges()));
		$this->assertSame([], $this->mapper->countFilesPerRange(self::STORAGE_ID, ['files/Photos'], [], $this->ranges()));
		$this->assertSame([], $this->mapper->countFilesPerRange(self::STORAGE_ID, ['files/Photos'], $this->mediaMimeIds(), []));
	}
}
