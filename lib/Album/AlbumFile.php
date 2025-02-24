<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Album;

use OCA\Photos\DB\PhotosFile;

class AlbumFile extends PhotosFile {
	private int $added;
	private string $owner;

	public function __construct(
		int $fileId,
		string $name,
		string $mimeType,
		int $size,
		int $mtime,
		string $etag,
		int $added,
		string $owner,
	) {
		parent::__construct(
			$fileId,
			$name,
			$mimeType,
			$size,
			$mtime,
			$etag
		);

		$this->added = $added;
		$this->owner = $owner;
	}

	public function getAdded(): int {
		return $this->added;
	}

	public function getOwner(): string {
		return $this->owner;
	}
}
