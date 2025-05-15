<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Place;

use OCA\Photos\DB\Place\PlaceInfo;
use OCA\Photos\DB\Place\PlaceMapper;
use OCA\Photos\Service\ReverseGeoCoderService;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\ICollection;

class PlacesHome implements ICollection {
	public const NAME = 'places';

	/**
	 * @var PlaceRoot[]
	 */
	protected ?array $children = null;

	public function __construct(
		protected string $userId,
		protected IRootFolder $rootFolder,
		protected ReverseGeoCoderService $reverseGeoCoderService,
		protected PlaceMapper $placeMapper,
	) {
	}

	/**
	 * @return never
	 */
	public function delete(): never {
		throw new Forbidden();
	}

	public function getName(): string {
		return self::NAME;
	}

	/**
	 * @return never
	 */
	public function setName($name): never {
		throw new Forbidden('Permission denied to rename this folder');
	}

	public function createFile($name, $data = null): never {
		throw new Forbidden('Not allowed to create files in this folder');
	}

	public function createDirectory($name): never {
		throw new Forbidden('Not allowed to create folder in this folder');
	}

	public function getChild($name): PlaceRoot {
		try {
			$placeInfo = $this->placeMapper->findPlaceForUser($this->userId, $name);
			return new PlaceRoot($this->placeMapper, $this->reverseGeoCoderService, $placeInfo, $this->userId, $this->rootFolder);
		} catch (NotFoundException $ex) {
			throw new NotFound("Place $name does not exist", 0, $ex);
		}
	}

	/**
	 * @return PlaceRoot[]
	 */
	public function getChildren(): array {
		if ($this->children === null) {
			$this->children = array_map(
				fn (PlaceInfo $placeInfo): PlaceRoot => new PlaceRoot($this->placeMapper, $this->reverseGeoCoderService, $placeInfo, $this->userId, $this->rootFolder),
				$this->placeMapper->findPlacesForUser($this->userId)
			);
		}

		return $this->children;
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
}
