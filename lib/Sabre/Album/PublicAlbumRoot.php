<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Album;

use OCA\Photos\Album\AlbumFile;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\INode;

class PublicAlbumRoot extends AlbumRootBase {
	public function delete(): never {
		throw new Forbidden('Not allowed to delete a public album');
	}

	public function setName($name): never {
		throw new Forbidden('Not allowed to rename a public album');
	}

	public function copyInto($targetName, $sourcePath, INode $sourceNode): bool {
		throw new Forbidden('Not allowed to copy into a public album');
	}

	public function createFile($name, $data = null) {
		throw new Forbidden('Not allowed to create a file in a public album');
	}

	protected function addFile(int $sourceId, string $ownerUID): bool {
		throw new Forbidden('Not allowed to add a file to a public album');
	}

	public function getCollaborators(): array {
		return [];
	}

	public function getAlbumPhoto(AlbumFile $file): AlbumPhoto {
		return new PublicAlbumPhoto($this->albumMapper, $this->album->getAlbum(), $file, $this->rootFolder, $this->rootFolder->getUserFolder($this->userId));
	}
}
