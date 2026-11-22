<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Sabre\Album;

use OCA\Photos\Album\AlbumFile;
use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Album\AlbumWithFiles;
use OCA\Photos\Sabre\Album\AlbumRoot;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\IRootFolder;
use OCP\IUserManager;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class AlbumRootLastModifiedTest extends TestCase {
	/**
	 * @param AlbumFile[] $files
	 */
	private function createAlbumRoot(int $created, array $files): AlbumRoot {
		$albumMapper = $this->createMock(AlbumMapper::class);

		return new AlbumRoot(
			$albumMapper,
			new AlbumWithFiles(new AlbumInfo(1, 'alice', 'album', '', $created, -1), $albumMapper, $files),
			$this->createMock(IRootFolder::class),
			'alice',
			$this->createMock(UserConfigService::class),
			$this->createMock(LoggerInterface::class),
			$this->createMock(IUserManager::class),
		);
	}

	public function testEmptyAlbumWasLastModifiedWhenCreated(): void {
		$this->assertSame(100, $this->createAlbumRoot(100, [])->getLastModified());
	}

	public function testAlbumWasLastModifiedWhenAPhotoWasLastAdded(): void {
		$album = $this->createAlbumRoot(100, [
			new AlbumFile(1, 'a.jpg', 'image/jpeg', 10, 50, 'etag', 300, 'alice', 'user'),
			new AlbumFile(2, 'b.jpg', 'image/jpeg', 10, 50, 'etag', 200, 'alice', 'user'),
			// Photos matching a filter were never added, their time does not count.
			new AlbumFile(3, 'c.jpg', 'image/jpeg', 10, 900, 'etag', 900, 'alice', 'filters'),
		]);

		$this->assertSame(300, $album->getLastModified());
	}
}
