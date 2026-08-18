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
	/**
	 * Resolved node, or `false` once we know there is none.
	 */
	private Node|false|null $node = null;

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
	#[\Override]
	public function delete() {
		$this->albumMapper->removeFile($this->album->getId(), $this->file->getFileId());
	}

	private function getNode(): Node {
		if ($this->node === null) {
			$nodes = $this->rootFolder
				->getUserFolder($this->albumFile->getOwner() ?: $this->album->getUserId())
				->getById($this->file->getFileId());
			$this->node = current($nodes) ?: false;
		}

		if ($this->node === false) {
			throw new NotFound('Photo not found for user');
		}

		return $this->node;
	}

	/**
	 * Whether the file behind this entry can still be reached by its owner.
	 */
	public function exists(): bool {
		try {
			$this->getNode();
			return true;
		} catch (NotFound) {
			return false;
		}
	}

	#[\Override]
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
