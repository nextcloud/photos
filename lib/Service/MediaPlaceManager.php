<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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

		if (!$this->rgcService->arePlacesEnabled() || !$metadata->hasKey('photos-gps')) {
			return null;
		}

		$coordinate = $metadata->getArray('photos-gps');

		$latitude = $coordinate['latitude'] ?? null;
		$longitude = $coordinate['longitude'] ?? null;
		if ($latitude === null || $longitude === null) {
			return null;
		}

		return $this->rgcService->getPlaceForCoordinates((float)$latitude, (float)$longitude);
	}
}
