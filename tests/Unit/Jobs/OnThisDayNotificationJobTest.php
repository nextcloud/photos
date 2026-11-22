<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Jobs;

use OCA\Photos\DB\OnThisDay\OnThisDayMapper;
use OCA\Photos\Jobs\OnThisDayNotificationJob;
use OCA\Photos\Service\UserConfigService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\Config\IUserConfig;
use OCP\Files\Config\ICachedMountInfo;
use OCP\Files\Config\IUserMountCache;
use OCP\Files\IMimeTypeLoader;
use OCP\IDateTimeZone;
use OCP\IUser;
use OCP\IUserManager;
use OCP\Notification\IManager as INotificationManager;
use OCP\Notification\INotification;
use OCP\Server;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class OnThisDayNotificationJobTest extends TestCase {
	private const int STORAGE_ID = 42;

	private ITimeFactory&MockObject $time;
	private IUserManager&MockObject $userManager;
	private IUserConfig&MockObject $userConfig;
	private UserConfigService&MockObject $userConfigService;
	private IDateTimeZone&MockObject $dateTimeZone;
	private IUserMountCache&MockObject $userMountCache;
	private IMimeTypeLoader&MockObject $mimeTypeLoader;
	private OnThisDayMapper&MockObject $mapper;
	private INotificationManager&MockObject $notificationManager;
	private LoggerInterface&MockObject $logger;
	private OnThisDayNotificationJob $job;

	/** @var array<string, string> */
	private array $config = [];
	private string $lastNotification = '';

	protected function setUp(): void {
		parent::setUp();

		$this->time = $this->createMock(ITimeFactory::class);
		$this->userManager = $this->createMock(IUserManager::class);
		$this->userConfig = $this->createMock(IUserConfig::class);
		$this->userConfigService = $this->createMock(UserConfigService::class);
		$this->dateTimeZone = $this->createMock(IDateTimeZone::class);
		$this->userMountCache = $this->createMock(IUserMountCache::class);
		$this->mimeTypeLoader = $this->createMock(IMimeTypeLoader::class);
		$this->mapper = $this->createMock(OnThisDayMapper::class);
		$this->notificationManager = $this->createMock(INotificationManager::class);
		$this->logger = $this->createMock(LoggerInterface::class);

		$this->config = [
			'onThisDayNotifications' => 'true',
			'photosSourceFolders' => '["/Photos","/../escape","/Camera/"]',
		];
		$this->lastNotification = '';

		// 2026-11-22 23:30 in UTC, already the 23rd in Berlin.
		$this->time->method('getTime')->willReturn(1795390200);
		$this->dateTimeZone->method('getTimeZone')->willReturn(new \DateTimeZone('Europe/Berlin'));
		$this->userConfigService->method('getConfigForUser')
			->willReturnCallback(fn (string $userId, string $key): string => $this->config[$key]);
		$this->userConfig->method('getValueString')
			->willReturnCallback(fn (): string => $this->lastNotification);
		$this->mimeTypeLoader->method('getId')->willReturnCallback(fn (string $mime): int => crc32($mime));

		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn('alice');

		$homeMount = $this->createMock(ICachedMountInfo::class);
		$homeMount->method('getStorageId')->willReturn(self::STORAGE_ID);
		$this->userMountCache->method('getMountAtPath')->with($user, '/alice/')->willReturn($homeMount);
		$this->userManager->method('callForSeenUsers')
			->willReturnCallback(fn (\Closure $callback) => $callback($user));

		$this->notificationManager->method('createNotification')
			->willReturnCallback(fn (): INotification => Server::get(INotificationManager::class)->createNotification());

		$this->job = new OnThisDayNotificationJob(
			$this->time,
			$this->userManager,
			$this->userConfig,
			$this->userConfigService,
			$this->dateTimeZone,
			$this->userMountCache,
			$this->mimeTypeLoader,
			$this->mapper,
			$this->notificationManager,
			$this->logger,
		);
	}

	private function runJob(): void {
		self::invokePrivate($this->job, 'run', [null]);
	}

	public function testNotifiesAboutTheYearsWithPhotosOfThisDay(): void {
		$this->mapper->expects($this->once())
			->method('countFilesPerRange')
			->willReturnCallback(function (int $storageId, array $folderPaths, array $mimetypeIds, array $ranges): array {
				$this->assertSame(self::STORAGE_ID, $storageId);
				$this->assertSame(['files/Photos', 'files/Camera'], $folderPaths);
				$this->assertContains(crc32('image/jpeg'), $mimetypeIds);
				$this->assertContains(crc32('video/mp4'), $mimetypeIds);
				$this->assertCount(OnThisDayNotificationJob::MAX_YEARS, $ranges);
				// November 23rd 2025 in Berlin, from midnight to the last second.
				$this->assertSame([1763852400, 1763938799], $ranges[1]);
				return [1 => 4, 3 => 1];
			});

		$this->userConfig->expects($this->once())
			->method('setValueString')
			->with('alice', 'photos', OnThisDayNotificationJob::LAST_NOTIFICATION_KEY, '2026-11-23');

		$this->notificationManager->expects($this->once())
			->method('notify')
			->willReturnCallback(function (INotification $notification): void {
				$this->assertSame('photos', $notification->getApp());
				$this->assertSame('alice', $notification->getUser());
				$this->assertSame('onthisday', $notification->getObjectType());
				$this->assertSame('2026-11-23', $notification->getObjectId());
				$this->assertSame('onthisday', $notification->getSubject());
				$this->assertSame(['years' => [1, 3], 'day' => '2026-11-23'], $notification->getSubjectParameters());
			});

		$this->runJob();
	}

	public function testDoesNotNotifyWithoutPhotosOfThisDay(): void {
		$this->mapper->method('countFilesPerRange')->willReturn([]);
		$this->userConfig->expects($this->never())->method('setValueString');
		$this->notificationManager->expects($this->never())->method('notify');

		$this->runJob();
	}

	public function testNotifiesAtMostOncePerDay(): void {
		$this->lastNotification = '2026-11-23';
		$this->mapper->expects($this->never())->method('countFilesPerRange');
		$this->notificationManager->expects($this->never())->method('notify');

		$this->runJob();
	}

	public function testSkipsUsersWhoDisabledTheNotification(): void {
		$this->config['onThisDayNotifications'] = 'false';
		$this->mapper->expects($this->never())->method('countFilesPerRange');
		$this->notificationManager->expects($this->never())->method('notify');

		$this->runJob();
	}

	public function testLeavesOutYearsWithoutTheDay(): void {
		$this->time = $this->createMock(ITimeFactory::class);
		// 2024-02-29 12:00 UTC
		$this->time->method('getTime')->willReturn(1709208000);
		$this->job = new OnThisDayNotificationJob(
			$this->time,
			$this->userManager,
			$this->userConfig,
			$this->userConfigService,
			$this->dateTimeZone,
			$this->userMountCache,
			$this->mimeTypeLoader,
			$this->mapper,
			$this->notificationManager,
			$this->logger,
		);

		$this->mapper->expects($this->once())
			->method('countFilesPerRange')
			->willReturnCallback(function (int $storageId, array $folderPaths, array $mimetypeIds, array $ranges): array {
				$this->assertSame([4, 8, 12, 16, 20], array_keys($ranges));
				return [];
			});

		$this->runJob();
	}

	public function testKeepsGoingWhenAUserFails(): void {
		$this->mapper->method('countFilesPerRange')->willThrowException(new \RuntimeException('database gone'));
		$this->logger->expects($this->once())->method('warning');
		$this->notificationManager->expects($this->never())->method('notify');

		$this->runJob();
	}
}
