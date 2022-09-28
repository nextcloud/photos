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

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Sabre\Album\AlbumsHome;
use OCA\Photos\Sabre\Album\SharedAlbumsHome;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\IRootFolder;
use OCP\IUserManager;
use OCP\IGroupManager;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\ICollection;

class PhotosHome implements ICollection {
	private AlbumMapper $albumMapper;
	private array $principalInfo;
	private string $userId;
	private IRootFolder $rootFolder;
	private IUserManager $userManager;
	private IGroupManager $groupManager;
	private UserConfigService $userConfigService;

	public function __construct(
		array $principalInfo,
		AlbumMapper $albumMapper,
		string $userId,
		IRootFolder $rootFolder,
		IUserManager $userManager,
		IGroupManager $groupManager,
		UserConfigService $userConfigService
	) {
		$this->principalInfo = $principalInfo;
		$this->albumMapper = $albumMapper;
		$this->userId = $userId;
		$this->rootFolder = $rootFolder;
		$this->userManager = $userManager;
		$this->groupManager = $groupManager;
		$this->userConfigService = $userConfigService;
	}

	/**
	 * @return never
	 */
	public function delete() {
		throw new Forbidden();
	}

	public function getName(): string {
		[, $name] = \Sabre\Uri\split($this->principalInfo['uri']);
		return $name;
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

	/**
	 * @return never
	 */
	public function createDirectory($name) {
		throw new Forbidden('Permission denied to create folders in this folder');
	}

	public function getChild($name) {
		switch ($name) {
			case AlbumsHome::NAME:
				return new AlbumsHome($this->principalInfo, $this->albumMapper, $this->userId, $this->rootFolder, $this->userConfigService);
			case SharedAlbumsHome::NAME:
				return new SharedAlbumsHome($this->principalInfo, $this->albumMapper, $this->userId, $this->rootFolder, $this->userManager, $this->groupManager, $this->userConfigService);
		}

		throw new NotFound();
	}

	/**
	 * @return (AlbumsHome)[]
	 */
	public function getChildren(): array {
		return [
			new AlbumsHome($this->principalInfo, $this->albumMapper, $this->userId, $this->rootFolder, $this->userConfigService),
			new SharedAlbumsHome($this->principalInfo, $this->albumMapper, $this->userId, $this->rootFolder, $this->userManager, $this->groupManager, $this->userConfigService),
		];
	}

	public function childExists($name): bool {
		return $name === AlbumsHome::NAME || $name === SharedAlbumsHome::NAME;
	}

	public function getLastModified(): int {
		return 0;
	}
}
