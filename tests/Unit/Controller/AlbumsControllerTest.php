<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Controller;

use OCA\Photos\Controller\AlbumsController;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\Node;
use OCP\Files\Storage\IStorage;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IPreview;
use OCP\IRequest;
use OCP\ITagManager;
use OCP\ITags;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class AlbumsControllerTest extends TestCase {
	private IUserFolder&MockObject $userFolder;
	private AlbumsController $controller;
	private int $lastId = 0;

	protected function setUp(): void {
		parent::setUp();

		$this->userFolder = $this->createMock(IUserFolder::class);
		$this->userFolder->method('getRelativePath')
			->willReturnCallback(static fn (string $path): string => substr($path, strlen('/alice/files')) ?: '/');

		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->willReturn($this->userFolder);

		$tags = $this->createMock(ITags::class);
		$tags->method('getFavorites')->willReturn([]);
		$tagManager = $this->createMock(ITagManager::class);
		$tagManager->method('load')->willReturn($tags);

		$this->controller = new AlbumsController(
			'alice',
			$this->createMock(IRequest::class),
			$rootFolder,
			$this->createMock(IPreview::class),
			$tagManager,
			$this->createMock(IFilesMetadataManager::class),
		);
	}

	/**
	 * @template T of Node
	 * @param class-string<T> $class
	 * @return T&MockObject
	 */
	private function node(string $class, string $path, string $mime): Node&MockObject {
		$id = ++$this->lastId;
		$node = $this->createMock($class);
		$node->method('getId')->willReturn($id);
		$node->method('getPath')->willReturn($path);
		$node->method('getEtag')->willReturn('etag' . $id);
		$node->method('getMimetype')->willReturn($mime);
		$node->method('getMimeType')->willReturn($mime);
		$node->method('getStorage')->willReturn($this->createMock(IStorage::class));

		return $node;
	}

	private function file(string $path, string $mime = 'image/jpeg'): File&MockObject {
		$file = $this->node(File::class, $path, $mime);
		$file->method('getType')->willReturn('file');

		return $file;
	}

	/**
	 * @param list<Node> $content
	 */
	private function folder(string $path, array $content): Folder&MockObject {
		$folder = $this->node(Folder::class, $path, 'httpd/unix-directory');
		$folder->method('getType')->willReturn('dir');
		$folder->method('getDirectoryListing')->willReturn($content);
		$folder->method('nodeExists')->willReturn(false);

		return $folder;
	}

	/**
	 * The listing of a folder holding the given nodes, by path.
	 *
	 * @param list<Node> $content
	 * @return array<string, array>
	 */
	private function listing(array $content): array {
		$folder = $this->folder('/alice/files/Photos', $content);
		$folder->method('getParent')->willReturn($this->userFolder);
		$this->userFolder->method('get')->with('Photos')->willReturn($folder);

		$data = $this->controller->myAlbums('Photos')->getData();

		return array_column($data, null, 'filename');
	}

	public function testFolderIsListedWithItsFirstPhotos(): void {
		$photos = array_map(fn (int $index): File => $this->file("/alice/files/Photos/Trip/$index.jpg"), range(1, 6));
		$notes = $this->file('/alice/files/Photos/Trip/notes.md', 'text/markdown');

		$listing = $this->listing([$this->folder('/alice/files/Photos/Trip', [$notes, ...$photos])]);

		$expected = array_map(static fn (File $photo): array => [
			'id' => (string)$photo->getId(),
			'etag' => $photo->getEtag(),
		], array_slice($photos, 0, 4));
		$this->assertSame($expected, $listing['/Photos/Trip']['attributes']['previews']);
	}

	public function testFolderWithoutPhotosIsShownWithThoseOfASubFolder(): void {
		$photo = $this->file('/alice/files/Photos/Years/2025/1.jpg');
		$year = $this->folder('/alice/files/Photos/Years/2025', [$photo]);

		$listing = $this->listing([$this->folder('/alice/files/Photos/Years', [$year])]);

		$this->assertSame(
			[['id' => (string)$photo->getId(), 'etag' => $photo->getEtag()]],
			$listing['/Photos/Years']['attributes']['previews'],
		);
	}

	public function testFolderWithoutMediaIsNotListed(): void {
		$documents = $this->folder('/alice/files/Photos/Documents', [$this->file('/alice/files/Photos/Documents/a.md', 'text/markdown')]);
		$photo = $this->file('/alice/files/Photos/1.jpg');

		$listing = $this->listing([$documents, $photo]);

		$this->assertSame(['/Photos', '/Photos/1.jpg'], array_keys($listing));
		$this->assertArrayNotHasKey('previews', $listing['/Photos/1.jpg']['attributes']);
		$this->assertArrayNotHasKey('previews', $listing['/Photos']['attributes']);
	}
}
