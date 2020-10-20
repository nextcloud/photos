<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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

namespace OCA\Photos\Controller;

use OCA\Files\Event\LoadSidebar;
use OCA\Photos\AppInfo\Application;
use OCA\Viewer\Event\LoadViewer;
use OCP\App\IAppManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\IConfig;
use OCP\IInitialStateService;
use OCP\IRequest;
use OCP\IUserSession;
use OCP\Util;

class PageController extends Controller {
	/** @var IAppManager */
	private $appManager;

	/** @var IEventDispatcher */
	private $eventDispatcher;

	/** @var IConfig */
	private $config;

	/** @var IInitialStateService */
	private $initialStateService;

	/** @var IUserSession */
	private $userSession;

	public function __construct(IRequest $request,
								IAppManager $appManager,
								IEventDispatcher $eventDispatcher,
								IConfig $config,
								IInitialStateService $initialStateService,
								IUserSession $userSession) {
		parent::__construct(Application::APP_ID, $request);

		$this->appManager = $appManager;
		$this->eventDispatcher = $eventDispatcher;
		$this->config = $config;
		$this->initialStateService = $initialStateService;
		$this->userSession = $userSession;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * Render default index template
	 *
	 * @return TemplateResponse
	 */
	public function index(): TemplateResponse {
		$user = $this->userSession->getUser();

		$this->eventDispatcher->dispatch(LoadSidebar::class, new LoadSidebar());
		$this->eventDispatcher->dispatch(LoadViewer::class, new LoadViewer());

		$this->initialStateService->provideInitialState($this->appName, 'image-mimes', Application::IMAGE_MIMES);
		$this->initialStateService->provideInitialState($this->appName, 'video-mimes', Application::VIDEO_MIMES);
		$this->initialStateService->provideInitialState($this->appName, 'maps', $this->appManager->isEnabledForUser('maps') === true);
		$this->initialStateService->provideInitialState($this->appName, 'croppedLayout', $this->config->getUserValue($user->getUid(), Application::APP_ID, 'croppedLayout', 'false'));
		$this->initialStateService->provideInitialState($this->appName, 'systemtags', $this->appManager->isEnabledForUser('systemtags') === true);

		Util::addScript(Application::APP_ID, 'photos-main');
		Util::addStyle(Application::APP_ID, 'icons');

		$response = new TemplateResponse(Application::APP_ID, 'main');

		$policy = new ContentSecurityPolicy();
		$policy->addAllowedWorkerSrcDomain("'self'");
		$policy->addAllowedScriptDomain("'self'");
		$response->setContentSecurityPolicy($policy);
		
		return $response;
	}
}
