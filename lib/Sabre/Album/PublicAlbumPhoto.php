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

use OCP\Files\NotFoundException;
use Sabre\DAV\IFile;

class PublicAlbumPhoto extends AlbumPhoto implements IFile {
	/** @return void */
	public function delete() {
		throw new NotFoundException("Deleting photos from a public album is not allowed.");
	}

	/** @return void */
	public function put($data) {
		throw new NotFoundException("Changing a photo from a public album is not allowed.");
	}
}
