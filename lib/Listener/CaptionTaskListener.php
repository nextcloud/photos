<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use OCA\Photos\Service\CaptionService;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\TaskProcessing\Events\TaskSuccessfulEvent;

/**
 * @template-implements IEventListener<Event|TaskSuccessfulEvent>
 */
class CaptionTaskListener implements IEventListener {
	public function __construct(
		private readonly CaptionService $captionService,
	) {
	}

	#[\Override]
	public function handle(Event $event): void {
		if ($event instanceof TaskSuccessfulEvent) {
			$this->captionService->saveCaption($event->getTask());
		}
	}
}
