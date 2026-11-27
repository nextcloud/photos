<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use OCA\Photos\DB\Place\PlaceMapper;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IFilesMetadata;

class MediaPlaceManager {
	public function __construct(
		private readonly IFilesMetadataManager $filesMetadataManager,
		private readonly ReverseGeoCoderService $rgcService,
		private readonly PlaceMapper $placeMapper,
	) {
	}

	public function setPlaceForFile(int $fileId): void {
		$metadata = $this->filesMetadataManager->getMetadata($fileId, true);
		$place = $this->getPlaceForMetadata($metadata);

		if ($place === null) {
			return;
		}

		$metadata->setString('gps', $place['name'], true);
	}

	/**
	 * Store the place derived from the coordinates and its country code.
	 *
	 * @return bool false when no place can be derived, the metadata is then left untouched
	 */
	public function setPlaceForMetadata(IFilesMetadata $metadata): bool {
		$place = $this->getPlaceForMetadata($metadata);
		if ($place === null) {
			return false;
		}

		$metadata->setString(PlaceMetadataProvider::METADATA_KEY, $place['name'], true);
		if ($place['countryCode'] === '') {
			$metadata->unset(PlaceMetadataProvider::METADATA_KEY_COUNTRY);
		} else {
			$metadata->setString(PlaceMetadataProvider::METADATA_KEY_COUNTRY, $place['countryCode'], true);
		}

		return true;
	}

	/**
	 * @return array{name: string, countryCode: string}|null
	 */
	public function getPlaceForMetadata(IFilesMetadata $metadata): ?array {
		if (!$this->rgcService->arePlacesEnabled() || !$metadata->hasKey(ExifMetadataProvider::METADATA_KEY_GPS)) {
			return null;
		}

		$coordinate = $metadata->getArray(ExifMetadataProvider::METADATA_KEY_GPS);

		$latitude = $coordinate['latitude'] ?? null;
		$longitude = $coordinate['longitude'] ?? null;
		if ($latitude === null || $longitude === null) {
			return null;
		}

		return $this->rgcService->getPlaceForCoordinates((float)$latitude, (float)$longitude);
	}
}
