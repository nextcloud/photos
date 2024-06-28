<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB;

class PhotosFile {
	public function __construct(
		private int $fileId,
		private string $name,
		private string $mimeType,
		private int $size,
		private int $mtime,
		private string $etag,
	) {
	}

	public function getFileId(): int {
		return $this->fileId;
	}

	public function getName(): string {
		return $this->name;
	}

	public function getMimeType(): string {
		return $this->mimeType;
	}

	public function getSize(): int {
		return $this->size;
	}

	public function getMTime(): int {
		return $this->mtime;
	}

	public function getEtag(): string {
		return $this->etag;
	}
}
