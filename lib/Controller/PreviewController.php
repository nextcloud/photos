<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022, Louis Chmn <louis@chmn.me>
 *
 * @author Louis Chmn <louis@chmn.me>
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

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Service\FileAccessManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\FileDisplayResponse;
use OCP\Files\File;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\IPreview;
use OCP\IRequest;
use OCP\IUserSession;

class PreviewController extends Controller {
	private FileAccessManager $fileAccessManager;
	protected AlbumMapper $albumMapper;
	private IPreview $preview;

	public function __construct(
		FileAccessManager $fileAccessManager,
		IRequest $request,
		IUserSession $userSession,
		IPreview $preview
	) {
		parent::__construct(Application::APP_ID, $request);

		$this->fileAccessManager = $fileAccessManager;
		$this->userSession = $userSession;
		$this->preview = $preview;
	}
	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * Render default index template
	 *
	 * @return DataResponse|FileDisplayResponse
	 */
	public function index(
		int $fileId = -1,
		int $x = 32,
		int $y = 32
	) {
		if ($fileId === -1 || $x === 0 || $y === 0) {
			return new DataResponse([], Http::STATUS_BAD_REQUEST);
		}

		if (!$this->userSession->isLoggedIn()) {
			return new DataResponse([], Http::STATUS_FORBIDDEN);
		}

		$node = $this->fileAccessManager->getAccessibleNodeForUser($fileId, $this->userSession->getUser());

		if ($node === null) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		return $this->fetchPreview($node, $x, $y);
	}

	/**
	 * @return DataResponse|FileDisplayResponse
	 */
	protected function fetchPreview(
		Node $node,
		int $x,
		int $y
	) : Http\Response {
		if (!($node instanceof File) || !$this->preview->isAvailable($node)) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}
		if (!$node->isReadable()) {
			return new DataResponse([], Http::STATUS_FORBIDDEN);
		}

		try {
			$f = $this->preview->getPreview($node, $x, $y);
			$response = new FileDisplayResponse($f, Http::STATUS_OK, [
				'Content-Type' => $f->getMimeType(),
			]);
			$response->cacheFor(3600 * 24, false, true);
			return $response;
		} catch (NotFoundException $e) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		} catch (\InvalidArgumentException $e) {
			return new DataResponse([], Http::STATUS_BAD_REQUEST);
		}
	}
}
