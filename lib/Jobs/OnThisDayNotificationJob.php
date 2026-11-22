<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Jobs;

use DateTimeImmutable;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\OnThisDay\OnThisDayMapper;
use OCA\Photos\Service\UserConfigService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\TimedJob;
use OCP\Config\IUserConfig;
use OCP\Files\Config\IUserMountCache;
use OCP\Files\IMimeTypeLoader;
use OCP\IDateTimeZone;
use OCP\IUser;
use OCP\IUserManager;
use OCP\Notification\IManager as INotificationManager;
use Psr\Log\LoggerInterface;

/**
 * Tell users once a day when they took photos on this day in earlier years.
 */
class OnThisDayNotificationJob extends TimedJob {
	/** How many years back the photos are looked for, as in the "On this day" view. */
	public const int MAX_YEARS = 20;

	/** User config key holding the last day, in the user's time zone, the user was notified on. */
	public const string LAST_NOTIFICATION_KEY = 'onThisDayLastNotification';

	public function __construct(
		ITimeFactory $time,
		private readonly IUserManager $userManager,
		private readonly IUserConfig $userConfig,
		private readonly UserConfigService $userConfigService,
		private readonly IDateTimeZone $dateTimeZone,
		private readonly IUserMountCache $userMountCache,
		private readonly IMimeTypeLoader $mimeTypeLoader,
		private readonly OnThisDayMapper $onThisDayMapper,
		private readonly INotificationManager $notificationManager,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct($time);

		// Kept time sensitive, so the notifications are not pushed during the
		// nightly maintenance window.
		$this->setInterval(24 * 3600);
	}

	#[\Override]
	protected function run($argument): void {
		$this->userManager->callForSeenUsers(function (IUser $user): void {
			try {
				$this->checkUser($user);
			} catch (\Throwable $e) {
				$this->logger->warning('Could not check the photos taken on this day', ['exception' => $e, 'userId' => $user->getUID()]);
			}
		});
	}

	private function checkUser(IUser $user): void {
		$userId = $user->getUID();
		if ($this->userConfigService->getConfigForUser($userId, 'onThisDayNotifications') !== 'true') {
			return;
		}

		$today = (new DateTimeImmutable('@' . $this->time->getTime()))
			->setTimezone($this->dateTimeZone->getTimeZone(false, $userId));
		$todayKey = $today->format('Y-m-d');
		if ($this->userConfig->getValueString($userId, Application::APP_ID, self::LAST_NOTIFICATION_KEY) === $todayKey) {
			return;
		}

		// The mount cache gives the home storage without setting up the
		// user's file system.
		$homeMount = $this->userMountCache->getMountAtPath($user, '/' . $userId . '/');
		if ($homeMount === null) {
			return;
		}

		$counts = $this->onThisDayMapper->countFilesPerRange(
			$homeMount->getStorageId(),
			$this->getSourceFolderPaths($userId),
			array_map($this->mimeTypeLoader->getId(...), [...Application::IMAGE_MIMES, ...Application::VIDEO_MIMES]),
			$this->getDayRanges($today),
		);
		if ($counts === []) {
			return;
		}

		$this->userConfig->setValueString($userId, Application::APP_ID, self::LAST_NOTIFICATION_KEY, $todayKey);

		$notification = $this->notificationManager->createNotification();
		$notification->setApp(Application::APP_ID)
			->setUser($userId)
			->setDateTime(new \DateTime('@' . $today->getTimestamp()))
			->setObject('onthisday', $todayKey)
			->setSubject('onthisday', ['years' => array_keys($counts), 'day' => $todayKey]);
		$this->notificationManager->notify($notification);
	}

	/**
	 * Capture time range of today's calendar day in each of the earlier years,
	 * by how many years ago it was. Years in which the day does not exist, as
	 * February 29th, are left out.
	 *
	 * @return array<int, array{int, int}>
	 */
	private function getDayRanges(DateTimeImmutable $today): array {
		[$year, $month, $day] = array_map('intval', explode('-', $today->format('Y-m-d')));

		$ranges = [];
		for ($yearsAgo = 1; $yearsAgo <= self::MAX_YEARS; $yearsAgo++) {
			if (!checkdate($month, $day, $year - $yearsAgo)) {
				continue;
			}

			$date = $today->setDate($year - $yearsAgo, $month, $day);
			$ranges[$yearsAgo] = [
				$date->setTime(0, 0)->getTimestamp(),
				$date->setTime(23, 59, 59)->getTimestamp(),
			];
		}

		return $ranges;
	}

	/**
	 * Paths of the photo source folders inside the user's home storage.
	 *
	 * @return list<string>
	 */
	private function getSourceFolderPaths(string $userId): array {
		$folders = json_decode($this->userConfigService->getConfigForUser($userId, 'photosSourceFolders'), true);
		if (!is_array($folders)) {
			return [];
		}

		$paths = [];
		foreach ($folders as $folder) {
			if (!is_string($folder) || !str_starts_with($folder, '/') || str_contains($folder, '..')) {
				continue;
			}
			$paths[] = rtrim('files' . $folder, '/');
		}

		return $paths;
	}
}
