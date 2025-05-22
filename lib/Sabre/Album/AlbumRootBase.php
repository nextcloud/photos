<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Album;

use OCA\DAV\Connector\Sabre\File;
use OCA\Photos\Album\AlbumFile;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Album\AlbumWithFiles;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IUserManager;
use Psr\Log\LoggerInterface;
use Sabre\DAV\Exception\Conflict;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\ICollection;
use Sabre\DAV\ICopyTarget;
use Sabre\DAV\INode;

abstract class AlbumRootBase implements ICollection, ICopyTarget {
	public function __construct(
		protected AlbumMapper $albumMapper,
		protected AlbumWithFiles $album,
		protected IRootFolder $rootFolder,
		protected string $userId,
		protected UserConfigService $userConfigService,
		protected LoggerInterface $logger,
		protected IUserManager $userManager,
	) {
	}
	abstract public function delete(): void;

	final public function getName(): string {
		return basename($this->album->getAlbum()->getTitle());
	}

	abstract public function setName($name): void;

	abstract public function createFile($name, $data = null);

	private function getPhotosLocationInfo() {
		$photosLocation = $this->userConfigService->getUserConfig('photosLocation');
		$userFolder = $this->rootFolder->getUserFolder($this->userId);
		return [$photosLocation, $userFolder];
	}

	/**
	 * We cannot create files in an Album
	 * We add the file to the default Photos folder and then link it there.
	 * @param string|resource|null $data
	 */
	public function createFileInCurrentUserFolder(string $name, mixed $data = null): string {
		try {
			[$photosLocation, $userFolder] = $this->getPhotosLocationInfo();

			try {
				$photosFolder = $userFolder->get($photosLocation);
			} catch (NotFoundException $e) {
				// If the folder does not exists, create it
				$photosFolder = $userFolder->newFolder($photosLocation);
			}

			// If the node is not a folder, we throw
			if (!($photosFolder instanceof Folder)) {
				throw new Conflict('The destination exists and is not a folder');
			}

			if ($photosFolder->isShared()) {
				throw new Forbidden('The destination is a received share');
			}

			// Check for conflict and rename the file accordingly
			$newName = $photosFolder->getNonExistingName($name);

			$node = $photosFolder->newFile($newName, $data);
			$this->addFile($node->getId(), $node->getOwner()->getUID());
			// Cheating with header because we are using fileID-fileName
			// https://github.com/nextcloud/server/blob/af29b978078ffd9169a9bd9146feccbb7974c900/apps/dav/lib/Connector/Sabre/FilesPlugin.php#L564-L585
			\header('OC-FileId: ' . $node->getId());
			return '"' . $node->getEtag() . '"';
		} catch (\Exception $e) {
			$this->logger->error('Could not create file', ['exception' => $e]);
			throw new Forbidden('Could not create file');
		}
	}

	public function copyIntoAlbum(string $targetName, string $sourcePath, INode $sourceNode): bool {
		if (!$sourceNode instanceof File) {
			throw new Forbidden('The source is not a file');
		}

		$sourceId = $sourceNode->getId();
		$ownerUID = $sourceNode->getFileInfo()->getOwner()->getUID();
		$uid = $this->userId;
		if ($ownerUID !== $uid) {
			throw new Forbidden("Can't add file to album, only files from $uid can be added");
		}

		return $this->addFile($sourceId, $ownerUID);
	}

	final public function createDirectory($name) {
		throw new Forbidden('Not allowed to create directories in an album');
	}

	abstract public function getAlbumPhoto(AlbumFile $file): AlbumPhoto;

	/**
	 * @return AlbumPhoto[]
	 */
	final public function getChildren(): array {
		return array_map(fn (AlbumFile $file) => $this->getAlbumPhoto($file), $this->album->getFiles());
	}

	final public function getChild($name): AlbumPhoto {
		foreach ($this->album->getFiles() as $file) {
			if ($file->getFileId() . '-' . $file->getName() === $name) {
				return $this->getAlbumPhoto($file);
			}
		}

		throw new NotFound("$name not found");
	}

	final public function childExists($name): bool {
		try {
			$this->getChild($name);
			return true;
		} catch (NotFound $e) {
			return false;
		}
	}

	final public function getLastModified(): int {
		return 0;
	}

	abstract protected function addFile(int $sourceId, string $ownerUID);

	final public function getAlbum(): AlbumWithFiles {
		return $this->album;
	}

	final public function getDateRange(): array {
		$earliestDate = null;
		$latestDate = null;

		foreach ($this->getChildren() as $child) {
			try {
				$childCreationDate = $child->getFileInfo()->getMtime();
			} catch (NotFoundException $e) {
				continue;
			}

			if ($childCreationDate < $earliestDate || $earliestDate === null) {
				$earliestDate = $childCreationDate;
			}

			if ($childCreationDate > $earliestDate || $latestDate === null) {
				$latestDate = $childCreationDate;
			}
		}

		return ['start' => $earliestDate, 'end' => $latestDate];
	}

	/**
	 * @return array{array{'nc:collaborator': array{'id': string, 'label': string, 'type': int}}}
	 */
	abstract public function getCollaborators(): array;

	public function setCollaborators(array $collaborators): array {
		throw new Forbidden('Setting the collaborators is not allowed on this type of album');
	}

	public function setLocation(string $location): void {
		throw new Forbidden('Setting the location is not allowed on this type of album');
	}

	final public function getFilters(): ?string {
		return $this->album->getAlbum()->getFilters();
	}

	public function setFilters(string $filters) {
		throw new Forbidden('Setting the filters is not allowed on this type of album');
	}

	public function getCover(): int {
		$lastAddedPhoto = $this->album->getAlbum()->getLastAddedPhoto();

		// If the album might be empty, but still contain photos based on filters.
		if ($lastAddedPhoto === -1 && isset($this->getChildren()[0])) {
			return $this->getChildren()[0]->getFileId();
		} else {
			return $lastAddedPhoto;
		}
	}
}
