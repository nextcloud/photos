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

use OC\Metadata\IMetadataManager;
use OCA\Photos\DB\Location\LocationMapper;

class MediaLocationManager {
	public function __construct(
		private IMetadataManager $metadataManager,
		private ReverseGeoCoderService $rgcService,
		private LocationMapper $locationMapper,
	) {
	}

	public function setLocationForFile(int $fileId): void {
		$location = $this->getLocationForFile($fileId);

		if ($location === null) {
			return;
		}

		$this->locationMapper->setLocationForFile($location, $fileId);
	}

	public function updateLocationForFile(int $fileId): void {
		$location = $this->getLocationForFile($fileId);

		if ($location === null) {
			return;
		}

		$this->locationMapper->updateLocationForFile($location, $fileId);
	}

	private function getLocationForFile(int $fileId): ?string {
		$gpsMetadata = $this->metadataManager->fetchMetadataFor('gps', [$fileId])[$fileId];
		$metadata = $gpsMetadata->getMetadata();

		if (count($metadata) === 0) {
			return null;
		}

		$latitude = $metadata['latitude'];
		$longitude = $metadata['longitude'];

		if ($latitude === null || $longitude === null) {
			return null;
		}

		return $this->rgcService->getLocationForCoordinates($latitude, $longitude);
	}
}
