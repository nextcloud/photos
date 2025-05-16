<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
		?string $token = null,
	) {
		if ($fileId === -1 || $x === 0 || $y === 0) {
			return new DataResponse([], Http::STATUS_BAD_REQUEST);
		}

		if ($token === null) {
			return new DataResponse([], Http::STATUS_FORBIDDEN);
		}

		$publicAlbums = $this->albumMapper->getSharedAlbumsForCollaborator($token, AlbumMapper::TYPE_LINK);
		$nodes = $this->getFileIdForAlbums($fileId, $publicAlbums);

		if (\count($nodes) === 0) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$node = array_pop($nodes);

		return $this->fetchPreview($node, $x, $y);
	}
}
