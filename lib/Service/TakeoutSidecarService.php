<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

/**
 * Match media files exported by Google Takeout to their JSON sidecar files,
 * and read the capture date and position out of those sidecars.
 *
 * @psalm-type TakeoutCoordinates = array{latitude: float, longitude: float, altitude?: float}
 * @psalm-type TakeoutMetadata = array{takenAt: ?int, gps: ?TakeoutCoordinates}
 * @psalm-type TakeoutSidecarIndex = array<string, array<string, string>>
 */
class TakeoutSidecarService {
	/** Sidecars are small, anything bigger is not one. */
	public const MAX_SIDECAR_SIZE = 1024 * 1024;

	private const SIDECAR_EXTENSION = '.json';
	private const SUPPLEMENTAL_SUFFIX = 'supplemental-metadata';

	/**
	 * Takeout truncates sidecar names longer than about 46 characters, the
	 * exact limit has varied between exports.
	 */
	private const MIN_TRUNCATED_LENGTH = 40;

	/** Suffixes Google Photos appends to the name of edited copies, by language. */
	private const EDITED_SUFFIXES = [
		'-edited',
		'-effects',
		'-smile',
		'-mix',
		'-bearbeitet',
		'-bewerkt',
		'-modifié',
		'-modificato',
		'-ha editado',
		'-editat',
		'-edytowane',
		'-編集済み',
	];

	/** Still pictures whose sidecar also describes the video of a live photo. */
	private const LIVE_PHOTO_EXTENSIONS = ['HEIC', 'heic', 'JPG', 'jpg', 'JPEG', 'jpeg'];
	private const VIDEO_EXTENSIONS = ['mp4', 'mov'];

	/**
	 * @param string $mediaName Name of the media file
	 * @param TakeoutSidecarIndex $sidecars Sidecars of the folder of the media file, see indexSidecars()
	 * @return ?string Name of the sidecar of the media file, if there is one
	 */
	public function findSidecar(string $mediaName, array $sidecars): ?string {
		$describedNames = $this->getDescribedNames($mediaName);

		// Exact names first, a truncated name may be shared by several files.
		foreach ($describedNames as [$describedName, $copySuffix]) {
			if (isset($sidecars[$copySuffix][$describedName])) {
				return $sidecars[$copySuffix][$describedName];
			}
		}

		// Truncation may cut off the copy suffix of the name of a media file,
		// the one of the sidecar tells copies and originals apart.
		usort($describedNames, static fn (array $a, array $b): int => ($a[1] === '') <=> ($b[1] === ''));

		foreach ($describedNames as [$describedName, $copySuffix]) {
			$sidecar = $this->findShortenedSidecar($sidecars[$copySuffix] ?? [], $describedName);
			if ($sidecar !== null) {
				return $sidecar;
			}
		}

		return null;
	}

	/**
	 * Index the sidecars by the name of the file they describe, as far as it
	 * is left after truncation, and by their copy suffix such as "(1)".
	 *
	 * @param iterable<string> $names Names of the files in a folder
	 * @return TakeoutSidecarIndex Sidecar names, by copy suffix and described name
	 */
	public function indexSidecars(iterable $names): array {
		$sidecars = [];

		foreach ($names as $name) {
			if (!str_ends_with(strtolower($name), self::SIDECAR_EXTENSION)) {
				continue;
			}

			$describedName = substr($name, 0, -strlen(self::SIDECAR_EXTENSION));

			$copySuffix = '';
			if (preg_match('/^(.+)(\(\d+\))$/', $describedName, $matches) === 1) {
				[, $describedName, $copySuffix] = $matches;
			}

			// "IMG_1234.jpg.supplemental-metadata", possibly truncated down to "IMG_1234.jpg.s".
			$lastDot = strrpos($describedName, '.');
			if ($lastDot !== false) {
				$tail = substr($describedName, $lastDot + 1);
				if ($tail !== '' && str_starts_with(self::SUPPLEMENTAL_SUFFIX, $tail)) {
					$describedName = substr($describedName, 0, $lastDot);
				}
			}

			$sidecars[$copySuffix][$describedName] ??= $name;
		}

		return $sidecars;
	}

	/**
	 * List the names whose sidecar may describe the media file, most specific first.
	 *
	 * Copies get a suffix in the name of the media file ("IMG_1234(1).jpg") but
	 * after the extension in the name of the sidecar ("IMG_1234.jpg(1).json").
	 * Edited pictures and the videos of live photos share the sidecar of the
	 * original picture.
	 *
	 * @return list<array{string, string}> Pairs of described name and copy suffix
	 */
	private function getDescribedNames(string $mediaName): array {
		$candidates = [[$mediaName, '']];

		$extension = pathinfo($mediaName, PATHINFO_EXTENSION);
		$baseName = $extension === '' ? $mediaName : substr($mediaName, 0, -strlen($extension) - 1);
		$dotExtension = $extension === '' ? '' : '.' . $extension;

		$copySuffix = '';
		if (preg_match('/^(.+)(\(\d+\))$/', $baseName, $matches) === 1) {
			[, $baseName, $copySuffix] = $matches;
			$candidates[] = [$baseName . $dotExtension, $copySuffix];
		}

		foreach (self::EDITED_SUFFIXES as $editedSuffix) {
			if (str_ends_with($baseName, $editedSuffix)) {
				$baseName = substr($baseName, 0, -strlen($editedSuffix));
				$candidates[] = [$baseName . $dotExtension, $copySuffix];
				break;
			}
		}

		if (in_array(strtolower($extension), self::VIDEO_EXTENSIONS, true)) {
			foreach (self::LIVE_PHOTO_EXTENSIONS as $pictureExtension) {
				$candidates[] = [$baseName . '.' . $pictureExtension, $copySuffix];
			}
		}

		return $candidates;
	}

	/**
	 * @param array<string, string> $sidecars Sidecar names, by described name
	 */
	private function findShortenedSidecar(array $sidecars, string $describedName): ?string {
		for ($length = mb_strlen($describedName) - 1; $length >= self::MIN_TRUNCATED_LENGTH; $length--) {
			$truncatedName = mb_substr($describedName, 0, $length);
			if (isset($sidecars[$truncatedName])) {
				return $sidecars[$truncatedName];
			}
		}

		// Some exports leave the extension out: "IMG_1234.json".
		$nameWithoutExtension = pathinfo($describedName, PATHINFO_FILENAME);
		if ($nameWithoutExtension !== $describedName && isset($sidecars[$nameWithoutExtension])) {
			return $sidecars[$nameWithoutExtension];
		}

		return null;
	}

	/**
	 * @param string $content Content of a sidecar file
	 * @return ?TakeoutMetadata NULL when the sidecar holds neither a capture date nor a position
	 */
	public function parseSidecar(string $content): ?array {
		try {
			$data = json_decode($content, true, 16, JSON_THROW_ON_ERROR);
		} catch (\JsonException) {
			return null;
		}

		if (!is_array($data)) {
			return null;
		}

		$takenAt = $this->parseTimestamp($data['photoTakenTime']['timestamp'] ?? null);
		$gps = $this->parseCoordinates($data['geoData'] ?? null)
			?? $this->parseCoordinates($data['geoDataExif'] ?? null);

		if ($takenAt === null && $gps === null) {
			return null;
		}

		return [
			'takenAt' => $takenAt,
			'gps' => $gps,
		];
	}

	private function parseTimestamp(mixed $rawTimestamp): ?int {
		if (!is_string($rawTimestamp) && !is_int($rawTimestamp)) {
			return null;
		}

		$timestamp = filter_var($rawTimestamp, FILTER_VALIDATE_INT);
		if ($timestamp === false || $timestamp <= 0) {
			return null;
		}

		return $timestamp;
	}

	/**
	 * Takeout writes 0.0 for both coordinates of media without a position.
	 *
	 * @return ?TakeoutCoordinates
	 */
	private function parseCoordinates(mixed $geoData): ?array {
		if (!is_array($geoData)) {
			return null;
		}

		$latitude = $geoData['latitude'] ?? null;
		$longitude = $geoData['longitude'] ?? null;
		if (!$this->isNumber($latitude) || !$this->isNumber($longitude)) {
			return null;
		}

		$latitude = (float)$latitude;
		$longitude = (float)$longitude;
		if (($latitude === 0.0 && $longitude === 0.0) || abs($latitude) > 90 || abs($longitude) > 180) {
			return null;
		}

		$coordinates = [
			'latitude' => $latitude,
			'longitude' => $longitude,
		];

		$altitude = $geoData['altitude'] ?? null;
		if ($this->isNumber($altitude) && (float)$altitude !== 0.0) {
			$coordinates['altitude'] = (float)$altitude;
		}

		return $coordinates;
	}

	/**
	 * @psalm-assert-if-true int|float $value
	 */
	private function isNumber(mixed $value): bool {
		return is_int($value) || is_float($value);
	}
}
