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

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Album\AlbumWithFiles;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IUser;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\ICollection;

class AlbumsHome implements ICollection {
	private AlbumMapper $albumMapper;
	private array $principalInfo;
	private IUser $user;
	private IRootFolder $rootFolder;
	private Folder $userFolder;

	public function __construct(
		array $principalInfo,
		AlbumMapper $albumMapper,
		IUser $user,
		IRootFolder $rootFolder
	) {
		$this->principalInfo = $principalInfo;
		$this->albumMapper = $albumMapper;
		$this->user = $user;
		$this->rootFolder = $rootFolder;
		$this->userFolder = $rootFolder->getUserFolder($user->getUID());
	}

	public function delete() {
		throw new Forbidden();
	}

	public function getName(): string {
		return 'albums';
	}

	public function setName($name) {
		throw new Forbidden('Permission denied to rename this folder');
	}

	public function createFile($name, $data = null) {
		throw new Forbidden('Not allowed to create files in this folder');
	}

	public function createDirectory($name) {
		$uid = $this->user->getUID();
		$this->albumMapper->create($uid, $name);
	}

	public function getChild($name) {
		foreach ($this->getChildren() as $child) {
			if ($child->getName() === $name) {
				return $child;
			}
		}

		throw new NotFound();
	}

	/**
	 * @return AlbumRoot[]
	 */
	public function getChildren(): array {
		$folders = $this->albumMapper->getForUserWithFiles($this->user->getUID());
		return array_map(function (AlbumWithFiles $folder) {
			return new AlbumRoot($this->albumMapper, $folder, $this->rootFolder, $this->userFolder, $this->user);
		}, $folders);
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
