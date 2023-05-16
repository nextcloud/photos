<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022 Robin Appelman <robin@icewind.nl>
 *
 * @license GNU AGPL version 3 or any later version
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

namespace OCA\Photos\Sabre\Album;

use OCA\Photos\Album\AlbumWithFiles;
use OCA\Photos\Service\UserConfigService;
use Sabre\DAV\Exception\Forbidden;
use OCP\IUserManager;
use OCP\IGroupManager;
use OCA\Photos\Album\AlbumMapper;
use OCP\Files\IRootFolder;

class SharedAlbumsHome extends AlbumsHome {
	private IUserManager $userManager;
	private IGroupManager $groupManager;

	public const NAME = 'sharedalbums';

	public function __construct(
		array $principalInfo,
		AlbumMapper $albumMapper,
		string $userId,
		IRootFolder $rootFolder,
		IUserManager $userManager,
		IGroupManager $groupManager,
		UserConfigService $userConfigService
	) {
		parent::__construct(
			$principalInfo,
			$albumMapper,
			$userId,
			$rootFolder,
			$userConfigService
		);

		$this->userManager = $userManager;
		$this->groupManager = $groupManager;
	}

	/**
	 * @return never
	 */
	public function createDirectory($name) {
		throw new Forbidden('Not allowed to create folders in this folder');
	}

	/**
	 * @return SharedAlbumRoot[]
	 */
	public function getChildren(): array {
		if ($this->children === null) {
			$albums = $this->albumMapper->getSharedAlbumsForCollaboratorWithFiles($this->userId, AlbumMapper::TYPE_USER);

			$user = $this->userManager->get($this->userId);
			$userGroups = $this->groupManager->getUserGroupIds($user);
			foreach ($userGroups as $groupId) {
				$albumsForGroup = $this->albumMapper->getSharedAlbumsForCollaboratorWithFiles($groupId, AlbumMapper::TYPE_GROUP);
				$albumsForGroup = array_udiff($albumsForGroup, $albums, fn ($a, $b) => $a->getAlbum()->getId() - $b->getAlbum()->getId());
				$albums = array_merge($albums, $albumsForGroup);
			}

			$this->children = array_map(function (AlbumWithFiles $album) {
				return new SharedAlbumRoot($this->albumMapper, $album, $this->rootFolder, $this->userId, $this->userConfigService, $this->userManager);
			}, $albums);
		}

		return $this->children;
	}
}
