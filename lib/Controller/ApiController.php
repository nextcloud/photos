<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use JsonException;
use OCA\Photos\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http\StreamResponse;
use OCP\Config\IUserConfig;
use OCP\IRequest;
use OCP\IUserSession;

class ApiController extends Controller {
	public function __construct(
		IRequest $request,
		private readonly IUserConfig $userConfig,
		private readonly IUserSession $userSession,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	/**
	 * @NoAdminRequired
	 *
	 * update preferences (user setting)
	 *
	 * @param string key the identifier to change
	 * @param string value the value to set
	 *
	 * @return JSONResponse an empty JSONResponse with respective http status code
	 */
	public function setUserConfig(string $key, string $value): JSONResponse {
		$user = $this->userSession->getUser();
		if (is_null($user)) {
			return new JSONResponse([], Http::STATUS_PRECONDITION_FAILED);
		}

		switch ($key) {
			case 'croppedLayout':
				if ($value !== 'true' && $value !== 'false') {
					return new JSONResponse([], Http::STATUS_BAD_REQUEST);
				}
				break;
			case 'gridDensity':
				if (!in_array($value, ['small', 'medium', 'large'], true)) {
					return new JSONResponse([], Http::STATUS_BAD_REQUEST);
				}
				break;
			case 'photosLocation':
				if (!$this->validatePath($value)) {
					return new JSONResponse([], Http::STATUS_BAD_REQUEST);
				}
				break;
			case 'photosSourceFolders':
				try {
					$paths = json_decode($value, true, 512, JSON_THROW_ON_ERROR);
				} catch (JsonException) {
					return new JSONResponse([], Http::STATUS_BAD_REQUEST);
				}

				if (!array_is_list($paths)) {
					return new JSONResponse([], Http::STATUS_BAD_REQUEST);
				}

				foreach ($paths as $path) {
					if (!$this->validatePath($path)) {
						return new JSONResponse([], Http::STATUS_BAD_REQUEST);
					}
				}
				break;
			case 'smartAlbums':
				if (!$this->validateSmartAlbums($value)) {
					return new JSONResponse([], Http::STATUS_BAD_REQUEST);
				}
				break;
			default:
				return new JSONResponse([], Http::STATUS_BAD_REQUEST);
		}

		$this->userConfig->setValueString($user->getUid(), Application::APP_ID, $key, $value);
		return new JSONResponse([], Http::STATUS_OK);
	}

	private function validatePath(mixed $path): bool {
		if (!is_string($path)) {
			return false;
		}

		if (!str_starts_with($path, '/')) {
			return false;
		}

		if (str_contains($path, '..')) {
			return false;
		}

		return true;
	}

	/**
	 * A list of `{ id, name, filters }` objects with unique ids, where filters
	 * maps a filter id to the list of its selected values.
	 */
	private function validateSmartAlbums(string $value): bool {
		try {
			$smartAlbums = json_decode($value, true, 512, JSON_THROW_ON_ERROR);
		} catch (JsonException) {
			return false;
		}

		if (!is_array($smartAlbums) || !array_is_list($smartAlbums)) {
			return false;
		}

		$ids = [];
		foreach ($smartAlbums as $smartAlbum) {
			if (!is_array($smartAlbum)) {
				return false;
			}

			$keys = array_keys($smartAlbum);
			sort($keys);
			if ($keys !== ['filters', 'id', 'name']) {
				return false;
			}

			['id' => $id, 'name' => $name, 'filters' => $filters] = $smartAlbum;

			if (!is_string($id) || preg_match('/^[A-Za-z0-9_-]{1,64}$/', $id) !== 1 || isset($ids[$id])) {
				return false;
			}
			$ids[$id] = true;

			if (!is_string($name) || trim($name) === '' || mb_strlen($name) > 255) {
				return false;
			}

			if (!is_array($filters)) {
				return false;
			}

			foreach ($filters as $filterId => $filterValues) {
				if (!is_string($filterId) || !is_array($filterValues) || !array_is_list($filterValues)) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function serviceWorker(): StreamResponse {
		$response = new StreamResponse(__DIR__ . '/../../js/photos-service-worker.js');
		$response->setHeaders([
			'Content-Type' => 'application/javascript',
			'Service-Worker-Allowed' => '/'
		]);
		$policy = new ContentSecurityPolicy();
		$policy->addAllowedWorkerSrcDomain("'self'");
		$policy->addAllowedScriptDomain("'self'");
		$policy->addAllowedConnectDomain("'self'");
		$response->setContentSecurityPolicy($policy);
		return $response;
	}
}
