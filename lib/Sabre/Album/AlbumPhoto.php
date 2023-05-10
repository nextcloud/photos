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

use OCA\Photos\Album\AlbumFile;
use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Sabre\CollectionPhoto;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\NotFoundException;
use Sabre\DAV\IFile;

class AlbumPhoto extends CollectionPhoto implements IFile {
	public function __construct(
		private AlbumMapper $albumMapper,
		private AlbumInfo $album,
		private AlbumFile $albumFile,
		private IRootFolder $rootFolder,
		Folder $userFolder,
	) {
		parent::__construct($albumFile, $userFolder);
	}

	/**
	 * @return void
	 */
	public function delete() {
		$this->albumMapper->removeFile($this->album->getId(), $this->file->getFileId());
	}

	private function getNode(): Node {
		$nodes = $this->rootFolder
			->getUserFolder($this->albumFile->getOwner() ?: $this->album->getUserId())
			->getById($this->file->getFileId());
		$node = current($nodes);
		if ($node) {
			return $node;
		} else {
			throw new NotFoundException("Photo not found for user");
		}
	}

	public function get() {
		$node = $this->getNode();
		if ($node instanceof File) {
			return $node->fopen('r');
		} else {
			throw new NotFoundException("Photo is a folder");
		}
	}

	public function getFileInfo(): Node {
		return $this->getNode();
	}
}
