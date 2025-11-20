<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OC\Files\Search\SearchBinaryOperator;
use OC\Files\Search\SearchComparison;
use OC\Files\Search\SearchQuery;
use OC\User\NoUserException;
use OCA\Files\Event\LoadSidebar;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\Service\UserConfigService;
use OCA\Viewer\Event\LoadViewer;
use OCP\App\IAppManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
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
use OCP\IL10N;
use OCP\IRequest;
use OCP\IUserSession;
use OCP\Util;
use Psr\Log\LoggerInterface;

class PageController extends Controller {
	private readonly IAppManager $appManager;
	private readonly IEventDispatcher $eventDispatcher;
	private readonly IInitialState $initialState;
	private readonly IUserSession $userSession;
	private readonly IRootFolder $rootFolder;
	private readonly ICacheFactory $cacheFactory;
	private readonly IL10N $l10n;
	private readonly ICache $nomediaPathsCache;

	public function __construct(
		IRequest $request,
		IAppManager $appManager,
		IEventDispatcher $eventDispatcher,
		private readonly UserConfigService $userConfig,
		IInitialState $initialState,
		IUserSession $userSession,
		IRootFolder $rootFolder,
		ICacheFactory $cacheFactory,
		private readonly LoggerInterface $logger,
		private readonly IConfig $config,
		IL10N $l10n,
	) {
		parent::__construct(Application::APP_ID, $request);

		$this->appManager = $appManager;
		$this->eventDispatcher = $eventDispatcher;
		$this->initialState = $initialState;
		$this->userSession = $userSession;
		$this->rootFolder = $rootFolder;
		$this->cacheFactory = $cacheFactory;
		$this->nomediaPathsCache = $this->cacheFactory->createDistributed('photos:nomedia-paths');
		$this->l10n = $l10n;
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

		$this->initialState->provideInitialState('image-mimes', Application::IMAGE_MIMES);
		$this->initialState->provideInitialState('video-mimes', Application::VIDEO_MIMES);
		$this->initialState->provideInitialState('maps', $this->appManager->isEnabledForUser('maps') === true);
		$this->initialState->provideInitialState('recognize', $this->appManager->isEnabledForUser('recognize') === true);
		$this->initialState->provideInitialState('systemtags', $this->appManager->isEnabledForUser('systemtags') === true);
		$this->initialState->provideInitialState('showPeopleMenuEntry', $this->config->getAppValue('photos', 'showPeopleMenuEntry', 'true') === 'true');
		$this->initialState->provideInitialState('appStoreEnabled', $this->config->getSystemValueBool('appstoreenabled', true));

		// Provide user config
		foreach (array_keys(UserConfigService::DEFAULT_CONFIGS) as $key) {
			$this->initialState->provideInitialState($key, $this->userConfig->getUserConfig($key));
		}

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
				$paths = array_map(fn (Node $node): string => substr(dirname($node->getPath()), strlen((string)$userFolder->getPath())), $search);
				$this->nomediaPathsCache->set($key, $paths, 60 * 60 * 24 * 28); // 28 days
			}
		} catch (InvalidPathException|NotFoundException|NotPermittedException|NoUserException $e) {
			$this->logger->error($e->getMessage());
		}

		$this->initialState->provideInitialState('nomedia-paths', $paths);

		Util::addScript(Application::APP_ID, 'photos-main');
		Util::addStyle(Application::APP_ID, 'photos-main');

		if ($this->appManager->isEnabledForUser('recognize') === true) {
			// Allow auto-translation of tags
			Util::addTranslations('recognize');
		}

		$response = new TemplateResponse(Application::APP_ID, 'main', [
			'pageTitle' => $this->l10n->t('Photos')
		]);

		$policy = new ContentSecurityPolicy();
		$policy->addAllowedWorkerSrcDomain("'self'");
		$policy->addAllowedScriptDomain("'self'");
		$response->setContentSecurityPolicy($policy);

		return $response;
	}
}
