<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use Exception;
use OCA\Photos\AppInfo\Application;
use OCP\Config\IUserConfig;
use OCP\IUserSession;

class UserConfigService {
	public const array DEFAULT_CONFIGS = [
		'croppedLayout' => 'false',
		'gridDensity' => 'medium',
		'photosLocation' => '/Photos',
		'photosSourceFolders' => '["/Photos"]',
		/** If you add any new configs, make sure to validate the contents in {@see \OCA\Photos\Controller\ApiController::setUserConfig} */
	];

	public function __construct(
		private readonly IUserConfig $userConfig,
		private readonly IUserSession $userSession,
	) {
	}

	public function getUserConfig(string $key): string {
		$user = $this->userSession->getUser();
		return $this->getConfigForUser($user->getUid(), $key);
	}

	public function getConfigForUser(string $userId, string $key): string {
		if (!in_array($key, array_keys(self::DEFAULT_CONFIGS))) {
			throw new Exception('Unknown user config key');
		}

		$default = self::DEFAULT_CONFIGS[$key];
		$value = $this->userConfig->getValueString($userId, Application::APP_ID, $key, $default);

		return $value;
	}
}
