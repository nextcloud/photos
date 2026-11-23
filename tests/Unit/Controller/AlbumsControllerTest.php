<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Controller;

use OCA\Photos\Controller\AlbumsController;
use OCP\Files\File;
use OCP\Files\FileInfo;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\NotFoundException;
use OCP\Files\Storage\IStorage;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IPreview;
use OCP\IRequest;
use OCP\ITagManager;
use OCP\ITags;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class AlbumsControllerTest extends TestCase {
	private IRootFolder&MockObject $rootFolder;
	private IUserFolder&MockObject $userFolder;
	private AlbumsController $controller;

	protected function setUp(): void {
		parent::setUp();

		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->userFolder = $this->createMock(IUserFolder::class);
		$this->describeNode($this->userFolder, 1, '/alice/files', FileInfo::TYPE_FOLDER, FileInfo::MIMETYPE_FOLDER);
		$this->rootFolder->method('getUserFolder')->with('alice')->willReturn($this->userFolder);
		$this->userFolder->method('getParent')->willThrowException(new NotFoundException());
		$this->userFolder->method('getRelativePath')->willReturnCallback(
			static fn (string $path): string => substr($path, strlen('/alice/files')) ?: '/',
		);

		$tags = $this->createMock(ITags::class);
		$tags->method('getFavorites')->willReturn([]);
		$tagManager = $this->createMock(ITagManager::class);
		$tagManager->method('load')->willReturn($tags);

		$metadataManager = $this->createMock(IFilesMetadataManager::class);
		$metadataManager->method('getMetadataForFiles')->willReturn([]);

		$this->controller = new AlbumsController(
			'alice',
			$this->createMock(IRequest::class),
			$this->rootFolder,
			$this->createMock(IPreview::class),
			$tagManager,
			$metadataManager,
		);
	}

	public function testEncryptedFolderIsListedAsEncryptedWithoutBeingLookedInto(): void {
		$vault = $this->folder(10, '/alice/files/Vault', true, []);
		$vault->expects($this->never())->method('getDirectoryListing');
		$vault->expects($this->never())->method('nodeExists');
		$trip = $this->folder(20, '/alice/files/Trip', false, [$this->photo(21, '/alice/files/Trip/beach.jpg')]);
		$this->setListing($this->userFolder, [$vault, $trip]);

		$listing = $this->listing('');

		$this->assertSame(['/', '/Vault', '/Trip'], array_column($listing, 'filename'));
		$this->assertSame(0, $listing[0]['attributes']['is-encrypted']);
		$this->assertSame(1, $listing[1]['attributes']['is-encrypted']);
		$this->assertSame(0, $listing[2]['attributes']['is-encrypted']);
	}

	public function testOpeningAnEncryptedFolderListsOnlyTheFolder(): void {
		$vault = $this->folder(10, '/alice/files/Vault', true, []);
		$vault->expects($this->never())->method('getDirectoryListing');
		$this->userFolder->method('get')->with('Vault')->willReturn($vault);

		$listing = $this->listing('Vault');

		$this->assertCount(1, $listing);
		$this->assertSame('/Vault', $listing[0]['filename']);
		$this->assertSame(1, $listing[0]['attributes']['is-encrypted']);
	}

	public function testFolderHoldingOnlyAnEncryptedFolderIsNotListed(): void {
		$vault = $this->folder(11, '/alice/files/Private/Vault', true, []);
		$vault->expects($this->never())->method('getDirectoryListing');
		$private = $this->folder(10, '/alice/files/Private', false, [$vault]);
		$this->setListing($this->userFolder, [$private]);

		$this->assertSame(['/'], array_column($this->listing(''), 'filename'));
	}

	public function testFilesCarryNoEncryptionAttribute(): void {
		$this->setListing($this->userFolder, [$this->photo(30, '/alice/files/cat.jpg')]);

		$listing = $this->listing('');

		$this->assertSame('/cat.jpg', $listing[1]['filename']);
		$this->assertArrayNotHasKey('is-encrypted', $listing[1]['attributes']);
	}

	/**
	 * @return list<array<string, mixed>>
	 */
	private function listing(string $path): array {
		$response = $this->controller->myAlbums($path);
		$this->assertSame(200, $response->getStatus());

		return $response->getData();
	}

	/**
	 * @param list<FileInfo> $listing
	 */
	private function folder(int $id, string $path, bool $encrypted, array $listing): Folder&MockObject {
		$folder = $this->createMock(Folder::class);
		$this->describeNode($folder, $id, $path, FileInfo::TYPE_FOLDER, FileInfo::MIMETYPE_FOLDER);
		$folder->method('isEncrypted')->willReturn($encrypted);
		$folder->method('nodeExists')->willReturn(false);
		$folder->method('getParent')->willReturnCallback(fn () => $this->userFolder);
		if ($listing !== []) {
			$this->setListing($folder, $listing);
		}

		return $folder;
	}

	private function photo(int $id, string $path): File&MockObject {
		$file = $this->createMock(File::class);
		$this->describeNode($file, $id, $path, FileInfo::TYPE_FILE, 'image/jpeg');

		return $file;
	}

	/**
	 * @param list<FileInfo> $listing
	 */
	private function setListing(MockObject $folder, array $listing): void {
		$folder->method('getDirectoryListing')->willReturn($listing);
	}

	private function describeNode(MockObject $node, int $id, string $path, string $type, string $mime): void {
		$storage = $this->createMock(IStorage::class);
		$storage->method('instanceOfStorage')->willReturn(false);

		$node->method('getId')->willReturn($id);
		$node->method('getPath')->willReturn($path);
		$node->method('getType')->willReturn($type);
		$node->method('getMimetype')->willReturn($mime);
		$node->method('getStorage')->willReturn($storage);
		$node->method('getEtag')->willReturn('etag-' . $id);
	}
}
