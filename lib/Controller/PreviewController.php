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
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\FileDisplayResponse;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\IPreview;
use OCP\IRequest;
use OCP\IGroupManager;
use OCP\IUserSession;

class PreviewController extends Controller {
	private IUserSession $userSession;
	private ?Folder $userFolder;
	private IRootFolder $rootFolder;
	protected AlbumMapper $albumMapper;
	private IPreview $preview;
	private IGroupManager $groupManager;

	public function __construct(
		IRequest $request,
		IUserSession $userSession,
		?Folder $userFolder,
		IRootFolder $rootFolder,
		AlbumMapper $albumMapper,
		IPreview $preview,
		IGroupManager $groupManager
	) {
		parent::__construct(Application::APP_ID, $request);

		$this->userSession = $userSession;
		$this->userFolder = $userFolder;
		$this->rootFolder = $rootFolder;
		$this->albumMapper = $albumMapper;
		$this->preview = $preview;
		$this->groupManager = $groupManager;
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

		$user = $this->userSession->getUser();

		if ($user === null || $this->userFolder === null) {
			return new DataResponse([], Http::STATUS_FORBIDDEN);
		}

		$nodes = $this->userFolder->getById($fileId);

		/** @var \OCA\Photos\Album\AlbumInfo[] */
		$checkedAlbums = [];
		if (\count($nodes) === 0) {
			$albumsOfCurrentUser = $this->albumMapper->getForUserAndFile($user->getUID(), $fileId);
			$nodes = $this->getFileIdForAlbums($fileId, $albumsOfCurrentUser);
			$checkedAlbums = $albumsOfCurrentUser;
		}

		if (\count($nodes) === 0) {
			$receivedAlbums = $this->albumMapper->getAlbumsForCollaboratorIdAndFileId($user->getUID(), AlbumMapper::TYPE_USER, $fileId);
			$receivedAlbums = array_udiff($receivedAlbums, $checkedAlbums, fn ($a, $b) => ($a->getId() - $b->getId()));
			$nodes = $this->getFileIdForAlbums($fileId, $receivedAlbums);
			$checkedAlbums = array_merge($checkedAlbums, $receivedAlbums);
		}

		if (\count($nodes) === 0) {
			$userGroups = $this->groupManager->getUserGroupIds($user);
			foreach ($userGroups as $groupId) {
				$albumsForGroup = $this->albumMapper->getAlbumsForCollaboratorIdAndFileId($groupId, AlbumMapper::TYPE_GROUP, $fileId);
				$albumsForGroup = array_udiff($albumsForGroup, $checkedAlbums, fn ($a, $b) => ($a->getId() - $b->getId()));
				$nodes = $this->getFileIdForAlbums($fileId, $albumsForGroup);
				$checkedAlbums = array_merge($checkedAlbums, $receivedAlbums);
				if (\count($nodes) !== 0) {
					break;
				}
			}
		}

		if (\count($nodes) === 0) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$node = array_pop($nodes);

		return $this->fetchPreview($node, $x, $y);
	}


	protected function getFileIdForAlbums($fileId, $albums) {
		foreach ($albums as $album) {
			$albumFile = $this->albumMapper->getForAlbumIdAndFileId($album->getId(), $fileId);
			$nodes = $this->rootFolder
				->getUserFolder($albumFile->getOwner())
				->getById($fileId);
			if (\count($nodes) !== 0) {
				return $nodes;
			}
		}

		return [];
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
