<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Album;

use OCA\Photos\Album\AlbumFile;
use OCA\Photos\Album\AlbumMapper;
use Sabre\DAV\Exception\BadRequest;
use Sabre\DAV\Exception\Conflict;
use Sabre\DAV\ICollection;
use Sabre\DAV\ICopyTarget;
use Sabre\DAV\INode;

class AlbumRoot extends AlbumRootBase implements ICollection, ICopyTarget {
	#[\Override]
	public function delete(): void {
		$this->albumMapper->delete($this->album->getAlbum()->getId());
	}

	#[\Override]
	public function setName($name): void {
		$this->albumMapper->rename($this->album->getAlbum()->getId(), $name);
	}

	#[\Override]
	public function createFile($name, $data = null) {
		return parent::createFileInCurrentUserFolder($name, $data);
	}

	#[\Override]
	public function getAlbumPhoto(AlbumFile $file): AlbumPhoto {
		return new AlbumPhoto($this->albumMapper, $this->album->getAlbum(), $file, $this->rootFolder, $this->rootFolder->getUserFolder($this->userId));
	}

	#[\Override]
	public function copyInto($targetName, $sourcePath, INode $sourceNode, ?int $depth = null): bool {
		return parent::copyIntoAlbum($targetName, $sourcePath, $sourceNode);
	}

	#[\Override]
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

	#[\Override]
	public function getCollaborators(): array {
		return array_map(
			fn (array $collaborator): array => [ 'nc:collaborator' => $collaborator ],
			$this->albumMapper->getCollaborators($this->album->getAlbum()->getId()),
		);
	}

	#[\Override]
	public function setCollaborators(array $collaborators): array {
		$this->albumMapper->setCollaborators($this->getAlbum()->getAlbum()->getId(), $collaborators);
		return $this->getCollaborators();
	}

	#[\Override]
	public function setLocation(string $location): void {
		$this->albumMapper->setLocation($this->getAlbum()->getAlbum()->getId(), $location);
	}

	#[\Override]
	public function setFilters(string $filters) {
		$this->albumMapper->setAlbumFilters($this->getAlbum()->getAlbum()->getId(), $filters);
	}

	#[\Override]
	public function setDescription(string $description): void {
		if (mb_strlen($description) > AlbumMapper::DESCRIPTION_MAX_LENGTH) {
			throw new BadRequest('The description is too long');
		}

		$this->albumMapper->setDescription($this->getAlbum()->getAlbum()->getId(), $description);
	}

	#[\Override]
	public function setCover(int $fileId): void {
		if ($fileId !== -1 && !in_array($fileId, $this->getAlbum()->getFileIds(), true)) {
			throw new BadRequest('The cover must be a photo of the album');
		}

		$this->albumMapper->setCover($this->getAlbum()->getAlbum()->getId(), $fileId);
	}
}
