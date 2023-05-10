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

use OCP\AppFramework\Controller;
use OCA\Photos\AppInfo\Application;
use OCA\Viewer\Event\LoadViewer;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\Template\PublicTemplateResponse;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\AppFramework\Services\IInitialState;
use OCP\IRequest;
use OCP\Util;

class PublicAlbumController extends Controller {
	private IEventDispatcher $eventDispatcher;
	private IInitialState $initialState;

	public function __construct(
		IRequest $request,
		IEventDispatcher $eventDispatcher,
		IInitialState $initialState
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

		$response = new PublicTemplateResponse(Application::APP_ID, 'public');

		$policy = new ContentSecurityPolicy();
		$policy->addAllowedWorkerSrcDomain("'self'");
		$policy->addAllowedScriptDomain("'self'");
		$response->setContentSecurityPolicy($policy);

		return $response;
	}
}
