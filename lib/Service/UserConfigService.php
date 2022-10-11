<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
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
	];

	private IConfig $config;
	private IUserSession $userSession;

	public function __construct(
		IConfig $config,
		IUserSession $userSession
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
