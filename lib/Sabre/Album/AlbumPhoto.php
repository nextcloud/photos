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

use OCA\Photos\Album\AlbumFile;
use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\Files\File;
use OCP\Files\NotFoundException;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\IFile;

class AlbumPhoto implements IFile {
	private AlbumMapper $albumMapper;
	private AlbumInfo $album;
	private AlbumFile $file;
	private Folder $userFolder;

	public function __construct(AlbumMapper $albumMapper, AlbumInfo $album, AlbumFile $file, Folder $userFolder) {
		$this->albumMapper = $albumMapper;
		$this->album = $album;
		$this->file = $file;
		$this->userFolder = $userFolder;
	}

	public function delete() {
		$this->albumMapper->removeFile($this->album->getId(), $this->file->getFileId());
	}

	public function getName() {
		return $this->file->getFileId() . "-" . $this->file->getName();
	}

	public function setName($name) {
		throw new Forbidden('Can\'t rename photos trough the album api');
	}

	public function getLastModified() {
		return $this->file->getMTime();
	}

	public function put($data) {
		throw new Forbidden('Can\'t write to photos trough the album api');
	}

	public function get() {
		$nodes = $this->userFolder->getById($this->file->getFileId());
		$node = current($nodes);
		if ($node) {
			/** @var Node $node */
			if ($node instanceof File) {
				return $node->fopen('r');
			} else {
				throw new NotFoundException("Photo is a folder");
			}
		} else {
			throw new NotFoundException("Photo not found for user");
		}
	}

	public function getContentType() {
		return $this->file->getMimeType();
	}

	public function getETag() {
		return $this->file->getEtag();
	}

	public function getSize() {
		return $this->file->getSize();
	}

	public function getFile(): AlbumFile {
		return $this->file;
	}
}
