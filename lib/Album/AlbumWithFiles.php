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

namespace OCA\Photos\Album;

class AlbumWithFiles {
	private AlbumInfo $info;
	private AlbumMapper $albumMapper;

	/** @var AlbumFile[] */
	private array $files;

	public function __construct(
		AlbumInfo $info,
		AlbumMapper $albumMapper,
		array $files = []) {
		$this->info = $info;
		$this->albumMapper = $albumMapper;
		$this->files = $files;
	}

	public function getAlbum(): AlbumInfo {
		return $this->info;
	}

	/**
	 * @return AlbumFile[]
	 */
	public function getFiles(): array {
		if (empty($this->files)) {
			$this->files = $this->fetchFiles();
		}
		return $this->files;
	}

	/**
	 * @return AlbumFile[]
	 */
	public function addFile(AlbumFile $file): array {
		if (empty($this->files)) {
			$this->files = $this->fetchFiles();
		}

		array_push($this->files, $file);
		return $this->files;
	}

	/**
	 * @return int[]
	 */
	public function getFileIds(): array {
		return array_map(function (AlbumFile $file) {
			return $file->getFileId();
		}, $this->getFiles());
	}

	/**
	 * @return AlbumFile[]
	 */
	private function fetchFiles(): array {
		return $this->albumMapper->getForAlbumIdAndUserWithFiles($this->info->getId(), $this->info->getUserId());
	}
}
