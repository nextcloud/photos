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

namespace OCA\Photos\Sabre\Location;

use OCA\Photos\DB\Location\LocationFile;
use OCA\Photos\DB\Location\LocationInfo;
use OCA\Photos\DB\Location\LocationMapper;
use OCA\Photos\Service\ReverseGeoCoderService;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\ICollection;

class LocationRoot implements ICollection {
	/** @var LocationFile[]|null */
	protected ?array $children = null;

	public function __construct(
		protected LocationMapper $locationMapper,
		protected ReverseGeoCoderService $reverseGeoCoderService,
		protected LocationInfo $locationInfo,
		protected string $userId,
		protected IRootFolder $rootFolder,
	) {
	}

	/**
	 * @return never
	 */
	public function delete() {
		throw new Forbidden('Not allowed to delete a location collection');
	}

	public function getName(): string {
		return $this->locationInfo->getLocation();
	}

	/**
	 * @return never
	 */
	public function setName($name) {
		throw new Forbidden('Cannot change the location collection name');
	}

	/**
	 * @param string $name
	 * @param null|resource|string $data
	 * @return never
	 */
	public function createFile($name, $data = null) {
		throw new Forbidden('Cannot create a file in a location collection');
	}

	/**
	 * @return never
	 */
	public function createDirectory($name) {
		throw new Forbidden('Not allowed to create directories in this folder');
	}

	/**
	 * @return LocationPhoto[]
	 */
	public function getChildren(): array {
		if ($this->children === null) {
			$this->children = array_map(
				fn (LocationFile $file) => new LocationPhoto($this->locationInfo, $file, $this->rootFolder, $this->rootFolder->getUserFolder($this->userId)),
				$this->locationMapper->findFilesForUserAndLocation($this->locationInfo->getUserId(), $this->locationInfo->getLocation())
			);
		}

		return $this->children;
	}

	public function getChild($name): LocationPhoto {
		try {
			[$fileId, $fileName] = explode('-', $name, 2);
			$locationFile = $this->locationMapper->findFileForUserAndLocation($this->locationInfo->getUserId(), $this->locationInfo->getLocation(), $fileId, $fileName);
			return new LocationPhoto($this->locationInfo, $locationFile, $this->rootFolder, $this->rootFolder->getUserFolder($this->userId));
		} catch (NotFoundException $ex) {
			throw new NotFound("File $name not found", 0, $ex);
		}
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

	public function getFirstPhoto(): int {
		$children = $this->getChildren();
		if (count($children) === 0) {
			throw new \Exception('No children found for location');
		}

		return $children[0]->getFileId();
	}

	/**
	 * @return int[]
	 */
	public function getFileIds(): array {
		return array_map(function (LocationPhoto $file) {
			return $file->getFileId();
		}, $this->getChildren());
	}

	/**
	 * @return int|null
	 */
	public function getCover() {
		$children = $this->getChildren();

		if (count($children) > 0) {
			return $children[0]->getFileId();
		} else {
			return null;
		}
	}
}
