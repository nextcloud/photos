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
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\IInitialStateService;
use OCP\IRequest;
use OCP\Util;
use OCP\IConfig;
use OCP\App\IAppManager;

class PageController extends Controller {

	protected $appName;

	/** @var IEventDispatcher */
	private $eventDispatcher;

	/** @var IInitialStateService */
	private $initialStateService;

	/** @var IAppManager */
	private $appManager;

	public function __construct($appName,
								IAppManager $appManager,
								IRequest $request,
								IEventDispatcher $eventDispatcher,
								IConfig $config,
								IInitialStateService $initialStateService) {
		parent::__construct($appName, $request);

		$this->appName = $appName;
		$this->appManager = $appManager;
		$this->eventDispatcher = $eventDispatcher;
		$this->initialStateService = $initialStateService;
		$this->config = $config;

	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * Render default index template
	 *
	 * @return TemplateResponse
	 */
	public function index(): TemplateResponse {
		$this->eventDispatcher->dispatch(LoadSidebar::class, new LoadSidebar());
		$this->eventDispatcher->dispatch(LoadViewer::class, new LoadViewer());

		$this->initialStateService->provideInitialState($this->appName, 'mimes', Application::MIMES);
		$this->initialStateService->provideInitialState($this->appName, 'maps', $this->appManager->isEnabledForUser('maps') === true);

		Util::addScript($this->appName, 'photos');
		Util::addStyle($this->appName, 'icons');

		$response = new TemplateResponse($this->appName, 'main');
		return $response;
	}
}
