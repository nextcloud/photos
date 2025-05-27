<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Album;

use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\IFile;

class PublicAlbumPhoto extends AlbumPhoto implements IFile {
	public function delete(): never {
		throw new Forbidden('Deleting photos from a public album is not allowed.');
	}

	public function put($data): never {
		throw new Forbidden('Changing a photo from a public album is not allowed.');
	}
}
