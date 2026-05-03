<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB;

use OCP\AppFramework\Db\Entity;

/**
 * One row in the per-user photo index. `userId` + `fileId` together
 * form the natural primary key (a shared photo gets one row per
 * recipient). `takenAt` is the EXIF capture time when known; we
 * fall back to `mtime` at insert time so the timeline can sort by a
 * single non-null column.
 *
 * @method int|null getFileIdValue()
 * @method void setFileId(int $fileId)
 * @method string getUserId()
 * @method void setUserId(string $userId)
 * @method string getMimetype()
 * @method void setMimetype(string $mimetype)
 * @method int getIsVideo()
 * @method void setIsVideo(int $isVideo)
 * @method int getSize()
 * @method void setSize(int $size)
 * @method int getMtime()
 * @method void setMtime(int $mtime)
 * @method int|null getTakenAt()
 * @method void setTakenAt(?int $takenAt)
 * @method int getIndexedAt()
 * @method void setIndexedAt(int $indexedAt)
 */
class PhotoIndex extends Entity {
	protected int $fileId = 0;
	protected string $userId = '';
	protected string $mimetype = '';
	protected int $isVideo = 0;
	protected int $size = 0;
	protected int $mtime = 0;
	protected ?int $takenAt = null;
	protected int $indexedAt = 0;

	public function __construct() {
		$this->addType('fileId', 'integer');
		$this->addType('isVideo', 'integer');
		$this->addType('size', 'integer');
		$this->addType('mtime', 'integer');
		$this->addType('takenAt', 'integer');
		$this->addType('indexedAt', 'integer');
	}
}
