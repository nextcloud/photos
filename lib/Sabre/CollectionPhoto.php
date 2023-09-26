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

namespace OCA\Photos\Sabre;

use OCA\Photos\DB\PhotosFile;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\ITags;
use Sabre\DAV\Exception\Forbidden;

class CollectionPhoto {
	public function __construct(
		protected PhotosFile $file,
		protected Folder $userFolder,
	) {
	}

	public function getName() {
		return $this->file->getFileId() . "-" . $this->file->getName();
	}

	/**
	 * @return never
	 */
	public function setName($name) {
		throw new Forbidden('Can\'t rename photos trough this api');
	}

	public function getLastModified() {
		return $this->file->getMTime();
	}

	public function put($data) {
		$nodes = $this->userFolder->getById($this->file->getFileId());
		$node = current($nodes);
		if ($node) {
			/** @var Node $node */
			if ($node instanceof File) {
				return $node->putContent($data);
			} else {
				throw new NotFoundException("Photo is a folder");
			}
		} else {
			throw new NotFoundException("Photo not found for user");
		}
	}

	public function getFileId(): int {
		return $this->file->getFileId();
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

	public function getFile(): PhotosFile {
		return $this->file;
	}

	public function isFavorite(): bool {
		$tagManager = \OCP\Server::get(\OCP\ITagManager::class);
		$tagger = $tagManager->load('files');
		if ($tagger === null) {
			return false;
		}
		$tags = $tagger->getTagsForObjects([$this->getFileId()]);

		if ($tags === false || empty($tags)) {
			return false;
		}

		return array_search(ITags::TAG_FAVORITE, current($tags)) !== false;
	}

	public function setFavoriteState($favoriteState): bool {
		$tagManager = \OCP\Server::get(\OCP\ITagManager::class);
		$tagger = $tagManager->load('files');

		switch ($favoriteState) {
			case "0":
				return $tagger->removeFromFavorites($this->file->getFileId());
			case "1":
				return $tagger->addToFavorites($this->file->getFileId());
			default:
				new \Exception('Favorite state is invalide, should be 0 or 1.');
		}
	}
}
