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

class SharedAlbumRoot extends AlbumRoot {
	/**
	 * @return void
	 */
	public function delete() {
		$this->albumMapper->deleteUserFromAlbumCollaboratorsList($this->user->getUID(), $this->album->getAlbum()->getId());
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

		$collaboratorIds = array_map(
			fn ($collaborator) => $collaborator['type'].':'.$collaborator['id'],
			$this->albumMapper->getCollaborators($this->album->getAlbum()->getId()),
		);
		$uid = $this->user->getUID();
		if (!in_array(AlbumMapper::TYPE_USER.':'.$uid, $collaboratorIds)) {
			return false;
		}

		$this->albumMapper->addFile($this->album->getAlbum()->getId(), $sourceId, $ownerUID);
		return true;
	}

	// Do not reveal collaborators for shared albums.
	public function getCollaborators() {
		return [];
	}
}
