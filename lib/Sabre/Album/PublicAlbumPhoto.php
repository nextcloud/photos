<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Album;

use OCP\Files\NotFoundException;
use Sabre\DAV\IFile;

class PublicAlbumPhoto extends AlbumPhoto implements IFile {
	/** @return void */
	public function delete() {
		throw new NotFoundException('Deleting photos from a public album is not allowed.');
	}

	/** @return void */
	public function put($data) {
		throw new NotFoundException('Changing a photo from a public album is not allowed.');
	}
}
