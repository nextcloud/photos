<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2021 Robin Appelman <robin@icewind.nl>
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
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IUser;
use Sabre\DAV\Exception\Conflict;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\ICollection;
use Sabre\DAV\ICopyTarget;
use Sabre\DAV\INode;

class AlbumRoot implements ICollection, ICopyTarget {
	private AlbumMapper $albumMapper;
	private AlbumWithFiles $album;
	private IRootFolder $rootFolder;
	private Folder $userFolder;
	private IUser $user;

	public function __construct(AlbumMapper $albumMapper, AlbumWithFiles $album, IRootFolder $rootFolder, Folder $userFolder, IUser $user) {
		$this->albumMapper = $albumMapper;
		$this->album = $album;
		$this->rootFolder = $rootFolder;
		$this->userFolder = $userFolder;
		$this->user = $user;
	}

	public function delete() {
		$this->albumMapper->delete($this->album->getAlbum()->getId());
	}

	public function getName(): string {
		return basename($this->album->getAlbum()->getTitle());
	}

	public function setName($name) {
		$this->albumMapper->rename($this->album->getAlbum()->getId(), $name);
	}

	public function createFile($name, $data = null) {
		throw new Forbidden('Not allowed to create files in this folder, copy files into this folder instead');
	}

	public function createDirectory($name) {
		throw new Forbidden('Not allowed to create directories in this folder');
	}

	public function getChildren(): array {
		return array_map(function (AlbumFile $file) {
			return new AlbumPhoto($this->albumMapper, $this->album->getAlbum(), $file, $this->userFolder);
		}, $this->album->getFiles());
	}

	public function getChild($name): AlbumPhoto {
		foreach ($this->album->getFiles() as $file) {
			if ($file->getName() === $name) {
				return new AlbumPhoto($this->albumMapper, $this->album->getAlbum(), $file, $this->userFolder);
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
		$uid = $this->user->getUID();
		if ($sourceNode instanceof File) {
			$sourceId = $sourceNode->getId();
			if (in_array($sourceId, $this->album->getFileIds())) {
				throw new Conflict("File $sourceId is already in the folder");
			}
			if ($sourceNode->getFileInfo()->getOwner()->getUID() === $uid) {
				$this->albumMapper->addFile($this->album->getAlbum()->getId(), $sourceId);
				return true;
			}
		}
		throw new \Exception("Can't add file to album, only files from $uid can be added");
	}
}
