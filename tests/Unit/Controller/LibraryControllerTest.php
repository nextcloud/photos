<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Controller\LibraryController;
use OCA\Photos\DB\Library\LibraryStatusMapper;
use OCA\Photos\Service\UserConfigService;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\Files\IMimeTypeLoader;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\Mount\IMountPoint;
use OCP\IRequest;
use OCP\IUser;
use OCP\IUserSession;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class LibraryControllerTest extends TestCase {
	private const int NOW = 1_800_000_000;

	private IUserSession&MockObject $userSession;
	private IUserFolder&MockObject $userFolder;
	private LibraryStatusMapper&MockObject $mapper;
	private LibraryController $controller;
	private string $sourceFolders = '["/Photos"]';
	/** @var array<string, array{photos: int, videos: int, size: int, lastUpload: ?int}> */
	private array $folderStatus = [];
	private array $mapperCalls = [];

	protected function setUp(): void {
		parent::setUp();

		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn('alice');
		$this->userSession = $this->createMock(IUserSession::class);
		$this->userSession->method('getUser')->willReturn($user);

		$mountPoint = $this->createMock(IMountPoint::class);
		$mountPoint->method('getNumericStorageId')->willReturn(7);
		$this->userFolder = $this->createMock(IUserFolder::class);
		$this->userFolder->method('getMountPoint')->willReturn($mountPoint);
		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->with('alice')->willReturn($this->userFolder);

		$mimeTypeLoader = $this->createMock(IMimeTypeLoader::class);
		$mimeTypeLoader->method('getId')->willReturnCallback(fn (string $mimetype): int => crc32($mimetype));

		$userConfigService = $this->createMock(UserConfigService::class);
		$userConfigService->method('getConfigForUser')
			->with('alice', 'photosSourceFolders')
			->willReturnCallback(fn (): string => $this->sourceFolders);

		$timeFactory = $this->createMock(ITimeFactory::class);
		$timeFactory->method('getTime')->willReturn(self::NOW);

		$this->mapper = $this->createMock(LibraryStatusMapper::class);
		$this->mapper->method('getStatus')->willReturnCallback(
			function (int $storageId, array $paths, array $photoMimetypeIds, array $videoMimetypeIds): array {
				$this->mapperCalls[] = func_get_args();
				return $this->folderStatus[implode(',', $paths)]
					?? ['photos' => 0, 'videos' => 0, 'size' => 0, 'lastUpload' => null];
			},
		);

		$this->controller = new LibraryController(
			$this->createMock(IRequest::class),
			$this->userSession,
			$rootFolder,
			$mimeTypeLoader,
			$userConfigService,
			$this->mapper,
			$timeFactory,
		);
	}

	private function existingFolders(array $folders): void {
		$this->userFolder->method('nodeExists')->willReturnCallback(fn (string $path): bool => in_array($path, $folders, true));
	}

	public function testStatusOfSourceFolders(): void {
		$this->existingFolders([]);
		$this->folderStatus['files/Photos'] = ['photos' => 12345, 'videos' => 678, 'size' => 54_000_000_000, 'lastUpload' => self::NOW - 7200];

		$response = $this->controller->status();

		$this->assertSame([[
			7,
			['files/Photos'],
			array_map(crc32(...), Application::IMAGE_MIMES),
			array_map(crc32(...), Application::VIDEO_MIMES),
		]], $this->mapperCalls);

		$this->assertSame(200, $response->getStatus());
		$this->assertSame([
			'photos' => 12345,
			'videos' => 678,
			'size' => 54_000_000_000,
			'lastUpload' => self::NOW - 7200,
			'cameraFolders' => [],
		], $response->getData());
	}

	public static function dataSourceFolders(): array {
		return [
			['["/Photos", "/Camera/2024/"]', 'files/Photos,files/Camera/2024'],
			['["/"]', 'files'],
			['["_trashbin", "/../secret", 5, "/Photos"]', 'files/Photos'],
			['not json', ''],
		];
	}

	/**
	 * @dataProvider dataSourceFolders
	 */
	public function testSourceFolders(string $sourceFolders, string $paths): void {
		$this->existingFolders([]);
		$this->sourceFolders = $sourceFolders;
		$this->folderStatus[$paths] = ['photos' => 1, 'videos' => 0, 'size' => 10, 'lastUpload' => 5];

		$this->assertSame(1, $this->controller->status()->getData()['photos']);
	}

	public function testListsRecentlyUsedCameraFolders(): void {
		$this->existingFolders(['/InstantUpload', '/Camera Uploads']);
		$recent = ['photos' => 40, 'videos' => 2, 'size' => 4200, 'lastUpload' => self::NOW - LibraryController::RECENT_UPLOAD_PERIOD];
		$old = ['photos' => 9, 'videos' => 0, 'size' => 900, 'lastUpload' => self::NOW - LibraryController::RECENT_UPLOAD_PERIOD - 1];
		$this->folderStatus['files/InstantUpload'] = $recent;
		$this->folderStatus['files/Camera Uploads'] = $old;
		$this->folderStatus['files/Photos/Camera'] = $recent;

		$this->assertSame(
			[['path' => '/InstantUpload', ...$recent]],
			$this->controller->status()->getData()['cameraFolders'],
		);
	}

	public function testRequiresUser(): void {
		$userSession = $this->createMock(IUserSession::class);
		$userSession->method('getUser')->willReturn(null);
		$controller = new LibraryController(
			$this->createMock(IRequest::class),
			$userSession,
			$this->createMock(IRootFolder::class),
			$this->createMock(IMimeTypeLoader::class),
			$this->createMock(UserConfigService::class),
			$this->mapper,
			$this->createMock(ITimeFactory::class),
		);
		$this->mapper->expects($this->never())->method('getStatus');

		$this->expectException(OCSForbiddenException::class);
		$controller->status();
	}
}
