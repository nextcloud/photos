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
use OCP\IConfig;
use OCP\IRequest;
use OCP\IUserSession;

class ApiController extends Controller {
	private readonly IConfig $config;
	private readonly IUserSession $userSession;

	public function __construct(
		IRequest $request,
		IConfig $config,
		IUserSession $userSession,
	) {
		parent::__construct(Application::APP_ID, $request);

		$this->config = $config;
		$this->userSession = $userSession;
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
			default:
				return new JSONResponse([], Http::STATUS_BAD_REQUEST);
		}

		$this->config->setUserValue($user->getUid(), Application::APP_ID, $key, $value);
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
