<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Service;

use OCA\Photos\Service\HeifExifReader;
use Test\TestCase;

class HeifExifReaderTest extends TestCase {
	/**
	 * Build a minimal big-endian TIFF block with IFD0, EXIF and GPS IFDs.
	 */
	public static function buildTiff(): string {
		$rational = static fn (int ...$values): string => implode('', array_map(static fn (int $value): string => pack('NN', $value, 100), $values));

		$exifOffset = 8;
		$exif = self::buildIfd($exifOffset, [
			[0x9003, 2, "2025:06:01 12:34:56\0"],
		]);

		$gpsOffset = $exifOffset + strlen($exif);
		$gps = self::buildIfd($gpsOffset, [
			[0x0001, 2, "N\0"],
			[0x0002, 5, $rational(5200, 3000, 3600)],
			[0x0003, 2, "E\0"],
			[0x0004, 5, $rational(1300, 2400, 0)],
		]);

		$ifd0Offset = $gpsOffset + strlen($gps);
		$ifd0 = self::buildIfd($ifd0Offset, [
			[0x010F, 2, "Apple\0"],
			[0x0110, 2, "iPhone 15\0"],
			[0x8769, 4, pack('N', $exifOffset)],
			[0x8825, 4, pack('N', $gpsOffset)],
		]);

		return "MM\0*" . pack('N', $ifd0Offset) . $exif . $gps . $ifd0;
	}

	/**
	 * @param list<array{int, int, string}> $entries Tag, type and value bytes
	 */
	private static function buildIfd(int $offset, array $entries): string {
		$typeSizes = [2 => 1, 4 => 4, 5 => 8];
		$dataOffset = $offset + 2 + 12 * count($entries) + 4;
		$ifd = pack('n', count($entries));
		$data = '';
		foreach ($entries as [$tag, $type, $value]) {
			$ifd .= pack('nnN', $tag, $type, intdiv(strlen($value), $typeSizes[$type]));
			if (strlen($value) <= 4) {
				$ifd .= str_pad($value, 4, "\0");
			} else {
				$ifd .= pack('N', $dataOffset + strlen($data));
				$data .= $value;
			}
		}
		return $ifd . pack('N', 0) . $data;
	}

	private static function box(string $type, string $payload): string {
		return pack('N', 8 + strlen($payload)) . $type . $payload;
	}

	private static function fullBox(string $type, int $version, string $payload): string {
		return self::box($type, chr($version) . "\0\0\0" . $payload);
	}

	/**
	 * Build a HEIF file with an image item (ID 1) and an EXIF item (ID 2).
	 *
	 * @param int $ilocVersion 1 or 2
	 * @param bool $useIdat Store the EXIF item in the "idat" box instead of "mdat"
	 * @param int $extentCount Number of extents the EXIF payload is split into
	 */
	public static function buildHeif(
		string $brand = 'heic',
		?string $exifPayload = null,
		int $ilocVersion = 1,
		bool $useIdat = false,
		int $extentCount = 1,
	): string {
		$exifPayload ??= pack('N', 6) . "Exif\0\0" . self::buildTiff();
		$image = str_repeat("\x00", 16);

		$ftyp = self::box('ftyp', $brand . pack('N', 0) . 'mif1' . $brand);
		$iinf = self::fullBox('iinf', 0, pack('n', 2)
			. self::fullBox('infe', 2, pack('nn', 1, 0) . "hvc1\0")
			. self::fullBox('infe', 2, pack('nn', 2, 0) . "Exif\0"));

		$buildIloc = static function (int $mdatStart) use ($ilocVersion, $useIdat, $extentCount, $exifPayload, $image): string {
			$id = static fn (int $id): string => $ilocVersion === 2 ? pack('N', $id) : pack('n', $id);
			$chunks = str_split($exifPayload, (int)ceil(strlen($exifPayload) / $extentCount));

			$exifExtents = '';
			$offset = $useIdat ? 0 : $mdatStart + strlen($image);
			foreach ($chunks as $chunk) {
				$exifExtents .= pack('NN', $offset, strlen($chunk));
				$offset += strlen($chunk);
			}

			return self::fullBox('iloc', $ilocVersion, pack('n', 0x4400)
				. ($ilocVersion === 2 ? pack('N', 2) : pack('n', 2))
				. $id(1) . pack('nnn', 0, 0, 1) . pack('NN', $mdatStart, strlen($image))
				. $id(2) . pack('nnn', $useIdat ? 1 : 0, 0, count($chunks)) . $exifExtents);
		};

		$idat = $useIdat ? self::box('idat', $exifPayload) : '';
		$mdatPayload = $image . ($useIdat ? '' : $exifPayload);
		$metaSize = strlen(self::fullBox('meta', 0, $iinf . $buildIloc(0) . $idat));
		$mdatStart = strlen($ftyp) + $metaSize + 8;
		$meta = self::fullBox('meta', 0, $iinf . $buildIloc($mdatStart) . $idat);

		return $ftyp . $meta . self::box('mdat', $mdatPayload);
	}

	private function readTiff(string $data): ?string {
		$stream = fopen('php://memory', 'r+b');
		fwrite($stream, $data);
		rewind($stream);
		try {
			return HeifExifReader::readTiff($stream);
		} finally {
			fclose($stream);
		}
	}

	public static function dataValidFiles(): array {
		return [
			'heic, iloc v1' => ['heic', 1, false, 1],
			'avif, iloc v2' => ['avif', 2, false, 1],
			'idat construction method' => ['heic', 1, true, 1],
			'multiple extents' => ['heic', 1, false, 3],
		];
	}

	/**
	 * @dataProvider dataValidFiles
	 */
	public function testReadsExifItem(string $brand, int $ilocVersion, bool $useIdat, int $extentCount): void {
		$tiff = $this->readTiff(self::buildHeif($brand, null, $ilocVersion, $useIdat, $extentCount));

		$this->assertSame(self::buildTiff(), $tiff);

		$stream = fopen('php://memory', 'r+b');
		fwrite($stream, $tiff);
		rewind($stream);
		$exif = exif_read_data($stream, 'EXIF, GPS', true);
		fclose($stream);

		$this->assertSame('Apple', $exif['IFD0']['Make']);
		$this->assertSame('2025:06:01 12:34:56', $exif['EXIF']['DateTimeOriginal']);
		$this->assertSame('N', $exif['GPS']['GPSLatitudeRef']);
	}

	public function testReadsTiffWithoutExifMarker(): void {
		$tiff = $this->readTiff(self::buildHeif(exifPayload: pack('N', 0) . self::buildTiff()));

		$this->assertSame(self::buildTiff(), $tiff);
	}

	public function testReturnsNullForInvalidTiffOffset(): void {
		$this->assertNull($this->readTiff(self::buildHeif(exifPayload: pack('N', 1000) . self::buildTiff())));
		$this->assertNull($this->readTiff(self::buildHeif(exifPayload: pack('N', 2) . "Exif\0\0" . self::buildTiff())));
	}

	public function testReturnsNullForNonHeifFiles(): void {
		$this->assertNull($this->readTiff(''));
		$this->assertNull($this->readTiff("\xFF\xD8\xFF\xE1" . str_repeat("\0", 100)));
		$this->assertNull($this->readTiff(substr(self::buildHeif(), 8)));
	}

	public function testReturnsNullWithoutExifItem(): void {
		$file = str_replace(pack('nn', 2, 0) . 'Exif', pack('nn', 2, 0) . 'mime', self::buildHeif());

		$this->assertNull($this->readTiff($file));
	}

	public function testReturnsNullForOversizedExifItem(): void {
		$exifPayload = pack('N', 6) . "Exif\0\0" . self::buildTiff() . str_repeat("\0", 1024 * 1024);

		$this->assertNull($this->readTiff(self::buildHeif(exifPayload: $exifPayload)));
	}

	public function testHandlesTruncatedFiles(): void {
		$file = self::buildHeif();
		for ($length = 0; $length < strlen($file); $length++) {
			$tiff = $this->readTiff(substr($file, 0, $length));
			$this->assertNull($tiff, "Truncated at $length bytes");
		}
	}

	public function testHandlesCorruptedBytes(): void {
		$file = self::buildHeif();
		foreach (["\x00", "\x01", "\x7F", "\xFF"] as $byte) {
			for ($pos = 0; $pos < strlen($file); $pos++) {
				$corrupted = substr_replace($file, $byte, $pos, 1);
				$tiff = $this->readTiff($corrupted);
				$this->assertTrue($tiff === null || is_string($tiff));
			}
		}
	}
}
