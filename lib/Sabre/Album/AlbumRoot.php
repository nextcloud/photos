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

use OCA\DAV\Connector\Sabre\File;
use OCA\Photos\Album\AlbumFile;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Album\AlbumWithFiles;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\Folder;
use OCP\Files\InvalidDirectoryException;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use Sabre\DAV\Exception\Conflict;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\ICollection;
use Sabre\DAV\ICopyTarget;
use Sabre\DAV\INode;

class AlbumRoot implements ICollection, ICopyTarget {
	protected AlbumMapper $albumMapper;
	protected AlbumWithFiles $album;
	protected IRootFolder $rootFolder;
	protected string $userId;

	public function __construct(
		AlbumMapper $albumMapper,
		AlbumWithFiles $album,
		IRootFolder $rootFolder,
		string $userId,
		UserConfigService $userConfigService
	) {
		$this->albumMapper = $albumMapper;
		$this->album = $album;
		$this->rootFolder = $rootFolder;
		$this->userId = $userId;
		$this->userConfigService = $userConfigService;
	}

	/**
	 * @return void
	 */
	public function delete() {
		$this->albumMapper->delete($this->album->getAlbum()->getId());
	}

	public function getName(): string {
		return basename($this->album->getAlbum()->getTitle());
	}

	/**
	 * @return void
	 */
	public function setName($name) {
		$this->albumMapper->rename($this->album->getAlbum()->getId(), $name);
	}

	protected function getPhotosLocationInfo() {
		$photosLocation = $this->userConfigService->getUserConfig('photosLocation');
		$userFolder = $this->rootFolder->getUserFolder($this->userId);
		return [$photosLocation, $userFolder];
	}

	/**
	 * We cannot create files in an Album
	 * We add the file to the default Photos folder and then link it there.
	 *
	 * @param string $name
	 * @param null|resource|string $data
	 * @return void
	 */
	public function createFile($name, $data = null) {
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
				throw new InvalidDirectoryException('The destination is a received share');
			}

			// Check for conflict and rename the file accordingly
			$newName = \basename(\OC_Helper::buildNotExistingFileName($photosLocation, $name));

			$node = $photosFolder->newFile($newName, $data);
			$this->addFile($node->getId(), $node->getOwner()->getUID());
			// Cheating with header because we are using fileID-fileName
			// https://github.com/nextcloud/server/blob/af29b978078ffd9169a9bd9146feccbb7974c900/apps/dav/lib/Connector/Sabre/FilesPlugin.php#L564-L585
			\header('OC-FileId: ' . $node->getId());
			return '"' . $node->getEtag() . '"';
		} catch (\Exception $e) {
			throw new Forbidden('Could not create file');
		}
	}

	/**
	 * @return never
	 */
	public function createDirectory($name) {
		throw new Forbidden('Not allowed to create directories in this folder');
	}

	public function getChildren(): array {
		return array_map(function (AlbumFile $file) {
			return new AlbumPhoto($this->albumMapper, $this->album->getAlbum(), $file, $this->rootFolder, $this->rootFolder->getUserFolder($this->userId));
		}, $this->album->getFiles());
	}

	public function getChild($name): AlbumPhoto {
		foreach ($this->album->getFiles() as $file) {
			if ($file->getFileId() . "-" . $file->getName() === $name) {
				return new AlbumPhoto($this->albumMapper, $this->album->getAlbum(), $file, $this->rootFolder, $this->rootFolder->getUserFolder($this->userId));
			}
		}
		throw new NotFound("$name not found");
	}

	public function childExists($name): bool {
		try {
			$this->getChild($name);
			return true;
		} catch (NotFound $e) {
			return false;
		}
	}

	public function getLastModified(): int {
		return 0;
	}

	public function copyInto($targetName, $sourcePath, INode $sourceNode): bool {
		if (!$sourceNode instanceof File) {
			throw new Forbidden("The source is not a file");
		}

		$sourceId = $sourceNode->getId();
		$ownerUID = $sourceNode->getFileInfo()->getOwner()->getUID();
		$uid = $this->userId;
		if ($ownerUID !== $uid) {
			throw new Forbidden("Can't add file to album, only files from $uid can be added");
		}

		return $this->addFile($sourceId, $ownerUID);
	}

	protected function addFile(int $sourceId, string $ownerUID): bool {
		if (in_array($sourceId, $this->album->getFileIds())) {
			throw new Conflict("File $sourceId is already in the folder");
		}
		if ($ownerUID === $this->userId) {
			$this->albumMapper->addFile($this->album->getAlbum()->getId(), $sourceId, $ownerUID);
			$node = current($this->rootFolder->getUserFolder($ownerUID)->getById($sourceId));
			$this->album->addFile(new AlbumFile($sourceId, $node->getName(), $node->getMimetype(), $node->getSize(), $node->getMTime(), $node->getEtag(), $node->getCreationTime(), $ownerUID));
			return true;
		}
		return false;
	}

	public function getAlbum(): AlbumWithFiles {
		return $this->album;
	}

	public function getDateRange(): array {
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
	 * @return int|null
	 */
	public function getCover() {
		$children = $this->getChildren();

		if (count($children) > 0) {
			return $children[0]->getFileId();
		} else {
			return null;
		}
	}

	/**
	 * @return array{array{'nc:collaborator': array{'id': string, 'label': string, 'type': int}}}
	 */
	public function getCollaborators(): array {
		return array_map(
			fn (array $collaborator) => [ 'nc:collaborator' => $collaborator ],
			$this->albumMapper->getCollaborators($this->album->getAlbum()->getId()),
		);
	}

	/**
	 * @param array{'id': string, 'type': int} $collaborators
	 * @return array{array{'nc:collaborator': array{'id': string, 'label': string, 'type': int}}}
	 */
	public function setCollaborators($collaborators): array {
		$this->albumMapper->setCollaborators($this->getAlbum()->getAlbum()->getId(), $collaborators);
		return $this->getCollaborators();
	}
}
