<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
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
		private PlaceInfo $placeInfo,
		PlaceFile $file,
		private IRootFolder $rootFolder,
		Folder $userFolder
	) {
		parent::__construct($file, $userFolder);
	}

	/**
	 * @return void
	 */
	public function delete() {
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
