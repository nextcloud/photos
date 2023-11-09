<?php

declare(strict_types=1);
/**
 * @copyright Copyright 2023 Louis Chmn <louis@chmn.me>
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
	public function __construct(
		private MediaPlaceManager $mediaPlaceManager
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
			$place = $this->mediaPlaceManager->getPlaceForFile($event->getNode()->getId());
			if ($place !== null) {
				$metadata->setString('photos-place', $place, true);
			}
		}
	}
}
