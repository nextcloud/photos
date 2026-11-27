<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Controller\TimelineController;
use OCA\Photos\DB\Timeline\TimelineMapper;
use OCA\Photos\Service\UserConfigService;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\Files\IMimeTypeLoader;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\Mount\IMountPoint;
use OCP\IRequest;
use OCP\IUser;
use OCP\IUserSession;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class TimelineControllerTest extends TestCase {
	private IUserSession&MockObject $userSession;
	private UserConfigService&MockObject $userConfigService;
	private TimelineMapper&MockObject $timelineMapper;
	private TimelineController $controller;
	private string $sourceFolders = '["/Photos"]';

	protected function setUp(): void {
		parent::setUp();

		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn('alice');
		$this->userSession = $this->createMock(IUserSession::class);
		$this->userSession->method('getUser')->willReturn($user);

		$mountPoint = $this->createMock(IMountPoint::class);
		$mountPoint->method('getNumericStorageId')->willReturn(7);
		$userFolder = $this->createMock(IUserFolder::class);
		$userFolder->method('getMountPoint')->willReturn($mountPoint);
		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->with('alice')->willReturn($userFolder);

		$mimeTypeLoader = $this->createMock(IMimeTypeLoader::class);
		$mimeTypeLoader->method('getId')->willReturnCallback(fn (string $mimetype): int => crc32($mimetype));

		$this->userConfigService = $this->createMock(UserConfigService::class);
		$this->userConfigService->method('getConfigForUser')
			->with('alice', 'photosSourceFolders')
			->willReturnCallback(fn (): string => $this->sourceFolders);

		$this->timelineMapper = $this->createMock(TimelineMapper::class);

		$this->controller = new TimelineController(
			$this->createMock(IRequest::class),
			$this->userSession,
			$rootFolder,
			$mimeTypeLoader,
			$this->userConfigService,
			$this->timelineMapper,
		);
	}

	private static function mimeIds(array $mimetypes): array {
		return array_map(crc32(...), $mimetypes);
	}

	public function testDaysOfAllMedia(): void {
		$days = [['day' => '2024-03-10', 'count' => 3]];
		$this->timelineMapper->expects($this->once())
			->method('countFilesPerDay')
			->with(7, ['files/Photos'], self::mimeIds([...Application::IMAGE_MIMES, ...Application::VIDEO_MIMES]))
			->willReturn($days);

		$response = $this->controller->days();

		$this->assertSame(200, $response->getStatus());
		$this->assertSame($days, $response->getData());
	}

	public static function dataMediaType(): array {
		return [
			['photos', Application::IMAGE_MIMES],
			['videos', Application::VIDEO_MIMES],
		];
	}

	/**
	 * @dataProvider dataMediaType
	 */
	public function testDaysOfMediaType(string $mediaType, array $mimetypes): void {
		$this->timelineMapper->expects($this->once())
			->method('countFilesPerDay')
			->with(7, ['files/Photos'], self::mimeIds($mimetypes))
			->willReturn([]);

		$this->controller->days($mediaType);
	}

	public function testRejectsUnknownMediaType(): void {
		$this->timelineMapper->expects($this->never())->method('countFilesPerDay');

		$this->expectException(OCSBadRequestException::class);
		$this->controller->days('documents');
	}

	public static function dataSourceFolders(): array {
		return [
			['["/Photos", "/Camera/2024/"]', ['files/Photos', 'files/Camera/2024']],
			['["/"]', ['files']],
			['["_trashbin", "/../secret", 5, "/Photos"]', ['files/Photos']],
			['{"a": "/Photos"}', ['files/Photos']],
			['not json', []],
			['[]', []],
		];
	}

	/**
	 * @dataProvider dataSourceFolders
	 */
	public function testSourceFolders(string $sourceFolders, array $paths): void {
		$this->sourceFolders = $sourceFolders;
		$this->timelineMapper->expects($this->once())
			->method('countFilesPerDay')
			->with(7, $paths, $this->anything())
			->willReturn([]);

		$this->controller->days();
	}
}
