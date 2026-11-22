<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Service\CaptionService;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\File;
use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
use OCP\FilesMetadata\Event\MetadataLiveEvent;

/**
 * Requests a description for photos which have none yet. The description is
 * stored once the task processing provider is done, see CaptionTaskListener.
 *
 * @template-implements IEventListener<Event|MetadataLiveEvent|MetadataBackgroundEvent>
 */
class CaptionMetadataProvider implements IEventListener {
	public const string METADATA_KEY = 'photos-caption';

	public function __construct(
		private readonly CaptionService $captionService,
	) {
	}

	#[\Override]
	public function handle(Event $event): void {
		if (!$event instanceof MetadataLiveEvent && !$event instanceof MetadataBackgroundEvent) {
			return;
		}

		$node = $event->getNode();
		if (!$node instanceof File || !in_array($node->getMimeType(), Application::IMAGE_MIMES, true)) {
			return;
		}

		if ($event instanceof MetadataLiveEvent) {
			if ($this->captionService->isEnabled()) {
				$event->requestBackgroundJob();
			}
			return;
		}

		if (!$event->getMetadata()->hasKey(self::METADATA_KEY) && $this->captionService->isAvailable()) {
			$this->captionService->queue($node);
		}
	}
}
