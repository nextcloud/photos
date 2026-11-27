<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\DB;

use OCA\Photos\DB\Timeline\TimelineMapper;
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
class TimelineMapperTest extends TestCase {
	private const int STORAGE_ID = -4242;
	private const int OTHER_STORAGE_ID = -4243;

	private IDBConnection $connection;
	private IMimeTypeLoader $mimeTypeLoader;
	private IFilesMetadataManager $metadataManager;
	private TimelineMapper $mapper;
	/** @var list<int> */
	private array $createdFiles = [];

	protected function setUp(): void {
		parent::setUp();

		$this->connection = Server::get(IDBConnection::class);
		$this->mimeTypeLoader = Server::get(IMimeTypeLoader::class);
		$this->metadataManager = Server::get(IFilesMetadataManager::class);
		$this->mapper = new TimelineMapper($this->connection, $this->metadataManager);
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

	private function createFile(string $path, ?int $takenAt, int $mtime = 0, string $mimeType = 'image/jpeg', int $storageId = self::STORAGE_ID): int {
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
				'mtime' => $query->createNamedParameter($mtime, IQueryBuilder::PARAM_INT),
				'storage_mtime' => $query->createNamedParameter($mtime, IQueryBuilder::PARAM_INT),
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

		return $fileId;
	}

	private function imageAndVideoMimeIds(): array {
		return [
			$this->mimeTypeLoader->getId('image/jpeg'),
			$this->mimeTypeLoader->getId('video/mp4'),
		];
	}

	public function testCountsPerUtcDayNewestFirst(): void {
		// 2024-03-10 00:00:00 UTC
		$day = 1710028800;
		$this->createFile('files/Photos/a.jpg', $day);
		$this->createFile('files/Photos/b.jpg', $day + 86399);
		$this->createFile('files/Photos/sub/c.mp4', $day + 86400, mimeType: 'video/mp4');
		$this->createFile('files/Photos/d.jpg', $day - 1);

		$this->assertSame([
			['day' => '2024-03-11', 'count' => 1],
			['day' => '2024-03-10', 'count' => 2],
			['day' => '2024-03-09', 'count' => 1],
		], $this->mapper->countFilesPerDay(self::STORAGE_ID, ['files/Photos'], $this->imageAndVideoMimeIds()));
	}

	public function testFallsBackToModificationTime(): void {
		$this->createFile('files/Photos/a.jpg', null, 1710028800 + 3600);
		$this->createFile('files/Photos/b.jpg', 1710028800 - 3600, 1710028800 + 3600);

		$this->assertSame([
			['day' => '2024-03-10', 'count' => 1],
			['day' => '2024-03-09', 'count' => 1],
		], $this->mapper->countFilesPerDay(self::STORAGE_ID, ['files/Photos'], $this->imageAndVideoMimeIds()));
	}

	public function testRoundsDownTimestampsBefore1970(): void {
		$this->createFile('files/Photos/a.jpg', -1);
		$this->createFile('files/Photos/b.jpg', -86400);
		$this->createFile('files/Photos/c.jpg', -86401);

		$this->assertSame([
			['day' => '1969-12-31', 'count' => 2],
			['day' => '1969-12-30', 'count' => 1],
		], $this->mapper->countFilesPerDay(self::STORAGE_ID, ['files/Photos'], $this->imageAndVideoMimeIds()));
	}

	public function testOnlyCountsMatchingFiles(): void {
		$takenAt = 1710028800;
		$this->createFile('files/Photos/a.jpg', $takenAt);
		$this->createFile('files/Photos/b.mp4', $takenAt, mimeType: 'video/mp4');
		$this->createFile('files/Photos/notes.txt', $takenAt, mimeType: 'text/plain');
		$this->createFile('files/Photos_old/c.jpg', $takenAt);
		$this->createFile('files/PhotosXold/d.jpg', $takenAt);
		$this->createFile('files/Other/e.jpg', $takenAt);
		$this->createFile('files_trashbin/files/Photos/f.jpg', $takenAt);
		$this->createFile('files/Photos/g.jpg', $takenAt, storageId: self::OTHER_STORAGE_ID);

		$this->assertSame(
			[['day' => '2024-03-10', 'count' => 1]],
			$this->mapper->countFilesPerDay(self::STORAGE_ID, ['files/Photos'], [$this->mimeTypeLoader->getId('image/jpeg')]),
		);
		$this->assertSame(
			[['day' => '2024-03-10', 'count' => 2]],
			$this->mapper->countFilesPerDay(self::STORAGE_ID, ['files/Photos_old', 'files/Photos'], [$this->mimeTypeLoader->getId('image/jpeg')]),
		);
	}

	public function testCountsFilesInOverlappingFoldersOnce(): void {
		$this->createFile('files/Photos/2024/a.jpg', 1710028800);

		$this->assertSame(
			[['day' => '2024-03-10', 'count' => 1]],
			$this->mapper->countFilesPerDay(self::STORAGE_ID, ['files/Photos', 'files/Photos/2024', 'files'], $this->imageAndVideoMimeIds()),
		);
	}

	public function testWithoutFoldersOrMimetypes(): void {
		$this->createFile('files/Photos/a.jpg', 1710028800);

		$this->assertSame([], $this->mapper->countFilesPerDay(self::STORAGE_ID, [], $this->imageAndVideoMimeIds()));
		$this->assertSame([], $this->mapper->countFilesPerDay(self::STORAGE_ID, ['files/Photos'], []));
	}
}
