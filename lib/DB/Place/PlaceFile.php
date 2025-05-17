<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB\Place;

use OCA\Photos\DB\PhotosFile;

class PlaceFile extends PhotosFile {
	public function __construct(
		int $fileId,
		string $name,
		string $mimeType,
		int $size,
		int $mtime,
		string $etag,
		private readonly string $place,
	) {
		parent::__construct(
			$fileId,
			$name,
			$mimeType,
			$size,
			$mtime,
			$etag,
		);
	}

	public function getPlace(): string {
		return $this->place;
	}
}
