<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
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

namespace OCA\Photos\Controller;

use OC\Files\Search\SearchBinaryOperator;
use OC\Files\Search\SearchComparison;
use OC\Files\Search\SearchQuery;
use OC\User\NoUserException;
use OCA\Files\Event\LoadSidebar;
use OCA\Photos\AppInfo\Application;
use OCA\Viewer\Event\LoadViewer;
use OCP\App\IAppManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\Files\InvalidPathException;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\Files\Search\ISearchBinaryOperator;
use OCP\Files\Search\ISearchComparison;
use OCP\ICache;
use OCP\ICacheFactory;
use OCP\IConfig;
use OCP\IInitialStateService;
use OCP\IRequest;
use OCP\IUserSession;
use OCP\Util;
use Psr\Log\LoggerInterface;

class PageController extends Controller {
	private IAppManager $appManager;
	private IEventDispatcher $eventDispatcher;
	private IConfig $config;
	private IInitialStateService $initialStateService;
	private IUserSession $userSession;
	private IRootFolder $rootFolder;
	private ICacheFactory $cacheFactory;
	private ICache $nomediaPathsCache;
	private LoggerInterface $logger;

	public function __construct(
		IRequest $request,
		IAppManager $appManager,
		IEventDispatcher $eventDispatcher,
		IConfig $config,
		IInitialStateService $initialStateService,
		IUserSession $userSession,
		IRootFolder $rootFolder,
		ICacheFactory $cacheFactory,
		LoggerInterface $logger
	) {
		parent::__construct(Application::APP_ID, $request);

		$this->appManager = $appManager;
		$this->eventDispatcher = $eventDispatcher;
		$this->config = $config;
		$this->initialStateService = $initialStateService;
		$this->userSession = $userSession;
		$this->rootFolder = $rootFolder;
		$this->cacheFactory = $cacheFactory;
		$this->nomediaPathsCache = $this->cacheFactory->createLocal('photos:nomedia-paths');
		$this->logger = $logger;
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
		$this->initialStateService->provideInitialState($this->appName, 'recognize', $this->appManager->isEnabledForUser('recognize') === true);
		$this->initialStateService->provideInitialState($this->appName, 'croppedLayout', $this->config->getUserValue($user->getUid(), Application::APP_ID, 'croppedLayout', 'false'));
		$this->initialStateService->provideInitialState($this->appName, 'systemtags', $this->appManager->isEnabledForUser('systemtags') === true);

		$paths = [];
		try {
			$userFolder = $this->rootFolder->getUserFolder($user->getUID());
			$key = $user->getUID() . ':' . $userFolder->getEtag();
			$paths = $this->nomediaPathsCache->get($key);
			if ($paths === null) {
				$search = $userFolder->search(new SearchQuery(new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_OR, [
					new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'name', '.nomedia'),
					new SearchComparison(ISearchComparison::COMPARE_EQUAL, 'name', '.noimage')
				]), 0, 0, [], $user));
				$paths = array_map(function (Node $node) use ($userFolder) {
					return substr(dirname($node->getPath()), strlen($userFolder->getPath()));
				}, $search);
				$this->nomediaPathsCache->set($key, $paths, 60 * 60 * 24 * 28);
			}
		} catch (InvalidPathException | NotFoundException | NotPermittedException | NoUserException $e) {
			$this->logger->error($e->getMessage());
		}

		$this->initialStateService->provideInitialState($this->appName, 'nomedia-paths', $paths);

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
