<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Place;

use OCA\Photos\DB\Place\PlaceFile;
use OCA\Photos\DB\Place\PlaceInfo;
use OCA\Photos\Sabre\CollectionPhoto;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\IFile;

class PlacePhoto extends CollectionPhoto implements IFile {
	public function __construct(
		private readonly PlaceInfo $placeInfo,
		PlaceFile $file,
		private readonly IRootFolder $rootFolder,
		Folder $userFolder,
	) {
		parent::__construct($file, $userFolder);
	}

	public function delete(): never {
		throw new Forbidden('Cannot remove from a place');
	}

	private function getNode(): Node {
		$nodes = $this->rootFolder
			->getUserFolder($this->placeInfo->getUserId())
			->getById($this->file->getFileId());

		$node = current($nodes);

		if ($node) {
			return $node;
		} else {
			throw new NotFoundException('Photo not found for user');
		}
	}

	public function get() {
		$node = $this->getNode();

		if ($node instanceof File) {
			return $node->fopen('r');
		} else {
			throw new NotFoundException('Photo is a folder');
		}
	}

	public function getFileInfo(): Node {
		return $this->getNode();
	}
}
