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

namespace OCA\Photos\Service;

use OCA\Photos\DB\Place\PlaceMapper;
use OCP\FilesMetadata\Exceptions\FilesMetadataNotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;

class MediaPlaceManager {
	public function __construct(
		private IFilesMetadataManager $filesMetadataManager,
		private ReverseGeoCoderService $rgcService,
		private PlaceMapper $placeMapper,
	) {
	}

	public function setPlaceForFile(int $fileId): void {
		$place = $this->getPlaceForFile($fileId);

		if ($place === null) {
			return;
		}

		$this->placeMapper->setPlaceForFile($place, $fileId);
	}

	public function getPlaceForFile(int $fileId): ?string {
		try {
			$metadata = $this->filesMetadataManager->getMetadata($fileId, true);
		} catch (FilesMetadataNotFoundException) {
			return null;
		}


		if (!$metadata->hasKey('photos-gps')) {
			return null;
		}

		$coordinate = $metadata->getArray('photos-gps');

		$latitude = $coordinate['latitude'] ?? null;
		$longitude = $coordinate['longitude'] ?? null;
		if ($latitude === null || $longitude === null) {
			return null;
		}

		return $this->rgcService->getPlaceForCoordinates((float) $latitude, (float) $longitude);
	}
}
