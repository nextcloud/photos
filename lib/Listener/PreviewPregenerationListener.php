<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Jobs\PregeneratePreviewsJob;
use OCP\BackgroundJob\IJobList;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Events\Node\NodeWrittenEvent;
use OCP\Files\File;
use OCP\Files\Node;
use OCP\IAppConfig;
use OCP\IPreview;
use Override;
use Psr\Log\LoggerInterface;

/**
 * Queues the pregeneration of the timeline previews of photos and videos
 * written to the files of a user.
 *
 * @template-implements IEventListener<NodeWrittenEvent>
 */
class PreviewPregenerationListener implements IEventListener {
	public function __construct(
		private readonly IAppConfig $appConfig,
		private readonly IJobList $jobList,
		private readonly IPreview $preview,
		private readonly LoggerInterface $logger,
	) {
	}

	#[Override]
	public function handle(Event $event): void {
		if (!$event instanceof NodeWrittenEvent) {
			return;
		}

		// Runs within the upload request, which must not fail because of previews.
		try {
			$this->queue($event->getNode());
		} catch (\Throwable $e) {
			$this->logger->warning('Could not queue preview pregeneration', ['exception' => $e]);
		}
	}

	private function queue(Node $node): void {
		if (!$node instanceof File) {
			return;
		}

		if (!\in_array($node->getMimetype(), [...Application::IMAGE_MIMES, ...Application::VIDEO_MIMES], true)) {
			return;
		}

		// Paths of user files look like /<userId>/files/…
		[, $userId, $root] = explode('/', $node->getPath(), 4) + ['', '', ''];
		if ($userId === '' || $root !== 'files') {
			return;
		}

		if (!PregeneratePreviewsJob::isEnabled($this->appConfig) || !$this->preview->isAvailable($node)) {
			return;
		}

		$this->jobList->add(PregeneratePreviewsJob::class, ['userId' => $userId, 'fileId' => $node->getId()]);
	}
}
