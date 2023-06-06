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
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\File;
use OCP\Files\NotFoundException;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\IFile;

class AlbumPhoto implements IFile {
	private AlbumMapper $albumMapper;
	private AlbumInfo $album;
	private AlbumFile $albumFile;
	private IRootFolder $rootFolder;

	public const TAG_FAVORITE = '_$!<Favorite>!$_';

	public function __construct(AlbumMapper $albumMapper, AlbumInfo $album, AlbumFile $albumFile, IRootFolder $rootFolder) {
		$this->albumMapper = $albumMapper;
		$this->album = $album;
		$this->albumFile = $albumFile;
		$this->rootFolder = $rootFolder;
	}

	/**
	 * @return void
	 */
	public function delete() {
		$this->albumMapper->removeFile($this->album->getId(), $this->albumFile->getFileId());
	}

	public function getName() {
		return $this->albumFile->getFileId() . "-" . $this->albumFile->getName();
	}

	/**
	 * @return never
	 */
	public function setName($name) {
		throw new Forbidden('Can\'t rename photos trough the album api');
	}

	public function getLastModified() {
		return $this->albumFile->getMTime();
	}

	public function put($data) {
		$nodes = $this->rootFolder
			->getUserFolder($this->albumFile->getOwner() ?: $this->album->getUserId())
			->getById($this->albumFile->getFileId());
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

	public function get() {
		$nodes = $this->rootFolder
			->getUserFolder($this->albumFile->getOwner() ?: $this->album->getUserId())
			->getById($this->albumFile->getFileId());
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

	public function getFileId(): int {
		return $this->albumFile->getFileId();
	}

	public function getFileInfo(): Node {
		$nodes = $this->rootFolder
			->getUserFolder($this->albumFile->getOwner() ?: $this->album->getUserId())
			->getById($this->albumFile->getFileId());
		$node = current($nodes);
		if ($node) {
			return $node;
		} else {
			throw new NotFoundException("Photo not found for user");
		}
	}

	public function getContentType() {
		return $this->albumFile->getMimeType();
	}

	public function getETag() {
		return $this->albumFile->getEtag();
	}

	public function getSize() {
		return $this->albumFile->getSize();
	}

	public function getFile(): AlbumFile {
		return $this->albumFile;
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

		return array_search(self::TAG_FAVORITE, current($tags)) !== false;
	}

	public function setFavoriteState($favoriteState): bool {
		$tagManager = \OCP\Server::get(\OCP\ITagManager::class);
		$tagger = $tagManager->load('files');

		switch ($favoriteState) {
			case "0":
				return $tagger->removeFromFavorites($this->albumFile->getFileId());
			case "1":
				return $tagger->addToFavorites($this->albumFile->getFileId());
			default:
				new \Exception('Favorite state is invalide, should be 0 or 1.');
		}
	}
}
