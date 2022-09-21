<?php

/**
 * @copyright Copyright (c) 2022 Louis Chmn <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\Photos\Controller;

use OCP\AppFramework\PublicShareController;
use OCA\Files\Event\LoadSidebar;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\Service\UserConfigService;
use OCA\Viewer\Event\LoadViewer;
use OCP\App\IAppManager;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\AppFramework\Services\IInitialState;
use OCP\IRequest;
use OCP\ISession;
use OCP\Util;


class PublicAlbumController extends PublicShareController {
	private IAppManager $appManager;
	private IEventDispatcher $eventDispatcher;
	private UserConfigService $userConfig;
	private IInitialState $initialState;

	public function __construct(
		IRequest $request,
		ISession $session,
		IAppManager $appManager,
		IEventDispatcher $eventDispatcher,
		UserConfigService $userConfig,
		IInitialState $initialState,
	) {
		parent::__construct(Application::APP_ID, $request, $session);

		$this->appManager = $appManager;
		$this->eventDispatcher = $eventDispatcher;
		$this->userConfig = $userConfig;
		$this->initialState = $initialState;
	}

	/**
	* Validate the token of this share. If the token is invalid this controller
	* will return a 404.
	*/
	public function isValidToken(): bool {
		// TODO: uncomment
		// $album = $this->albumMapper->getAlbumForToken($this->getToken);
		// return $album !== null;
		return true;
	}

	public function getPasswordHash(): string {
		return '';
	}

	/**
	 * Allows you to specify if this share is password protected
	 */
	protected function isPasswordProtected(): bool {
		return false;
	}

	/**
	 * Your normal controller function. The following annotation will allow guests
	 * to open the page as well
	 *
	 * @PublicPage
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @return TemplateResponse
	 */
	public function get(): TemplateResponse {
		$this->eventDispatcher->dispatch(LoadSidebar::class, new LoadSidebar());
		$this->eventDispatcher->dispatch(LoadViewer::class, new LoadViewer());

		$this->initialState->provideInitialState('image-mimes', Application::IMAGE_MIMES);
		$this->initialState->provideInitialState('video-mimes', Application::VIDEO_MIMES);
		$this->initialState->provideInitialState('maps', $this->appManager->isEnabledForUser('maps') === true);
		$this->initialState->provideInitialState('recognize', $this->appManager->isEnabledForUser('recognize') === true);
		$this->initialState->provideInitialState('systemtags', $this->appManager->isEnabledForUser('systemtags') === true);

		// Provide user config
		foreach (array_keys(UserConfigService::DEFAULT_CONFIGS) as $key) {
			$this->initialState->provideInitialState($key, $this->userConfig->getUserConfig($key));
		}

		Util::addScript(Application::APP_ID, 'photos-public');
		Util::addStyle(Application::APP_ID, 'icons');

		$response = new TemplateResponse(Application::APP_ID, 'main');

		$policy = new ContentSecurityPolicy();
		$policy->addAllowedWorkerSrcDomain("'self'");
		$policy->addAllowedScriptDomain("'self'");
		$response->setContentSecurityPolicy($policy);

		return $response;
	}
}