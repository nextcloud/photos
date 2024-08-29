<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Album;

use OCA\Photos\Album\AlbumFile;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\INode;

class PublicAlbumRoot extends AlbumRoot {
	/**
	 * @return void
	 */
	public function delete() {
		throw new Forbidden('Not allowed to delete a public album');
	}

	/**
	 * @return void
	 */
	public function setName($name) {
		throw new Forbidden('Not allowed to rename a public album');
	}

	public function copyInto($targetName, $sourcePath, INode $sourceNode): bool {
		throw new Forbidden('Not allowed to copy into a public album');
	}

	protected function getPhotosLocationInfo() {
		$albumOwner = $this->album->getAlbum()->getUserId();
		$photosLocation = $this->userConfigService->getConfigForUser($albumOwner, 'photosLocation');
		$userFolder = $this->rootFolder->getUserFolder($albumOwner);
		return [$photosLocation, $userFolder];
	}

	public function createFile($name, $data = null) {
		throw new Forbidden('Not allowed to create a file in a public album');
	}

	protected function addFile(int $sourceId, string $ownerUID): bool {
		throw new Forbidden('Not allowed to add a file to a public album');
	}

	// Do not reveal collaborators for public albums.
	public function getCollaborators(): array {
		/** @var array{array{'nc:collaborator': array{'id': string, 'label': string, 'type': int}}} */
		return [];
	}

	public function setCollaborators($collaborators): array {
		throw new Forbidden('Not allowed to collaborators a public album');
	}

	public function getChildren(): array {
		return array_map(function (AlbumFile $file) {
			return new PublicAlbumPhoto($this->albumMapper, $this->album->getAlbum(), $file, $this->rootFolder, $this->rootFolder->getUserFolder($this->userId));
		}, $this->album->getFiles());
	}

	public function getChild($name): PublicAlbumPhoto {
		foreach ($this->album->getFiles() as $file) {
			if ($file->getFileId() . '-' . $file->getName() === $name) {
				return new PublicAlbumPhoto($this->albumMapper, $this->album->getAlbum(), $file, $this->rootFolder, $this->rootFolder->getUserFolder($this->userId));
			}
		}

		throw new NotFound("$name not found");
	}
}
