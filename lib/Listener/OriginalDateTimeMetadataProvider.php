<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use DateTime;
use OCA\Photos\AppInfo\Application;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\File;
use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use Psr\Log\LoggerInterface;

/**
 * @template-implements IEventListener<MetadataLiveEvent|MetadataBackgroundEvent>
 */
class OriginalDateTimeMetadataProvider implements IEventListener {

	public const METADATA_KEY = 'photos-original_date_time';

	public function __construct(
		private readonly LoggerInterface $logger,
	) {
	}

	public array $regexpToDateFormatMap = [
		'/^[A-Z]{3,4}_([0-9]{8}_[0-9]{6})/' => 'Ymd_Gis', // Covers prefixes like "IMG_", "PANO_", "PXL_" and others
		'/^([0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}).+/' => 'Y-m-d-G-i-s',
	];

	private function dateToTimestamp(string $format, string $date, File $node): int|false {
		try {
			// Note: We do not have the timezone when parsing the date, so the timestamp will be off by X hours.
			$dateTime = DateTime::createFromFormat($format, $date);
			if ($dateTime !== false) {
				return $dateTime->getTimestamp();
			}
			return false;
		} catch (\Throwable $t) {
			/* Date comes from user data and may trigger ValueError or DateRangeError */
			$this->logger->warning(
				'Failed to parse date {date} for file {path}',
				[
					'date' => $date,
					'path' => $node->getPath(),
					'exception' => $t,
				]
			);
			return false;
		}
	}

	public function handle(Event $event): void {
		if (!($event instanceof MetadataLiveEvent) && !($event instanceof MetadataBackgroundEvent)) {
			return;
		}

		$node = $event->getNode();

		if (!$node instanceof File) {
			return;
		}

		// We need the file content to extract the EXIF data.
		// This can be slow for remote storage, so we do it in a background job.
		if (!$node->getStorage()->isLocal() && $event instanceof MetadataLiveEvent) {
			$event->requestBackgroundJob();
			return;
		}

		if (!in_array($node->getMimeType(), Application::IMAGE_MIMES) && !in_array($node->getMimeType(), Application::VIDEO_MIMES)) {
			return;
		}

		$metadata = $event->getMetadata();

		// Try to use EXIF data.
		if (
			$metadata->hasKey(ExifMetadataProvider::METADATA_KEY_EXIF)
			&& !empty($metadata->getArray(ExifMetadataProvider::METADATA_KEY_EXIF)['DateTimeOriginal'])
		) {
			$rawDateTimeOriginal = $metadata->getArray(ExifMetadataProvider::METADATA_KEY_EXIF)['DateTimeOriginal'];
			$timestampOriginal = $this->dateToTimestamp('Y:m:d G:i:s', $rawDateTimeOriginal, $node);
			if ($timestampOriginal !== false) {
				$metadata->setInt(self::METADATA_KEY, $timestampOriginal, true);
				return;
			}
		}

		// Try to parse the date out of the name.
		$name = $node->getName();
		$matches = [];

		foreach ($this->regexpToDateFormatMap as $regexp => $format) {
			$matchesCount = preg_match($regexp, $name, $matches);
			if ($matchesCount === 0) {
				continue;
			}

			$timestampOriginal = $this->dateToTimestamp($format, $matches[1], $node);
			if ($timestampOriginal !== false) {
				$metadata->setInt(self::METADATA_KEY, $timestampOriginal, true);
				return;
			}
		}

		// Fallback to the mtime.
		$metadata->setInt(self::METADATA_KEY, $node->getMTime(), true);
	}
}
