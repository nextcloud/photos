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
use OCA\Photos\Sabre\Album\AlbumRootBase;
use OCA\Photos\Sabre\Album\PublicAlbumRoot;
use OCA\Photos\Sabre\Album\SharedAlbumRoot;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\IRootFolder;
use OCP\IUserManager;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Sabre\DAV\Exception\BadRequest;
use Sabre\DAV\Exception\Forbidden;
use Test\TestCase;

class AlbumRootTest extends TestCase {
	private const ALBUM_ID = 7;

	private AlbumMapper&MockObject $albumMapper;

	protected function setUp(): void {
		parent::setUp();

		$this->albumMapper = $this->createMock(AlbumMapper::class);
	}

	/**
	 * @param class-string<AlbumRootBase> $class
	 */
	private function createAlbumRoot(string $class, int $cover = -1, int $lastAdded = 2): AlbumRootBase {
		$info = new AlbumInfo(self::ALBUM_ID, 'owner', 'album', '', 0, $lastAdded, cover: $cover);
		$files = [
			new AlbumFile(1, 'a.jpg', 'image/jpeg', 10, 10, 'etag', 10, 'owner', 'user'),
			new AlbumFile(2, 'b.jpg', 'image/jpeg', 10, 20, 'etag', 20, 'owner', 'user'),
		];

		return new $class(
			$this->albumMapper,
			new AlbumWithFiles($info, $this->albumMapper, $files),
			$this->createMock(IRootFolder::class),
			'owner',
			$this->createMock(UserConfigService::class),
			$this->createMock(LoggerInterface::class),
			$this->createMock(IUserManager::class),
		);
	}

	public function testOwnerSetsCoverToPhotoOfAlbum(): void {
		$this->albumMapper->expects($this->once())
			->method('setCover')
			->with(self::ALBUM_ID, 1);

		$this->createAlbumRoot(AlbumRoot::class)->setCover(1);
	}

	public function testOwnerResetsCover(): void {
		$this->albumMapper->expects($this->once())
			->method('setCover')
			->with(self::ALBUM_ID, -1);

		$this->createAlbumRoot(AlbumRoot::class, 1)->setCover(-1);
	}

	public function testCoverMustBePhotoOfAlbum(): void {
		$this->albumMapper->expects($this->never())->method('setCover');
		$this->expectException(BadRequest::class);

		$this->createAlbumRoot(AlbumRoot::class)->setCover(3);
	}

	public function testOwnerSetsDescription(): void {
		$this->albumMapper->expects($this->once())
			->method('setDescription')
			->with(self::ALBUM_ID, 'Holidays');

		$this->createAlbumRoot(AlbumRoot::class)->setDescription('Holidays');
	}

	public function testDescriptionLengthIsLimited(): void {
		$this->albumMapper->expects($this->never())->method('setDescription');
		$this->expectException(BadRequest::class);

		$this->createAlbumRoot(AlbumRoot::class)->setDescription(str_repeat('é', AlbumMapper::DESCRIPTION_MAX_LENGTH + 1));
	}

	public static function dataNotOwnedAlbums(): array {
		return [
			[SharedAlbumRoot::class],
			[PublicAlbumRoot::class],
		];
	}

	/**
	 * @dataProvider dataNotOwnedAlbums
	 * @param class-string<AlbumRootBase> $class
	 */
	public function testOnlyOwnerSetsCover(string $class): void {
		$this->albumMapper->expects($this->never())->method('setCover');
		$this->expectException(Forbidden::class);

		$this->createAlbumRoot($class)->setCover(1);
	}

	/**
	 * @dataProvider dataNotOwnedAlbums
	 * @param class-string<AlbumRootBase> $class
	 */
	public function testOnlyOwnerSetsDescription(string $class): void {
		$this->albumMapper->expects($this->never())->method('setDescription');
		$this->expectException(Forbidden::class);

		$this->createAlbumRoot($class)->setDescription('Holidays');
	}

	/**
	 * @dataProvider dataNotOwnedAlbums
	 * @param class-string<AlbumRootBase> $class
	 */
	public function testCollaboratorsSeePickedCover(string $class): void {
		$this->assertSame(1, $this->createAlbumRoot($class, 1)->getCover());
	}

	public function testCoverFallsBackToLastAddedPhoto(): void {
		$this->assertSame(2, $this->createAlbumRoot(AlbumRoot::class)->getCover());
		// The picked photo was removed from the album since.
		$this->assertSame(2, $this->createAlbumRoot(AlbumRoot::class, 3)->getCover());
	}
}
