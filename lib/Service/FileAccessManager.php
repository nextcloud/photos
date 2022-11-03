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

namespace OCA\Photos\Service;

use OCA\Photos\Album\AlbumMapper;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\IGroupManager;
use OCP\IUser;

class FileAccessManager {
	private IRootFolder $rootFolder;
	protected AlbumMapper $albumMapper;
	private IGroupManager $groupManager;

	public function __construct(
		IRootFolder $rootFolder,
		AlbumMapper $albumMapper,
		IGroupManager $groupManager
	) {
		$this->rootFolder = $rootFolder;
		$this->albumMapper = $albumMapper;
		$this->groupManager = $groupManager;
	}

	public function getAccessibleNodeForUser(int $fileId, IUser $user): ?Node {
		$nodes = $this->rootFolder->getUserFolder($user->getUID())->getById($fileId);

		/** @var \OCA\Photos\Album\AlbumInfo[] */
		$checkedAlbums = [];

		if (count($nodes) === 0) {
			$albumsOfCurrentUser = $this->albumMapper->getForUserAndFile($user->getUID(), $fileId);
			$nodes = $this->getFileIdForAlbums($fileId, $albumsOfCurrentUser);
			$checkedAlbums = $albumsOfCurrentUser;
		}

		if (count($nodes) === 0) {
			$receivedAlbums = $this->albumMapper->getAlbumsForCollaboratorIdAndFileId($user->getUID(), AlbumMapper::TYPE_USER, $fileId);
			$receivedAlbums = array_udiff($receivedAlbums, $checkedAlbums, fn ($a, $b) => strcmp($a->getId(), $b->getId()));
			$nodes = $this->getFileIdForAlbums($fileId, $receivedAlbums);
			$checkedAlbums = array_merge($checkedAlbums, $receivedAlbums);
		}

		if (count($nodes) === 0) {
			$userGroups = $this->groupManager->getUserGroupIds($user);
			foreach ($userGroups as $groupId) {
				$albumsForGroup = $this->albumMapper->getAlbumsForCollaboratorIdAndFileId($groupId, AlbumMapper::TYPE_GROUP, $fileId);
				$albumsForGroup = array_udiff($albumsForGroup, $checkedAlbums, fn ($a, $b) => strcmp($a->getId(), $b->getId()));
				$nodes = $this->getFileIdForAlbums($fileId, $albumsForGroup);
				$checkedAlbums = array_merge($checkedAlbums, $receivedAlbums);
				if (count($nodes) !== 0) {
					break;
				}
			}
		}

		if (count($nodes) === 0) {
			return null;
		}

		return array_pop($nodes);
	}

	public function getAccessibleNodeForPublicAlbum(int $fileId, string $token): ?Node {
		if ($token === null) {
			return null;
		}

		$publicAlbums = $this->albumMapper->getAlbumsForCollaboratorIdAndFileId($token, AlbumMapper::TYPE_LINK, $fileId);
		$nodes = $this->getFileIdForAlbums($fileId, $publicAlbums);

		if (\count($nodes) === 0) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		return array_pop($nodes);
	}

	private function getFileIdForAlbums($fileId, $albums) {
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
}
