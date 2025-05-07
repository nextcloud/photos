<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Place;

use OCA\Photos\DB\Place\PlaceFile;
use OCA\Photos\DB\Place\PlaceInfo;
use OCA\Photos\DB\Place\PlaceMapper;
use OCA\Photos\Service\ReverseGeoCoderService;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\ICollection;

class PlaceRoot implements ICollection {
	/** @var PlacePhoto[]|null */
	protected ?array $children = null;

	public function __construct(
		protected PlaceMapper $placeMapper,
		protected ReverseGeoCoderService $reverseGeoCoderService,
		protected PlaceInfo $placeInfo,
		protected string $userId,
		protected IRootFolder $rootFolder,
	) {
	}

	/**
	 * @return never
	 */
	public function delete(): never {
		throw new Forbidden('Not allowed to delete a place collection');
	}

	public function getName(): string {
		return $this->placeInfo->getPlace();
	}

	/**
	 * @return never
	 */
	public function setName($name): never {
		throw new Forbidden('Cannot change the place collection name');
	}

	/**
	 * @param string $name
	 * @param null|resource|string $data
	 * @return never
	 */
	public function createFile($name, $data = null): never {
		throw new Forbidden('Cannot create a file in a place collection');
	}

	/**
	 * @return never
	 */
	public function createDirectory($name): never {
		throw new Forbidden('Not allowed to create directories in this folder');
	}

	/**
	 * @return PlacePhoto[]
	 */
	public function getChildren(): array {
		if ($this->children === null) {
			$this->children = array_map(
				fn (PlaceFile $file): PlacePhoto => new PlacePhoto($this->placeInfo, $file, $this->rootFolder, $this->rootFolder->getUserFolder($this->userId)),
				$this->placeMapper->findFilesForUserAndPlace($this->placeInfo->getUserId(), $this->placeInfo->getPlace())
			);
		}

		return $this->children;
	}

	public function getChild($name): PlacePhoto {
		try {
			[$fileId, $fileName] = explode('-', (string)$name, 2);
			$placeFile = $this->placeMapper->findFileForUserAndPlace($this->placeInfo->getUserId(), $this->placeInfo->getPlace(), $fileId, $fileName);
			return new PlacePhoto($this->placeInfo, $placeFile, $this->rootFolder, $this->rootFolder->getUserFolder($this->userId));
		} catch (NotFoundException $ex) {
			throw new NotFound("File $name not found", 0, $ex);
		}
	}

	public function childExists($name): bool {
		try {
			$this->getChild($name);
			return true;
		} catch (NotFound) {
			return false;
		}
	}

	public function getLastModified(): int {
		return 0;
	}

	public function getFirstPhoto(): int {
		$children = $this->getChildren();
		if (count($children) === 0) {
			throw new \Exception('No children found for place');
		}

		return $children[0]->getFileId();
	}

	/**
	 * @return int[]
	 */
	public function getFileIds(): array {
		return array_map(fn (PlacePhoto $file): int => $file->getFileId(), $this->getChildren());
	}
}
