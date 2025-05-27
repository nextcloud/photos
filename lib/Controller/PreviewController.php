<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\Filters\FiltersManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\FileDisplayResponse;
use OCP\AppFramework\Http\Response;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\Files\Storage\ISharedStorage;
use OCP\IGroupManager;
use OCP\IPreview;
use OCP\IRequest;
use OCP\IUserSession;

class PreviewController extends Controller {

	public function __construct(
		IRequest $request,
		private readonly IUserSession $userSession,
		private readonly ?Folder $userFolder,
		private readonly IRootFolder $rootFolder,
		protected readonly AlbumMapper $albumMapper,
		private readonly IPreview $preview,
		private readonly IGroupManager $groupManager,
		private readonly FiltersManager $filtersManager,
	) {
		parent::__construct(Application::APP_ID, $request);
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
		int $y = 32,
	) {
		if ($fileId === -1 || $x === 0 || $y === 0) {
			return new DataResponse([], Http::STATUS_BAD_REQUEST);
		}

		$user = $this->userSession->getUser();

		if ($user === null || $this->userFolder === null) {
			return new DataResponse([], Http::STATUS_FORBIDDEN);
		}

		$nodes = $this->userFolder->getById($fileId);
		$nodes = array_filter(
			$nodes,
			function ($node) {
				$storage = $node->getStorage();
				if (!$storage->instanceOfStorage(ISharedStorage::class)) {
					return true;
				}

				/** @var ISharedStorage $storage */
				$share = $storage->getShare();
				$attributes = $share->getAttributes();

				return $attributes === null || $attributes->getAttribute('permissions', 'download') !== false;
			},
		);

		/** @var AlbumInfo[] */
		$checkedAlbums = [];
		if (\count($nodes) === 0) {
			$albumsOfCurrentUser = $this->albumMapper->getForUserAndFile($user->getUID(), $fileId);
			$nodes = $this->getFileIdForAlbums($fileId, $albumsOfCurrentUser);
			$checkedAlbums = $albumsOfCurrentUser;
		}

		if (\count($nodes) === 0) {
			$receivedAlbums = $this->albumMapper->getSharedAlbumsForCollaborator($user->getUID(), AlbumMapper::TYPE_USER);
			$receivedAlbums = array_udiff($receivedAlbums, $checkedAlbums, fn ($a, $b): int => ($a->getId() - $b->getId()));
			$nodes = $this->getFileIdForAlbums($fileId, $receivedAlbums);
			$checkedAlbums = array_merge($checkedAlbums, $receivedAlbums);
		}

		if (\count($nodes) === 0) {
			$userGroups = $this->groupManager->getUserGroupIds($user);
			foreach ($userGroups as $groupId) {
				$albumsForGroup = $this->albumMapper->getSharedAlbumsForCollaborator($groupId, AlbumMapper::TYPE_GROUP);
				$albumsForGroup = array_udiff($albumsForGroup, $checkedAlbums, fn ($a, $b): int => ($a->getId() - $b->getId()));
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

	/**
	 * @param AlbumInfo[] $albums
	 * @return Node[]
	 */
	protected function getFileIdForAlbums(int $fileId, array $albums): array {
		foreach ($albums as $album) {
			$albumFile = $this->albumMapper->getForAlbumIdAndFileId($album->getId(), $fileId);

			if ($albumFile === null) {
				$albumFiles = $this->filtersManager->getFilesBasedOnFilters($album->getUserId(), $album->getDecodedFilters(), $fileId);
				$albumFile = array_pop($albumFiles);
			}

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
		int $y,
	) : Response {
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
		} catch (NotFoundException) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		} catch (\InvalidArgumentException) {
			return new DataResponse([], Http::STATUS_BAD_REQUEST);
		}
	}
}
