<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
