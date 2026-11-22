<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

/**
 * Extracts the raw TIFF-formatted EXIF block from HEIF-based images (HEIC, AVIF).
 *
 * The EXIF data is stored as an item of type "Exif" in the ISOBMFF "meta" box:
 * "iinf" maps the item type to an item ID and "iloc" gives its location.
 * Reference: ISO/IEC 14496-12 and ISO/IEC 23008-12 (Annex A.2.1).
 */
final class HeifExifReader {
	private const MAX_TOP_LEVEL_BOXES = 16;
	private const MAX_META_SIZE = 4 * 1024 * 1024;
	private const MAX_EXIF_SIZE = 1024 * 1024;

	/**
	 * @param resource $stream A seekable stream of the image file
	 * @return string|null The TIFF data (starting with "II*\0" or "MM\0*"), or null if none was found
	 */
	public static function readTiff($stream): ?string {
		try {
			return self::findTiff($stream);
		} catch (\UnexpectedValueException) {
			return null;
		}
	}

	/**
	 * @param resource $stream
	 */
	private static function findTiff($stream): ?string {
		if (fseek($stream, 0) !== 0) {
			return null;
		}

		for ($i = 0; $i < self::MAX_TOP_LEVEL_BOXES; $i++) {
			$header = self::readExactly($stream, 8);
			$size = self::uint($header, 0, 4);
			$type = substr($header, 4, 4);
			$headerSize = 8;

			if ($size === 1) {
				$size = self::uint(self::readExactly($stream, 8), 0, 8);
				$headerSize = 16;
			}

			if ($i === 0 && $type !== 'ftyp') {
				return null;
			}

			// A size of 0 means the box extends to the end of the file, so no further box follows.
			if ($size === 0) {
				return null;
			}

			if ($size < $headerSize) {
				throw new \UnexpectedValueException('Invalid box size');
			}

			$payloadSize = $size - $headerSize;

			if ($type === 'meta') {
				if ($payloadSize > self::MAX_META_SIZE) {
					return null;
				}

				return self::readFromMeta($stream, self::readExactly($stream, $payloadSize));
			}

			if (fseek($stream, $payloadSize, SEEK_CUR) !== 0) {
				return null;
			}
		}

		return null;
	}

	/**
	 * @param resource $stream
	 */
	private static function readFromMeta($stream, string $meta): ?string {
		// "meta" is a full box: skip version and flags.
		$children = self::boxes($meta, 4, strlen($meta));

		$exifItemId = isset($children['iinf']) ? self::findExifItemId($meta, ...$children['iinf']) : null;
		if ($exifItemId === null || !isset($children['iloc'])) {
			return null;
		}

		$location = self::findItemLocation($meta, $exifItemId, ...$children['iloc']);
		if ($location === null) {
			return null;
		}

		[$constructionMethod, $extents] = $location;
		$payload = '';
		foreach ($extents as [$offset, $length]) {
			if ($constructionMethod === 0) {
				if (fseek($stream, $offset) !== 0) {
					return null;
				}
				$payload .= self::readExactly($stream, $length);
			} else {
				if (!isset($children['idat'])) {
					return null;
				}
				[$idatStart, $idatEnd] = $children['idat'];
				if ($offset > $idatEnd - $idatStart - $length) {
					throw new \UnexpectedValueException('Extent outside of idat box');
				}
				$payload .= substr($meta, $idatStart + $offset, $length);
			}
		}

		// The payload starts with the offset from its fifth byte to the TIFF header,
		// usually skipping an "Exif\0\0" marker.
		$tiffStart = 4 + self::uint($payload, 0, 4);
		$magic = substr($payload, $tiffStart, 4);
		if ($magic !== "II*\0" && $magic !== "MM\0*") {
			return null;
		}

		return substr($payload, $tiffStart);
	}

	private static function findExifItemId(string $meta, int $start, int $end): ?int {
		$version = self::uint($meta, $start, 1, $end);
		$entriesStart = $start + 4 + ($version === 0 ? 2 : 4);

		foreach (self::boxList($meta, $entriesStart, $end) as [$type, $infeStart, $infeEnd]) {
			if ($type !== 'infe') {
				continue;
			}

			// Item types are only present in "infe" version 2 and later.
			$infeVersion = self::uint($meta, $infeStart, 1, $infeEnd);
			if ($infeVersion < 2) {
				continue;
			}

			$idSize = $infeVersion === 2 ? 2 : 4;
			$itemId = self::uint($meta, $infeStart + 4, $idSize, $infeEnd);
			// Skip the 2-byte item protection index.
			$typeStart = $infeStart + 4 + $idSize + 2;
			if ($typeStart + 4 > $infeEnd) {
				throw new \UnexpectedValueException('Truncated infe box');
			}

			if (substr($meta, $typeStart, 4) === 'Exif') {
				return $itemId;
			}
		}

		return null;
	}

	/**
	 * @return array{int, list<array{int, int}>}|null The construction method and the [offset, length] extents
	 */
	private static function findItemLocation(string $meta, int $itemId, int $start, int $end): ?array {
		$version = self::uint($meta, $start, 1, $end);
		if ($version > 2) {
			return null;
		}

		$sizes = self::uint($meta, $start + 4, 2, $end);
		$offsetSize = $sizes >> 12;
		$lengthSize = ($sizes >> 8) & 0xF;
		$baseOffsetSize = ($sizes >> 4) & 0xF;
		$indexSize = $version === 0 ? 0 : $sizes & 0xF;
		// Every extent must take up space so that the extent loop stays bounded by the box size.
		if ($lengthSize === 0) {
			return null;
		}

		$idSize = $version === 2 ? 4 : 2;
		$pos = $start + 6;
		$itemCount = self::uint($meta, $pos, $idSize, $end);
		$pos += $idSize;

		for ($i = 0; $i < $itemCount; $i++) {
			$currentId = self::uint($meta, $pos, $idSize, $end);
			$pos += $idSize;

			$constructionMethod = 0;
			if ($version > 0) {
				$constructionMethod = self::uint($meta, $pos, 2, $end) & 0xF;
				$pos += 2;
			}

			$dataReferenceIndex = self::uint($meta, $pos, 2, $end);
			$pos += 2;
			$baseOffset = self::uint($meta, $pos, $baseOffsetSize, $end);
			$pos += $baseOffsetSize;
			$extentCount = self::uint($meta, $pos, 2, $end);
			$pos += 2;

			$isExifItem = $currentId === $itemId;
			$extents = [];
			$totalLength = 0;
			for ($j = 0; $j < $extentCount; $j++) {
				$pos += $indexSize;
				$extentOffset = self::uint($meta, $pos, $offsetSize, $end);
				$pos += $offsetSize;
				$extentLength = self::uint($meta, $pos, $lengthSize, $end);
				$pos += $lengthSize;

				if (!$isExifItem) {
					continue;
				}

				// An extent length of 0 refers to the whole referenced file.
				$totalLength += $extentLength;
				if ($extentLength === 0 || $totalLength > self::MAX_EXIF_SIZE || $extentOffset > PHP_INT_MAX - $baseOffset) {
					return null;
				}
				$extents[] = [$baseOffset + $extentOffset, $extentLength];
			}

			if (!$isExifItem) {
				continue;
			}

			// Only data stored in this file or in the "idat" box is supported.
			if ($dataReferenceIndex !== 0 || $constructionMethod > 1 || $extents === []) {
				return null;
			}

			return [$constructionMethod, $extents];
		}

		return null;
	}

	/**
	 * Index the child boxes of a container by type, keeping the first box of each type.
	 *
	 * @return array<string, array{int, int}> Payload start and end offsets by box type
	 */
	private static function boxes(string $data, int $start, int $end): array {
		$boxes = [];
		foreach (self::boxList($data, $start, $end) as [$type, $payloadStart, $payloadEnd]) {
			$boxes[$type] ??= [$payloadStart, $payloadEnd];
		}
		return $boxes;
	}

	/**
	 * @return list<array{string, int, int}> Type, payload start and payload end of each child box
	 */
	private static function boxList(string $data, int $start, int $end): array {
		$boxes = [];
		$pos = $start;
		while ($pos + 8 <= $end) {
			$size = self::uint($data, $pos, 4, $end);
			$type = substr($data, $pos + 4, 4);
			$headerSize = 8;

			if ($size === 1) {
				$size = self::uint($data, $pos + 8, 8, $end);
				$headerSize = 16;
			} elseif ($size === 0) {
				$size = $end - $pos;
			}

			if ($size < $headerSize || $size > $end - $pos) {
				throw new \UnexpectedValueException('Invalid box size');
			}

			$boxes[] = [$type, $pos + $headerSize, $pos + $size];
			$pos += $size;
		}
		return $boxes;
	}

	/**
	 * Read a big-endian unsigned integer of 0, 1, 2, 4 or 8 bytes.
	 */
	private static function uint(string $data, int $pos, int $bytes, ?int $end = null): int {
		$end ??= strlen($data);
		if ($bytes === 0) {
			return 0;
		}

		if (!in_array($bytes, [1, 2, 4, 8], true) || $pos < 0 || $pos + $bytes > $end) {
			throw new \UnexpectedValueException('Out of bounds read');
		}

		$value = unpack(match ($bytes) {
			1 => 'C',
			2 => 'n',
			4 => 'N',
			8 => 'J',
		}, $data, $pos)[1];

		// 64-bit values above PHP_INT_MAX wrap around to negative numbers.
		if ($value < 0) {
			throw new \UnexpectedValueException('Value too large');
		}

		return $value;
	}

	/**
	 * @param resource $stream
	 */
	private static function readExactly($stream, int $length): string {
		$data = '';
		while (strlen($data) < $length) {
			$chunk = fread($stream, $length - strlen($data));
			if ($chunk === false || $chunk === '') {
				throw new \UnexpectedValueException('Unexpected end of file');
			}
			$data .= $chunk;
		}
		return $data;
	}
}
