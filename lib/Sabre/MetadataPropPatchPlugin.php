<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre;

use OCA\DAV\Connector\Sabre\File;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCA\Photos\Service\MediaPlaceManager;
use OCP\FilesMetadata\IFilesMetadataManager;
use Sabre\DAV\Exception\BadRequest;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\PropPatch;
use Sabre\DAV\Server;
use Sabre\DAV\ServerPlugin;
use Sabre\Xml\Reader;
use function Sabre\Xml\Deserializer\keyValue;

/**
 * Let the position and the taken date of a photo be corrected through PROPPATCH.
 *
 * Both are extracted from the picture itself, but cameras do get them wrong:
 * the clock is off, the GPS module was disabled, or the picture was scanned
 * from an old print. The corrected values are stored as file metadata, the
 * picture itself is left untouched.
 *
 * The properties are handled here rather than by the metadata handling of the
 * DAV app, which cannot write them: it rejects any metadata not declared as
 * editable, and the declaration is reset every time a photo is scanned again.
 */
class MetadataPropPatchPlugin extends ServerPlugin {

	private const string NS_NEXTCLOUD = 'http://nextcloud.org/ns';

	public const string GPS_PROPERTYNAME = '{' . self::NS_NEXTCLOUD . '}metadata-' . ExifMetadataProvider::METADATA_KEY_GPS;
	public const string ORIGINAL_DATE_TIME_PROPERTYNAME = '{' . self::NS_NEXTCLOUD . '}metadata-' . OriginalDateTimeMetadataProvider::METADATA_KEY;

	/** Absolute maximum of the coordinates, in degrees. */
	private const array COORDINATE_LIMITS = [
		'latitude' => 90.0,
		'longitude' => 180.0,
	];

	private ?Server $server = null;

	public function __construct(
		private readonly IFilesMetadataManager $filesMetadataManager,
		private readonly MediaPlaceManager $mediaPlaceManager,
	) {
	}

	#[\Override]
	public function initialize(Server $server): void {
		$this->server = $server;

		// Properties without a deserializer are flattened into a string, which
		// cannot carry the coordinates, and are passed on unvalidated.
		$server->xml->elementMap[self::GPS_PROPERTYNAME] = self::deserializeCoordinates(...);
		$server->xml->elementMap[self::ORIGINAL_DATE_TIME_PROPERTYNAME] = self::deserializeTimestamp(...);

		// The metadata handling of the DAV app runs at the default priority and
		// only sees the properties which are still unhandled by then.
		$server->on('propPatch', $this->handleUpdateProperties(...), 90);
	}

	public function handleUpdateProperties(string $path, PropPatch $propPatch): void {
		$node = $this->server?->tree->getNodeForPath($path);
		if (!($node instanceof File)) {
			return;
		}

		$propPatch->handle(
			[self::GPS_PROPERTYNAME, self::ORIGINAL_DATE_TIME_PROPERTYNAME],
			fn (array $properties): bool => $this->updateMetadata($node, $properties),
		);
	}

	/**
	 * @param array<string, mixed> $properties Requested properties, by name
	 * @throws Forbidden
	 */
	private function updateMetadata(File $node, array $properties): bool {
		if (!$node->getFileInfo()->isUpdateable()) {
			throw new Forbidden('You are not allowed to edit the metadata of this photo');
		}

		$fileId = $node->getId();
		if ($fileId === null) {
			return false;
		}

		$metadata = $this->filesMetadataManager->getMetadata($fileId, true);

		if (array_key_exists(self::ORIGINAL_DATE_TIME_PROPERTYNAME, $properties)) {
			$takenAt = $properties[self::ORIGINAL_DATE_TIME_PROPERTYNAME];
			if ($takenAt === null) {
				$metadata->unset(OriginalDateTimeMetadataProvider::METADATA_KEY);
			} else {
				$metadata->setInt(OriginalDateTimeMetadataProvider::METADATA_KEY, $takenAt, true);
			}
		}

		if (array_key_exists(self::GPS_PROPERTYNAME, $properties)) {
			$coordinates = $properties[self::GPS_PROPERTYNAME];
			if ($coordinates === null || $coordinates === []) {
				$metadata->unset(ExifMetadataProvider::METADATA_KEY_GPS);
			} else {
				$metadata->setArray(ExifMetadataProvider::METADATA_KEY_GPS, $coordinates);
			}

			// The place is derived from the coordinates, keeping the previous
			// one would leave the photo in the wrong place collection.
			$place = $this->mediaPlaceManager->getPlaceForMetadata($metadata);
			if ($place === null) {
				$metadata->unset(PlaceMetadataProvider::METADATA_KEY);
			} else {
				$metadata->setString(PlaceMetadataProvider::METADATA_KEY, $place, true);
			}
		}

		$this->filesMetadataManager->saveMetadata($metadata);

		return true;
	}

	/**
	 * @return array{latitude: float, longitude: float}|array{}
	 * @throws BadRequest
	 */
	private static function deserializeCoordinates(Reader $reader): array {
		$coordinates = [];

		// PROPFIND writes the coordinates in no namespace, so clients sending
		// back what they read are accepted as well as namespaced children.
		foreach (keyValue($reader) as $name => $coordinate) {
			$coordinates[preg_replace('/^{[^}]*}/', '', $name)] = $coordinate;
		}

		// A removal carries no coordinates, its value is dropped by Sabre.
		if ($coordinates === []) {
			return [];
		}

		return [
			'latitude' => self::parseCoordinate($coordinates['latitude'] ?? null, self::COORDINATE_LIMITS['latitude']),
			'longitude' => self::parseCoordinate($coordinates['longitude'] ?? null, self::COORDINATE_LIMITS['longitude']),
		];
	}

	/**
	 * The altitude is not part of the accepted coordinates: it is not editable,
	 * and keeping the one of the previous position would be misleading.
	 *
	 * @param float $limit Absolute maximum of the coordinate, in degrees
	 * @throws BadRequest
	 */
	private static function parseCoordinate(mixed $rawValue, float $limit): float {
		if (!is_string($rawValue) || !is_numeric($rawValue)) {
			throw new BadRequest('Coordinates must be given as decimal degrees');
		}

		$coordinate = (float)$rawValue;
		if (abs($coordinate) > $limit) {
			throw new BadRequest('Coordinate out of range');
		}

		return $coordinate;
	}

	/**
	 * @return ?int The taken date as a unix timestamp, NULL to fall back on the
	 *              date extracted from the picture
	 * @throws BadRequest
	 */
	private static function deserializeTimestamp(Reader $reader): ?int {
		$value = $reader->parseInnerTree();
		if ($value === null || $value === '') {
			return null;
		}

		$timestamp = is_string($value) ? filter_var($value, FILTER_VALIDATE_INT) : false;
		if ($timestamp === false) {
			throw new BadRequest('The taken date must be a unix timestamp');
		}

		return $timestamp;
	}
}
