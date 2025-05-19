<?php

/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Viewer\Event\LoadViewer;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\Template\PublicTemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\IRequest;
use OCP\Util;

class PublicAlbumController extends Controller {
	private readonly IEventDispatcher $eventDispatcher;
	private readonly IInitialState $initialState;

	public function __construct(
		IRequest $request,
		IEventDispatcher $eventDispatcher,
		IInitialState $initialState,
	) {
		parent::__construct(Application::APP_ID, $request);

		$this->eventDispatcher = $eventDispatcher;
		$this->initialState = $initialState;
	}

	/**
	 * @PublicPage
	 * @NoCSRFRequired
	 */
	public function get(): PublicTemplateResponse {
		$this->eventDispatcher->dispatch(LoadViewer::class, new LoadViewer());

		$this->initialState->provideInitialState('image-mimes', Application::IMAGE_MIMES);
		$this->initialState->provideInitialState('video-mimes', Application::VIDEO_MIMES);
		$this->initialState->provideInitialState('maps', false);
		$this->initialState->provideInitialState('recognize', false);
		$this->initialState->provideInitialState('systemtags', false);

		Util::addScript(Application::APP_ID, 'photos-public');
		Util::addStyle(Application::APP_ID, 'photos-public');

		$response = new PublicTemplateResponse(Application::APP_ID, 'public');

		$policy = new ContentSecurityPolicy();
		$policy->addAllowedWorkerSrcDomain("'self'");
		$policy->addAllowedScriptDomain("'self'");
		$response->setContentSecurityPolicy($policy);

		return $response;
	}
}
