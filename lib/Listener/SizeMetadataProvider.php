<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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

		$size = getimagesizefromstring($node->getContent());

		if ($size === false) {
			return;
		}

		$event->getMetadata()->setArray('photos-size', [
			'width' => $size[0],
			'height' => $size[1],
		]);
	}
}
