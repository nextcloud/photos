<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use OCA\Photos\Service\VideoRenditionService;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Events\Node\NodeDeletedEvent;
use OCP\Files\File;
use Psr\Log\LoggerInterface;

/**
 * Deletes the playback renditions of a video along with it.
 *
 * @template-implements IEventListener<NodeDeletedEvent>
 */
class VideoRenditionCleanupListener implements IEventListener {
	public function __construct(
		private readonly VideoRenditionService $renditionService,
		private readonly LoggerInterface $logger,
	) {
	}

	#[\Override]
	public function handle(Event $event): void {
		if (!($event instanceof NodeDeletedEvent)) {
			return;
		}

		$node = $event->getNode();
		try {
			if ($node instanceof File && str_starts_with($node->getMimetype(), 'video/')) {
				$this->renditionService->deleteRenditions($node->getId());
			}
		} catch (\Throwable $e) {
			// The deletion of the file itself must not fail over its rendition.
			$this->logger->warning('Could not delete the playback rendition of a video', ['exception' => $e]);
		}
	}
}
