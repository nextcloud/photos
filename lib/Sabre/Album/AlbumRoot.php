<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Album;

use OCA\Photos\Album\AlbumFile;
use Sabre\DAV\Exception\Conflict;
use Sabre\DAV\ICollection;
use Sabre\DAV\ICopyTarget;
use Sabre\DAV\INode;

class AlbumRoot extends AlbumRootBase implements ICollection, ICopyTarget {
	public function delete(): void {
		$this->albumMapper->delete($this->album->getAlbum()->getId());
	}

	public function setName($name): void {
		$this->albumMapper->rename($this->album->getAlbum()->getId(), $name);
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
		if ($ownerUID === $this->userId) {
			$this->albumMapper->addFile($this->album->getAlbum()->getId(), $sourceId, $ownerUID);
			$node = current($this->rootFolder->getUserFolder($ownerUID)->getById($sourceId));
			$this->album->addFile(new AlbumFile($sourceId, $node->getName(), $node->getMimetype(), $node->getSize(), $node->getMTime(), $node->getEtag(), $node->getCreationTime(), $ownerUID, 'user'));
			return true;
		}
		return false;
	}

	public function getCollaborators(): array {
		return array_map(
			fn (array $collaborator): array => [ 'nc:collaborator' => $collaborator ],
			$this->albumMapper->getCollaborators($this->album->getAlbum()->getId()),
		);
	}

	/**
	 * @param array{'id': string, 'type': int} $collaborators
	 * @return array{array{'nc:collaborator': array{'id': string, 'label': string, 'type': int}}}
	 */
	public function setCollaborators(array $collaborators): array {
		$this->albumMapper->setCollaborators($this->getAlbum()->getAlbum()->getId(), $collaborators);
		return $this->getCollaborators();
	}

	public function setLocation(string $location): void {
		$this->albumMapper->setLocation($this->getAlbum()->getAlbum()->getId(), $location);
	}

	public function setFilters(string $filters) {
		$this->albumMapper->setAlbumFilters($this->getAlbum()->getAlbum()->getId(), $filters);
	}
}
