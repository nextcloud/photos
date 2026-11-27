<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\DemoLibrary;

/**
 * Minimal EXIF writer: capture date, GPS position and camera name of a JPEG.
 */
class ExifWriter {
	private const TYPE_BYTE = 1;
	private const TYPE_ASCII = 2;
	private const TYPE_LONG = 4;
	private const TYPE_RATIONAL = 5;

	/** Offset of the first IFD, right behind the TIFF header. */
	private const IFD0_OFFSET = 8;

	/**
	 * Returns the JPEG with an EXIF segment added. The segment goes behind the
	 * JFIF header when there is one, as JFIF requires that to come first.
	 *
	 * @param string $dateTime local capture time, formatted `Y:m:d H:i:s`
	 */
	public static function addTo(string $jpeg, string $dateTime, float $latitude, float $longitude, string $make, string $model): string {
		if (!str_starts_with($jpeg, "\xFF\xD8")) {
			throw new \InvalidArgumentException('Not a JPEG');
		}

		$position = 2;
		if (substr($jpeg, 2, 2) === "\xFF\xE0") {
			$position += 2 + unpack('n', $jpeg, 4)[1];
		}

		$payload = "Exif\0\0" . self::tiff($dateTime, $latitude, $longitude, $make, $model);
		$segment = "\xFF\xE1" . pack('n', strlen($payload) + 2) . $payload;

		return substr($jpeg, 0, $position) . $segment . substr($jpeg, $position);
	}

	private static function tiff(string $dateTime, float $latitude, float $longitude, string $make, string $model): string {
		$ifd0 = static fn (int $exifOffset, int $gpsOffset): string => self::ifd([
			[0x010F, self::TYPE_ASCII, $make . "\0"],
			[0x0110, self::TYPE_ASCII, $model . "\0"],
			[0x8769, self::TYPE_LONG, pack('V', $exifOffset)],
			[0x8825, self::TYPE_LONG, pack('V', $gpsOffset)],
		], self::IFD0_OFFSET);

		// The length of an IFD does not depend on the offsets it stores
		$exifOffset = self::IFD0_OFFSET + strlen($ifd0(0, 0));
		$exif = self::ifd([
			[0x9003, self::TYPE_ASCII, $dateTime . "\0"],
		], $exifOffset);

		$gpsOffset = $exifOffset + strlen($exif);
		$gps = self::ifd([
			[0x0000, self::TYPE_BYTE, "\x02\x03\x00\x00"],
			[0x0001, self::TYPE_ASCII, ($latitude < 0 ? 'S' : 'N') . "\0"],
			[0x0002, self::TYPE_RATIONAL, self::degrees($latitude)],
			[0x0003, self::TYPE_ASCII, ($longitude < 0 ? 'W' : 'E') . "\0"],
			[0x0004, self::TYPE_RATIONAL, self::degrees($longitude)],
		], $gpsOffset);

		// Little-endian TIFF header
		return "II*\0" . pack('V', self::IFD0_OFFSET) . $ifd0($exifOffset, $gpsOffset) . $exif . $gps;
	}

	/**
	 * Serialises an IFD followed by the values that do not fit into its entries.
	 *
	 * @param list<array{int, int, string}> $entries tag, type and packed value, ordered by tag
	 * @param int $offset position of the IFD within the TIFF data
	 */
	private static function ifd(array $entries, int $offset): string {
		$directory = pack('v', count($entries));
		$values = '';
		$valuesOffset = $offset + 2 + 12 * count($entries) + 4;

		foreach ($entries as [$tag, $type, $value]) {
			$count = match ($type) {
				self::TYPE_LONG => intdiv(strlen($value), 4),
				self::TYPE_RATIONAL => intdiv(strlen($value), 8),
				default => strlen($value),
			};
			$directory .= pack('vvV', $tag, $type, $count);

			if (strlen($value) <= 4) {
				$directory .= str_pad($value, 4, "\0");
				continue;
			}

			$directory .= pack('V', $valuesOffset + strlen($values));
			// Values start on a word boundary
			$values .= $value . (strlen($value) % 2 === 1 ? "\0" : '');
		}

		// No further IFD follows
		return $directory . pack('V', 0) . $values;
	}

	/**
	 * Packs a coordinate as the three rationals degrees, minutes and seconds.
	 */
	private static function degrees(float $coordinate): string {
		$hundredths = (int)round(abs($coordinate) * 3600 * 100);

		return pack(
			'V6',
			intdiv($hundredths, 360000),
			1,
			intdiv($hundredths, 6000) % 60,
			1,
			$hundredths % 6000,
			100,
		);
	}
}
