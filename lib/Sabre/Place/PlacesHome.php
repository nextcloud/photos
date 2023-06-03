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
	public function delete() {
		throw new Forbidden();
	}

	public function getName(): string {
		return self::NAME;
	}

	/**
	 * @return never
	 */
	public function setName($name) {
		throw new Forbidden('Permission denied to rename this folder');
	}

	public function createFile($name, $data = null) {
		throw new Forbidden('Not allowed to create files in this folder');
	}

	public function createDirectory($name) {
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
				fn (PlaceInfo $placeInfo) => new PlaceRoot($this->placeMapper, $this->reverseGeoCoderService, $placeInfo, $this->userId, $this->rootFolder),
				$this->placeMapper->findPlacesForUser($this->userId)
			);
		}

		return $this->children;
	}

	public function childExists($name): bool {
		try {
			$this->getChild($name);
			return true;
		} catch (NotFound $e) {
			return false;
		}
	}

	public function getLastModified(): int {
		return 0;
	}
}
