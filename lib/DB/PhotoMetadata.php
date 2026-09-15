<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;

/**
 * User-editable details for a photo, keyed by its file id.
 *
 * @method int getFileId()
 * @method void setFileId(int $fileId)
 * @method string|null getDescription()
 * @method void setDescription(?string $description)
 * @method int getRating()
 * @method void setRating(int $rating)
 */
class PhotoMetadata extends Entity implements JsonSerializable {
	protected int $fileId = 0;
	protected ?string $description = null;
	protected int $rating = 0;

	public function __construct() {
		$this->addType('fileId', 'integer');
		$this->addType('rating', 'integer');
	}

	#[\Override]
	public function jsonSerialize(): array {
		return [
			'fileId' => $this->fileId,
			'description' => $this->description,
			'rating' => $this->rating,
		];
	}
}
