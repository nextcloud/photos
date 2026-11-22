<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\DB;

use OCA\Photos\DB\Library\LibraryStatusMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IMimeTypeLoader;
use OCP\IDBConnection;
use OCP\Server;
use Test\TestCase;

/**
 * @group DB
 */
class LibraryStatusMapperTest extends TestCase {
	private const int STORAGE_ID = -4252;
	private const int OTHER_STORAGE_ID = -4253;

	private IDBConnection $connection;
	private IMimeTypeLoader $mimeTypeLoader;
	private LibraryStatusMapper $mapper;
	/** @var list<int> */
	private array $createdFiles = [];

	protected function setUp(): void {
		parent::setUp();

		$this->connection = Server::get(IDBConnection::class);
		$this->mimeTypeLoader = Server::get(IMimeTypeLoader::class);
		$this->mapper = new LibraryStatusMapper($this->connection);
	}

	protected function tearDown(): void {
		foreach (['filecache', 'filecache_extended'] as $table) {
			$query = $this->connection->getQueryBuilder();
			$query->delete($table)
				->where($query->expr()->in('fileid', $query->createNamedParameter($this->createdFiles, IQueryBuilder::PARAM_INT_ARRAY)));
			$query->executeStatement();
		}
		$this->createdFiles = [];

		parent::tearDown();
	}

	private function createFile(string $path, int $size, int $mtime, ?int $uploadTime = null, string $mimeType = 'image/jpeg', int $storageId = self::STORAGE_ID): void {
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
				'size' => $query->createNamedParameter($size, IQueryBuilder::PARAM_INT),
				'mtime' => $query->createNamedParameter($mtime, IQueryBuilder::PARAM_INT),
				'storage_mtime' => $query->createNamedParameter($mtime, IQueryBuilder::PARAM_INT),
				'permissions' => $query->createNamedParameter(31, IQueryBuilder::PARAM_INT),
				'etag' => $query->createNamedParameter('dummy'),
			]);
		$query->executeStatement();
		$fileId = $query->getLastInsertId();
		$this->createdFiles[] = $fileId;

		if ($uploadTime !== null) {
			$query = $this->connection->getQueryBuilder();
			$query->insert('filecache_extended')
				->values([
					'fileid' => $query->createNamedParameter($fileId, IQueryBuilder::PARAM_INT),
					'upload_time' => $query->createNamedParameter($uploadTime, IQueryBuilder::PARAM_INT),
				]);
			$query->executeStatement();
		}
	}

	private function statusOf(array $folderPaths, int $storageId = self::STORAGE_ID): array {
		return $this->mapper->getStatus(
			$storageId,
			$folderPaths,
			[$this->mimeTypeLoader->getId('image/jpeg'), $this->mimeTypeLoader->getId('image/png')],
			[$this->mimeTypeLoader->getId('video/mp4')],
		);
	}

	public function testCountsPhotosAndVideos(): void {
		$this->createFile('files/Photos/a.jpg', 100, 1000);
		$this->createFile('files/Photos/b.png', 200, 3000);
		$this->createFile('files/Photos/sub/c.mp4', 5000, 2000, mimeType: 'video/mp4');

		$this->assertSame(
			['photos' => 2, 'videos' => 1, 'size' => 5300, 'lastUpload' => 3000],
			$this->statusOf(['files/Photos']),
		);
	}

	public function testUsesTheLaterOfUploadAndModificationTime(): void {
		// Mobile apps keep the capture time as modification time of uploaded files.
		$this->createFile('files/Photos/old-photo.jpg', 10, 1000, 9000);
		$this->createFile('files/Photos/edited.jpg', 10, 8000, 2000);
		$this->createFile('files/Photos/scanned.jpg', 10, 4000, 0);

		$this->assertSame(9000, $this->statusOf(['files/Photos'])['lastUpload']);
	}

	public function testOnlyCountsMatchingFiles(): void {
		$this->createFile('files/Photos/a.jpg', 10, 1000);
		$this->createFile('files/Photos/notes.txt', 10, 9000, mimeType: 'text/plain');
		$this->createFile('files/Photos/movie.mkv', 10, 9000, mimeType: 'video/x-matroska');
		$this->createFile('files/Photos_old/b.jpg', 10, 9000);
		$this->createFile('files/Other/c.jpg', 10, 9000);
		$this->createFile('files_trashbin/files/Photos/d.jpg', 10, 9000);
		$this->createFile('files_versions/Photos/a.jpg.v1000', 10, 9000);
		$this->createFile('files/Photos/e.jpg', 10, 9000, storageId: self::OTHER_STORAGE_ID);

		$this->assertSame(
			['photos' => 1, 'videos' => 0, 'size' => 10, 'lastUpload' => 1000],
			$this->statusOf(['files/Photos']),
		);
	}

	public function testCountsFilesInOverlappingFoldersOnce(): void {
		$this->createFile('files/Photos/Camera/a.jpg', 10, 1000);
		$this->createFile('files/InstantUpload/b.mp4', 20, 2000, mimeType: 'video/mp4');

		$this->assertSame(
			['photos' => 1, 'videos' => 1, 'size' => 30, 'lastUpload' => 2000],
			$this->statusOf(['files/Photos', 'files/Photos/Camera', 'files']),
		);
	}

	public function testEmptyLibrary(): void {
		$empty = ['photos' => 0, 'videos' => 0, 'size' => 0, 'lastUpload' => null];
		$this->createFile('files/Photos/a.jpg', 10, 1000);

		$this->assertSame($empty, $this->statusOf(['files/Empty']));
		$this->assertSame($empty, $this->statusOf([]));
		$this->assertSame($empty, $this->mapper->getStatus(self::STORAGE_ID, ['files/Photos'], [], []));
	}
}
