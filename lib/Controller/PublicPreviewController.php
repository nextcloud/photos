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

use OCA\Photos\Service\FileAccessManager;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\FileDisplayResponse;
use OCP\IPreview;
use OCP\IRequest;
use OCP\IUserSession;

class PublicPreviewController extends PreviewController {
	private FileAccessManager $fileAccessManager;

	public function __construct(
		FileAccessManager $fileAccessManager,
		IRequest $request,
		IUserSession $userSession,
		IPreview $preview
	) {
		parent::__construct(
			$fileAccessManager,
			$request,
			$userSession,
			$preview
		);

		$this->fileAccessManager = $fileAccessManager;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * @PublicPage
	 * Render default index template
	 *
	 * @return DataResponse|FileDisplayResponse
	 */
	public function index(
		int $fileId = -1,
		int $x = 32,
		int $y = 32,
		string $token = null
	) {
		if ($fileId === -1 || $x === 0 || $y === 0) {
			return new DataResponse([], Http::STATUS_BAD_REQUEST);
		}

		if ($token === null) {
			return new DataResponse([], Http::STATUS_FORBIDDEN);
		}

		$node = $this->fileAccessManager->getAccessibleNodeForPublicAlbum($fileId, $token);

		if ($node === null) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		return $this->fetchPreview($node, $x, $y);
	}
}
