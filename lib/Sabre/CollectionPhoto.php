<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre;

use OCA\Photos\DB\PhotosFile;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\ITagManager;
use OCP\ITags;
use OCP\Server;
use Sabre\DAV\Exception\Forbidden;

class CollectionPhoto {
	public function __construct(
		protected PhotosFile $file,
		protected Folder $userFolder,
	) {
	}

	public function getName() {
		return $this->file->getFileId() . '-' . $this->file->getName();
	}

	public function setName($name): never {
		throw new Forbidden('Can\'t rename photos through this api');
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
				throw new NotFoundException('Photo is a folder');
			}
		} else {
			throw new NotFoundException('Photo not found for user');
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
		$tagManager = Server::get(ITagManager::class);
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
		$tagManager = Server::get(ITagManager::class);
		$tagger = $tagManager->load('files');

		switch ($favoriteState) {
			case '0':
				return $tagger->removeFromFavorites($this->file->getFileId());
			case '1':
				return $tagger->addToFavorites($this->file->getFileId());
			default:
				new \Exception('Favorite state is invalide, should be 0 or 1.');
		}
	}
}
