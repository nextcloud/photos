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

use OCA\Photos\Album\AlbumMapper;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\FileDisplayResponse;

class PublicPreviewController extends PreviewController {
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

		$publicAlbums = $this->albumMapper->getAlbumsForCollaboratorIdAndFileId($token, AlbumMapper::TYPE_LINK, $fileId);
		$nodes = $this->getFileIdForAlbums($fileId, $publicAlbums);

		if (\count($nodes) === 0) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$node = array_pop($nodes);

		return $this->fetchPreview($node, $x, $y);
	}
}
