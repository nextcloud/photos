<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Jobs;

use OCA\Photos\Service\CaptionService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\QueuedJob;

/**
 * Requests the description of a photo once the hourly limit leaves room for it.
 */
class GenerateCaptionJob extends QueuedJob {
	public function __construct(
		ITimeFactory $time,
		private readonly CaptionService $captionService,
	) {
		parent::__construct($time);
	}

	/**
	 * @param array{userId: string, fileId: int} $argument
	 */
	#[\Override]
	protected function run($argument): void {
		$this->captionService->scheduleById($argument['userId'], $argument['fileId']);
	}
}
