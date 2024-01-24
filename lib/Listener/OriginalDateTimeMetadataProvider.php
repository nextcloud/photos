<?php

declare(strict_types=1);
/**
 * @copyright Copyright 2022 Carl Schwan <carl@carlschwan.eu>
 * @copyright Copyright 2022 Louis Chmn <louis@chmn.me>
 * @license AGPL-3.0-or-later
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program. If not, see <http://www.gnu.org/licenses/>
 *
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
 * @template-implements IEventListener<MetadataLiveEvent>
 */
class OriginalDateTimeMetadataProvider implements IEventListener {
	public function __construct(
		private LoggerInterface $logger,
	) {
	}

	public array $regexpToDateFormatMap = [
		"/^IMG_([0-9]{8}_[0-9]{6})/" => "Ymd_Gis",
		"/^PANO_([0-9]{8}_[0-9]{6})/" => "Ymd_Gis",
		"/^PXL_([0-9]{8}_[0-9]{6})/" => "Ymd_Gis",
		"/^([0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{4})/" => "Y-m-d-G-i-s",
	];

	private function dateToTimestamp(string $format, string $date, File $node): int|false {
		try {
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
		if ($metadata->hasKey('photos-exif') && !empty($metadata->getArray('photos-exif')['DateTimeOriginal'])) {
			$rawDateTimeOriginal = $metadata->getArray('photos-exif')['DateTimeOriginal'];
			$timestampOriginal = $this->dateToTimestamp("Y:m:d G:i:s", $rawDateTimeOriginal, $node);
			if ($timestampOriginal !== false) {
				$metadata->setInt('photos-original_date_time', $timestampOriginal, true);
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
				$metadata->setInt('photos-original_date_time', $timestampOriginal, true);
				return;
			}
		}

		// Fallback to the mtime.
		$metadata->setInt('photos-original_date_time', $node->getMTime(), true);
	}
}
