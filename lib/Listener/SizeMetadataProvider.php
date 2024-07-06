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
class SizeMetadataProvider implements IEventListener {
	public function __construct(
		private LoggerInterface $logger
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

		// We need the file content to extract the size.
		// This can be slow for remote storage, so we do it in a background job.
		if (!$node->getStorage()->isLocal() && $event instanceof MetadataLiveEvent) {
			$event->requestBackgroundJob();
			return;
		}

		if (!in_array($node->getMimeType(), Application::IMAGE_MIMES)) {
			return;
		}

		$size = @getimagesizefromstring($node->getContent());

		if ($size === false) {
			$this->logger->debug('SizeMetadataProvider->handle(): Corrupt image data detected ' . $node->getPath());
			return;
		}

		// The image might have a rotation stored in the EXIF data.
		// If that is the case and the rotation is 90/270 degrees the width and height need to be swapped.
		// This is necessary because the clients will take the rotation into account when displaying the image.
		if ($event->getMetadata()->hasKey('photos-ifd0')) {
			$ifd0 = $event->getMetadata()->getArray('photos-ifd0');
			if (array_key_exists('Orientation', $ifd0)) {
				/** @var int $orientation */
				$orientation = $ifd0['Orientation'];

				// https://exiftool.org/TagNames/EXIF.html
				if ($orientation >= 5) {
					$size = [$size[1], $size[0]];
				}
			}
		}

		$event->getMetadata()->setArray('photos-size', [
			'width' => $size[0],
			'height' => $size[1],
		]);
	}
}
