<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Album;

use OCA\Photos\Album\AlbumFile;
use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Sabre\CollectionPhoto;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\IFile;

class AlbumPhoto extends CollectionPhoto implements IFile {
	public function __construct(
		private readonly AlbumMapper $albumMapper,
		private readonly AlbumInfo $album,
		private readonly AlbumFile $albumFile,
		private readonly IRootFolder $rootFolder,
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
			throw new NotFound('Photo not found for user');
		}
	}

	public function get() {
		$node = $this->getNode();
		if ($node instanceof File) {
			return $node->fopen('r');
		} else {
			throw new NotFound('Photo is a folder');
		}
	}

	public function getFileInfo(): Node {
		return $this->getNode();
	}
}
