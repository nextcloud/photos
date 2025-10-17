<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use Nelexa\Buffer\Buffer;
use Nelexa\Buffer\ResourceBuffer;
use OCA\Photos\AppInfo\Application;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\File;
use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use Psr\Log\LoggerInterface;
use WoltLab\WebpExif\Chunk\Chunk;
use WoltLab\WebpExif\Decoder;
use WoltLab\WebpExif\Exception\FileSizeMismatch;
use WoltLab\WebpExif\Exception\NotEnoughData;
use WoltLab\WebpExif\Exception\UnrecognizedFileFormat;

/**
 * Extract EXIF, IFD0, and GPS data from a picture file.
 * EXIF data reference: https://web.archive.org/web/20220428165430/exif.org/Exif2-2.PDF
 *
 * @template-implements IEventListener<MetadataLiveEvent|MetadataBackgroundEvent>
 */
class ExifMetadataProvider implements IEventListener {

	public const METADATA_KEY_EXIF = 'photos-exif';
	public const METADATA_KEY_IFD0 = 'photos-ifd0';
	public const METADATA_KEY_GPS = 'photos-gps';

	public function __construct(
		private readonly LoggerInterface $logger,
	) {
	}

	public function handle(Event $event): void {
		if (!($event instanceof MetadataLiveEvent) && !($event instanceof MetadataBackgroundEvent)) {
			return;
		}

		$node = $event->getNode();

		if (!$node instanceof File || $node->getSize() === 0) {
			return;
		}

		// We need the file content to extract the EXIF data.
		// This can be slow for remote storage, so we do it in a background job.
		if (!$node->getStorage()->isLocal() && $event instanceof MetadataLiveEvent) {
			$event->requestBackgroundJob();
			return;
		}

		if (!in_array($node->getMimeType(), Application::IMAGE_MIMES)) {
			return;
		}

		if (!extension_loaded('exif')) {
			return;
		}

		$fileDescriptor = $node->fopen('rb');
		if ($fileDescriptor === false) {
			return;
		}

		$rawExifData = null;

		try {
			// HACK: The stream_set_chunk_size call is needed to make reading exif data reliable.
			// This is to trigger this condition: https://github.com/php/php-src/blob/d64aa6f646a7b5e58359dc79479860164239580a/main/streams/streams.c#L710
			// But I don't understand yet why 1 as a special meaning.
			$oldBufferSize = stream_set_chunk_size($fileDescriptor, 1);
			if ($node->getMimeType() == 'image/webp') {
				$rawExifData = $this->getExifFromWebP($fileDescriptor);
			} else {
				$rawExifData = @exif_read_data($fileDescriptor, 'EXIF, GPS', true);
			}

			// We then revert the change after having read the exif data.
			stream_set_chunk_size($fileDescriptor, $oldBufferSize);
		} catch (\Exception $ex) {
			$this->logger->info('Failed to extract metadata for ' . $node->getId(), ['exception' => $ex]);
		}

		if ($rawExifData && array_key_exists('EXIF', $rawExifData)) {
			$event->getMetadata()->setArray(self::METADATA_KEY_EXIF, $this->sanitizeEntries($rawExifData['EXIF'], $node));
		}

		if ($rawExifData && array_key_exists('IFD0', $rawExifData)) {
			$event->getMetadata()->setArray(self::METADATA_KEY_IFD0, $this->sanitizeEntries($rawExifData['IFD0'], $node));
		}

		if (
			$rawExifData
			&& array_key_exists('GPS', $rawExifData)
		) {
			$gps = [];

			if (
				array_key_exists('GPSLatitude', $rawExifData['GPS']) && array_key_exists('GPSLatitudeRef', $rawExifData['GPS'])
				&& array_key_exists('GPSLongitude', $rawExifData['GPS']) && array_key_exists('GPSLongitudeRef', $rawExifData['GPS'])
			) {
				$gps['latitude'] = $this->gpsDegreesToDecimal($rawExifData['GPS']['GPSLatitude'], $rawExifData['GPS']['GPSLatitudeRef']);
				$gps['longitude'] = $this->gpsDegreesToDecimal($rawExifData['GPS']['GPSLongitude'], $rawExifData['GPS']['GPSLongitudeRef']);
			}

			if (array_key_exists('GPSAltitude', $rawExifData['GPS']) && array_key_exists('GPSAltitudeRef', $rawExifData['GPS']) && is_string($rawExifData['GPS']['GPSAltitude'])) {
				$gps['altitude'] = ($rawExifData['GPS']['GPSAltitudeRef'] === '1' || $rawExifData['GPS']['GPSAltitudeRef'] === "\u{0001}" ? -1 : 1) * $this->parseGPSData($rawExifData['GPS']['GPSAltitude']);
			}

			if (!empty($gps)) {
				$event->getMetadata()->setArray(self::METADATA_KEY_GPS, $gps);
			}
		}
	}

	/**
	 * Decodes a WebP image from binary data.
	 * @author      Alexander Ebert
	 * @copyright   2025 WoltLab GmbH
	 * @license     The MIT License <https://opensource.org/license/mit>
	 *
	 * @param $fileDescriptor
	 * @return array|false|null
	 * @throws \Nelexa\Buffer\BufferException
	 *
	 * @psalm-suppress InternalClass
	 * @psalm-suppress InternalMethod
	 */
	private function getExifFromWebP($fileDescriptor): array|false|null {
		// override the close() function in  order to prevent the file being closed when the buffer object is destructed
		$buffer = new class($fileDescriptor) extends ResourceBuffer {
			public function close() {

			}
		};

		$buffer->setOrder(Buffer::LITTLE_ENDIAN);
		$buffer->setReadOnly(true);

		// A RIFF container at its minimum contains the "RIFF" header, a
		// uint32LE representing the chunk size, the "WEBP" type and the data
		// section. The data section of a WebP at minimum contains one chunk
		// (header + uint32LE + data).
		//
		// The shortest possible WebP image is a simple VP8L container that
		// contains only the magic byte, a uint32 for the flags and dimensions,
		// and at last a single byte of data. This takes up 26 bytes in total.
		$expectedMinimumFileSize = 26;
		if ($buffer->size() < $expectedMinimumFileSize) {
			throw new NotEnoughData($expectedMinimumFileSize, $buffer->size());
		}

		$riff = $buffer->getString(4);
		$length = $buffer->getUnsignedInt();
		$format = $buffer->getString(4);
		if ($riff !== 'RIFF' || $format !== 'WEBP') {
			throw new UnrecognizedFileFormat();
		}

		// The length in the header does not include "RIFF" and the length
		// itself. It must therefore be exactly 8 bytes shorter than the total
		// size.
		$actualLength = $buffer->size() - 8;
		if ($length !== $actualLength) {
			throw new FileSizeMismatch($length, $actualLength);
		}

		$decoder = new Decoder();
		$chunk = null;
		do {
			$chunk = $decoder->decodeChunk($buffer);
		} while ($buffer->hasRemaining() && !($chunk instanceof \WoltLab\WebpExif\Chunk\Exif));

		if ($chunk instanceof \WoltLab\WebpExif\Chunk\Exif) {
			return $chunk->getParsedExif();
		} else {
			return false;
		}
	}

	/**
	 * @param array|string $coordinates
	 */
	private function gpsDegreesToDecimal($coordinates, ?string $hemisphere): float {
		if (is_string($coordinates)) {
			$coordinates = array_map('trim', explode(',', $coordinates));
		}

		if (count($coordinates) !== 3) {
			throw new \Exception('Invalid coordinate format: ' . json_encode($coordinates));
		}

		[$degrees, $minutes, $seconds] = array_map(fn ($rawDegree): float => $this->parseGPSData($rawDegree), $coordinates);

		$sign = ($hemisphere === 'W' || $hemisphere === 'S') ? -1 : 1;
		return $sign * ($degrees + $minutes / 60 + $seconds / 3600);
	}

	private function parseGPSData(string $rawData): float {
		$parts = explode('/', $rawData);

		if ($parts[1] === '0') {
			return 0;
		}

		return floatval($parts[0]) / floatval($parts[1] ?? 1);
	}

	/**
	 * Exif data can contain anything.
	 * This method will base 64 encode any non UTF-8 string in an array.
	 * This will also remove control characters from UTF-8 strings.
	 *
	 * @param array<string, string> $data
	 */
	private function sanitizeEntries(array $data, File $node): array {
		$cleanData = [];

		foreach ($data as $key => $value) {
			if (is_string($value) && !mb_check_encoding($value, 'UTF-8')) {
				$value = 'base64:' . base64_encode($value);
			} elseif (is_string($value)) {
				// TODO: Can be remove when the Sidebar use the @nextcloud/files to fetch and parse the DAV response.
				$value = preg_replace('/[[:cntrl:]]/u', '', $value);
			}

			if (preg_match('/[^a-zA-Z]/', $key) !== 0) {
				$key = preg_replace('/[^a-zA-Z]/', '_', $key);
			}

			// Arbitrary limit to filter out large EXIF entries.
			if (is_string($value) && strlen($value) > 1000) {
				$this->logger->info(
					'EXIF entry ignored as it is too large',
					[
						'key' => $key,
						'value' => $value,
						'fileId' => $node->getId(),
					]
				);
			} else {
				$cleanData[$key] = $value;
			}
		}

		return $cleanData;
	}
}
