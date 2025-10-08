<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use Exception;
use OCA\Photos\AppInfo\Application;
use OCP\IConfig;
use OCP\IUserSession;

class UserConfigService {
	public const DEFAULT_CONFIGS = [
		'croppedLayout' => 'false',
		'photosLocation' => '/Photos',
		'photosSourceFolders' => '["/Photos"]',
		/** If you add any new configs, make sure to validate the contents in {@see \OCA\Photos\Controller\ApiController::setUserConfig} */
	];

	private readonly IConfig $config;
	private readonly IUserSession $userSession;

	public function __construct(
		IConfig $config,
		IUserSession $userSession,
	) {
		$this->config = $config;
		$this->userSession = $userSession;
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
		$value = $this->config->getUserValue($userId, Application::APP_ID, $key, $default);

		return $value;
	}
}
