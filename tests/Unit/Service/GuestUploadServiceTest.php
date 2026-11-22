<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Service;

use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Exception\GuestUploadException;
use OCA\Photos\Service\GuestUploadService;
use OCA\Photos\Service\UserConfigService;
use OCP\AppFramework\Http;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IFilenameValidator;
use OCP\Files\IHomeStorage;
use OCP\Files\IMimeTypeDetector;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\Files\Storage\IStorage;
use OCP\IAppConfig;
use OCP\IL10N;
use OCP\IUser;
use OCP\IUserManager;
use OCP\L10N\IFactory;
use OCP\Lock\ILockingProvider;
use OCP\Server;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

/**
 * @group DB
 */
class GuestUploadServiceTest extends TestCase {
	private const JPEG = "\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xFF\xDB";

	private AlbumMapper&MockObject $albumMapper;
	private IUserManager&MockObject $userManager;
	private IAppConfig&MockObject $appConfig;
	private Folder&MockObject $photosFolder;
	private Folder&MockObject $uploadFolder;
	private IStorage&MockObject $storage;
	private IUser&MockObject $owner;
	private GuestUploadService $service;
	private AlbumInfo $album;
	private array $tmpFiles = [];
	private int $maxSize = GuestUploadService::DEFAULT_MAX_SIZE;
	private bool $ownerEnabled = true;
	private bool $uploadFolderExists = true;

	protected function setUp(): void {
		parent::setUp();

		$this->albumMapper = $this->createMock(AlbumMapper::class);
		$this->userManager = $this->createMock(IUserManager::class);
		$this->appConfig = $this->createMock(IAppConfig::class);
		$this->appConfig->method('getValueInt')
			->with('photos', GuestUploadService::CONFIG_MAX_SIZE, GuestUploadService::DEFAULT_MAX_SIZE)
			->willReturnCallback(fn (): int => $this->maxSize);

		$this->owner = $this->createMock(IUser::class);
		$this->owner->method('isEnabled')->willReturnCallback(fn (): bool => $this->ownerEnabled);
		$this->userManager->method('get')->with('owner')->willReturn($this->owner);

		$this->storage = $this->createMock(IStorage::class);
		$this->storage->method('instanceOfStorage')->with(IHomeStorage::class)->willReturn(true);
		$this->uploadFolder = $this->createMock(Folder::class);
		$this->uploadFolder->method('getStorage')->willReturn($this->storage);
		$this->uploadFolder->method('getNonExistingName')->willReturnArgument(0);
		$this->photosFolder = $this->createMock(Folder::class);
		$this->photosFolder->method('getStorage')->willReturn($this->storage);
		$this->photosFolder->method('get')->with('Wedding – guest uploads')->willReturnCallback(fn (): Folder => $this->uploadFolderExists ? $this->uploadFolder : throw new NotFoundException());
		$userFolder = $this->createMock(IUserFolder::class);
		$userFolder->method('get')->with('/Photos')->willReturn($this->photosFolder);
		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->with('owner')->willReturn($userFolder);

		$userConfigService = $this->createMock(UserConfigService::class);
		$userConfigService->method('getConfigForUser')->with('owner', 'photosLocation')->willReturn('/Photos');

		$l = $this->createMock(IL10N::class);
		$l->method('t')->willReturnCallback(fn (string $text, array $parameters = []): string => vsprintf($text, $parameters));
		$l10nFactory = $this->createMock(IFactory::class);
		$l10nFactory->method('get')->willReturn($l);

		$this->service = new GuestUploadService(
			$this->albumMapper,
			$rootFolder,
			$this->userManager,
			$userConfigService,
			Server::get(IMimeTypeDetector::class),
			Server::get(IFilenameValidator::class),
			$this->createMock(ILockingProvider::class),
			$this->appConfig,
			$l10nFactory,
			$l,
			$this->createMock(LoggerInterface::class),
		);

		$this->album = new AlbumInfo(7, 'owner', 'Wedding', '', 0, -1);
	}

	protected function tearDown(): void {
		foreach ($this->tmpFiles as $tmpFile) {
			@unlink($tmpFile);
		}
		parent::tearDown();
	}

	private function upload(string $name, string $content, int $error = UPLOAD_ERR_OK): array {
		$tmpFile = tempnam(sys_get_temp_dir(), 'guest');
		file_put_contents($tmpFile, $content);
		$this->tmpFiles[] = $tmpFile;
		return ['name' => $name, 'tmp_name' => $tmpFile, 'error' => $error];
	}

	private function assertRejected(int $status, array $upload, string $guestName = ''): void {
		$this->uploadFolder->expects($this->never())->method('newFile');
		$this->albumMapper->expects($this->never())->method('addFile');
		try {
			$this->service->upload($this->album, $upload, $guestName);
			$this->fail('The upload was accepted');
		} catch (GuestUploadException $e) {
			$this->assertSame($status, $e->status);
		}
	}

	private function expectStoredAs(string $name): File&MockObject {
		$file = $this->createMock(File::class);
		$file->method('getId')->willReturn(42);
		$this->uploadFolder->method('getFreeSpace')->willReturn(10 * 1024 * 1024);
		$this->uploadFolder->expects($this->once())->method('newFile')->with($name)->willReturn($file);
		return $file;
	}

	public function testStoresThePhotoUnderTheGuestNameAndAddsItToTheAlbum(): void {
		$file = $this->expectStoredAs('Anna – IMG_0001.jpg');
		$file->expects($this->once())->method('putContent');
		$this->albumMapper->expects($this->once())->method('addFile')->with(7, 42, 'owner');

		$this->assertSame(42, $this->service->upload($this->album, $this->upload('IMG_0001.jpg', self::JPEG), 'Anna'));
	}

	public function testKeepsOnlyTheBaseNameOfTheClientPath(): void {
		$this->expectStoredAs('evil.jpg');

		$this->service->upload($this->album, $this->upload('../../..\\files/evil.jpg', self::JPEG), '');
	}

	public function testGuestNameCannotAddPathSegments(): void {
		$this->expectStoredAs('_.._x – a.jpg');

		$this->service->upload($this->album, $this->upload('a.jpg', self::JPEG), "../../x\n");
	}

	public function testCreatesTheGuestUploadFolder(): void {
		$this->uploadFolderExists = false;
		$this->photosFolder->expects($this->once())->method('newFolder')->with('Wedding – guest uploads')->willReturn($this->uploadFolder);
		$this->expectStoredAs('a.jpg');

		$this->service->upload($this->album, $this->upload('a.jpg', self::JPEG), '');
	}

	public function testRejectsFilesAboveTheSizeLimit(): void {
		$this->maxSize = 10;

		$this->assertRejected(Http::STATUS_REQUEST_ENTITY_TOO_LARGE, $this->upload('a.jpg', self::JPEG));
	}

	public function testRejectsFilesPhpRefusedAsTooLarge(): void {
		$this->assertRejected(Http::STATUS_REQUEST_ENTITY_TOO_LARGE, $this->upload('a.jpg', '', UPLOAD_ERR_INI_SIZE));
	}

	public function testRejectsEmptyFiles(): void {
		$this->assertRejected(Http::STATUS_BAD_REQUEST, $this->upload('a.jpg', ''));
	}

	public function testRejectsContentThatIsNoPhotoDespiteItsExtension(): void {
		$this->assertRejected(Http::STATUS_UNSUPPORTED_MEDIA_TYPE, $this->upload('a.jpg', '<html><script>alert(1)</script></html>'));
	}

	public function testRejectsPhotosWithAnExtensionThatIsNoPhoto(): void {
		$this->assertRejected(Http::STATUS_UNSUPPORTED_MEDIA_TYPE, $this->upload('a.html', self::JPEG));
	}

	public function testRejectsMediaTypesOutsideTheAllowedList(): void {
		$this->assertRejected(Http::STATUS_UNSUPPORTED_MEDIA_TYPE, $this->upload('a.gif', "GIF89a\x01\x00\x01\x00\x00\x00\x00;"));
	}

	public function testRejectsWhenTheOwnerIsDisabled(): void {
		$this->ownerEnabled = false;

		$this->assertRejected(Http::STATUS_FORBIDDEN, $this->upload('a.jpg', self::JPEG));
	}

	public function testRejectsWhenTheOwnerQuotaIsTooSmall(): void {
		$this->uploadFolder->method('getFreeSpace')->willReturn(5);

		$this->assertRejected(Http::STATUS_INSUFFICIENT_STORAGE, $this->upload('a.jpg', self::JPEG));
	}

	public function testRefusesToWriteIntoAReceivedShare(): void {
		$this->uploadFolder->method('isShared')->willReturn(true);
		$this->uploadFolder->method('getFreeSpace')->willReturn(10 * 1024 * 1024);

		$this->assertRejected(Http::STATUS_FORBIDDEN, $this->upload('a.jpg', self::JPEG));
	}

	public function testRemovesTheReservedFileWhenWritingFails(): void {
		$file = $this->expectStoredAs('a.jpg');
		$file->method('putContent')->willThrowException(new NotPermittedException());
		$file->expects($this->once())->method('delete');
		$this->albumMapper->expects($this->never())->method('addFile');

		$this->expectException(GuestUploadException::class);
		$this->service->upload($this->album, $this->upload('a.jpg', self::JPEG), '');
	}
}
