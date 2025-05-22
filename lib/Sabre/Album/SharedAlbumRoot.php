<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Album;

use OCA\Photos\Album\AlbumFile;
use Sabre\DAV\Exception\Conflict;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\INode;

class SharedAlbumRoot extends AlbumRootBase {

	public function delete(): void {
		$this->albumMapper->deleteUserFromAlbumCollaboratorsList($this->userId, $this->album->getAlbum()->getId());
	}

	public function setName($name): never {
		throw new Forbidden('Not allowed to rename a shared album');
	}

	public function createFile($name, $data = null) {
		return parent::createFileInCurrentUserFolder($name, $data);
	}

	public function getAlbumPhoto(AlbumFile $file): AlbumPhoto {
		return new AlbumPhoto($this->albumMapper, $this->album->getAlbum(), $file, $this->rootFolder, $this->rootFolder->getUserFolder($this->userId));
	}

	public function copyInto($targetName, $sourcePath, INode $sourceNode): bool {
		return parent::copyIntoAlbum($targetName, $sourcePath, $sourceNode);
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
				'type' => $this->album->getAlbum()->getReceivedFrom(),
			],
		]];
	}
}
