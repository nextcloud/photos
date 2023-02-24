<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
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
		private string $place,
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
