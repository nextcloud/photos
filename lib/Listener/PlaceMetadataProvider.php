<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Service\MediaPlaceManager;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\File;
use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
use OCP\FilesMetadata\Event\MetadataLiveEvent;

/**
 * @template-implements IEventListener<Event|MetadataLiveEvent|MetadataBackgroundEvent>
 */
class PlaceMetadataProvider implements IEventListener {

	public const METADATA_KEY = 'photos-place';

	public function __construct(
		private readonly MediaPlaceManager $mediaPlaceManager,
	) {
	}

	public function handle(Event $event): void {
		if ($event instanceof MetadataLiveEvent) {
			$node = $event->getNode();

			if (!$node instanceof File) {
				return;
			}

			if (!in_array($node->getMimeType(), Application::IMAGE_MIMES)) {
				return;
			}

			$event->requestBackgroundJob();
		}

		if ($event instanceof MetadataBackgroundEvent) {
			$metadata = $event->getMetadata();
			$place = $this->mediaPlaceManager->getPlaceForMetadata($metadata);
			if ($place !== null) {
				$metadata->setString(self::METADATA_KEY, $place, true);
			}
		}
	}
}
