<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Xmp\XmpSidecarManager;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\File;
use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
use OCP\FilesMetadata\Event\MetadataLiveEvent;

/**
 * Let the taken date and the position stored in the XMP sidecar of a photo
 * take precedence over the ones embedded in the picture, as Lightroom and
 * darktable do.
 *
 * Runs after {@see ExifMetadataProvider} and before the providers deriving the
 * taken date and the place from its data.
 *
 * @template-implements IEventListener<MetadataLiveEvent|MetadataBackgroundEvent>
 */
class XmpSidecarMetadataProvider implements IEventListener {
	public function __construct(
		private readonly XmpSidecarManager $xmpSidecarManager,
	) {
	}

	#[\Override]
	public function handle(Event $event): void {
		if (!($event instanceof MetadataLiveEvent) && !($event instanceof MetadataBackgroundEvent)) {
			return;
		}

		$node = $event->getNode();
		if (!$node instanceof File) {
			return;
		}

		$isImage = in_array($node->getMimeType(), Application::IMAGE_MIMES, true);
		if (!$isImage && !in_array($node->getMimeType(), Application::VIDEO_MIMES, true)) {
			return;
		}

		// The metadata of pictures on remote storage is extracted in a
		// background job, the sidecar is read there as well.
		if ($isImage && !$node->getStorage()->isLocal() && $event instanceof MetadataLiveEvent) {
			$event->requestBackgroundJob();
			return;
		}

		$packet = $this->xmpSidecarManager->read($node);
		if ($packet === null) {
			return;
		}

		$metadata = $event->getMetadata();

		$coordinates = $packet->getCoordinates();
		if ($coordinates !== null) {
			$metadata->setArray(ExifMetadataProvider::METADATA_KEY_GPS, $coordinates);
		}

		$dateTime = $packet->getDateTimeOriginal();
		if ($dateTime !== null) {
			$exif = $metadata->hasKey(ExifMetadataProvider::METADATA_KEY_EXIF) ? $metadata->getArray(ExifMetadataProvider::METADATA_KEY_EXIF) : [];
			$exif['DateTimeOriginal'] = $dateTime->format('Y:m:d H:i:s');
			if ($packet->hasTimeZone()) {
				$exif['OffsetTimeOriginal'] = $dateTime->format('P');
			} else {
				unset($exif['OffsetTimeOriginal']);
			}
			$metadata->setArray(ExifMetadataProvider::METADATA_KEY_EXIF, $exif);
		}
	}
}
