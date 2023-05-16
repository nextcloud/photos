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

use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\Conflict;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Album\AlbumWithFiles;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\IRootFolder;
use OCP\IUserManager;

class SharedAlbumRoot extends AlbumRoot {
	private IUserManager $userManager;

	public function __construct(
		AlbumMapper $albumMapper,
		AlbumWithFiles $album,
		IRootFolder $rootFolder,
		string $userId,
		UserConfigService $userConfigService,
		IUserManager $userManager
	) {
		parent::__construct(
			$albumMapper,
			$album,
			$rootFolder,
			$userId,
			$userConfigService,
			$userManager
		);

		$this->userManager = $userManager;
	}

	/**
	 * @return void
	 */
	public function delete() {
		$this->albumMapper->deleteUserFromAlbumCollaboratorsList($this->userId, $this->album->getAlbum()->getId());
	}

	/**
	 * @return void
	 */
	public function setName($name) {
		throw new Forbidden('Not allowed to rename a shared album');
	}

	protected function addFile(int $sourceId, string $ownerUID): bool {
		if (in_array($sourceId, $this->album->getFileIds())) {
			throw new Conflict("File $sourceId is already in the folder");
		}

		if (!$this->albumMapper->isCollaborator($this->album->getAlbum()->getId(), $this->userId)) {
			return false;
		}

		$this->albumMapper->addFile($this->album->getAlbum()->getId(), $sourceId, $ownerUID);
		return true;
	}

	/**
	 * Return only the owner, and do not reveal other collaborators.
	 */
	public function getCollaborators(): array {
		return [[
			'nc:collaborator' => [
				'id' => $this->album->getAlbum()->getUserId(),
				'label' => $this->userManager->get($this->album->getAlbum()->getUserId())->getDisplayName(),
				'type' => 1,
			],
		]];
	}

	public function setCollaborators($collaborators): array {
		throw new Forbidden('Not allowed to collaborators to a public album');
	}
}
