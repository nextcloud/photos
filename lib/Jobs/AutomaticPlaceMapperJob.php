<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Jobs;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Service\MediaPlaceManager;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJob;
use OCP\BackgroundJob\TimedJob;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Mount\IMovableMount;
use OCP\IConfig;
use OCP\IUserManager;

class AutomaticPlaceMapperJob extends TimedJob {
	public function __construct(
		ITimeFactory $time,
		private readonly IConfig $config,
		private readonly IRootFolder $rootFolder,
		private readonly IUserManager $userManager,
		private MediaPlaceManager $mediaPlaceManager,
	) {
		parent::__construct($time);
		$this->mediaPlaceManager = $mediaPlaceManager;

		$this->setTimeSensitivity(IJob::TIME_INSENSITIVE);
		$this->setInterval(24 * 3600);
	}

	protected function run($argument) {
		$placeMappingDone = $this->config->getAppValue(Application::APP_ID, 'lastPlaceMappingDone', 'false');

		if ($placeMappingDone === 'true') {
			return;
		}

		$users = $this->userManager->search('');
		if ($users === []) {
			return;
		}

		$lastMappedUser = $this->config->getAppValue(Application::APP_ID, 'lastPlaceMappedUser', '');

		if ($lastMappedUser === '') {
			$lastMappedUser = $users[array_key_first($users)]->getUID();
		}

		$startTime = null;
		foreach ($users as $user) {
			if ($startTime === null) {
				// Skip all user before lastMappedUser.
				if ($lastMappedUser !== $user->getUID()) {
					continue;
				}

				$startTime = time();
			}

			// Stop if execution time is more than one hour.
			if (time() - $startTime > 60 * 60) {
				return;
			}

			$this->scanFilesForUser($user->getUID());
			$this->config->setAppValue(Application::APP_ID, 'lastPlaceMappedUser', $user->getUID());
		}

		$this->config->setAppValue(Application::APP_ID, 'lastPlaceMappingDone', 'true');
	}

	private function scanFilesForUser(string $userId): void {
		$userFolder = $this->rootFolder->getUserFolder($userId);
		$this->scanFolder($userFolder);
	}


	private function scanFolder(Folder $folder): void {
		// Do not scan share and other moveable mounts.
		if ($folder->getMountPoint() instanceof IMovableMount) {
			return;
		}

		foreach ($folder->getDirectoryListing() as $node) {
			if ($node instanceof Folder) {
				$this->scanFolder($node);
				continue;
			}

			if (!str_starts_with($node->getMimeType(), 'image')) {
				continue;
			}

			$this->mediaPlaceManager->setPlaceForFile($node->getId());
		}
	}
}
