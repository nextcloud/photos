<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Jobs;

use OCA\Photos\DB\PhotoTranscodeMapper;
use OCA\Photos\Service\PhotoTranscodeService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJob;
use OCP\BackgroundJob\TimedJob;
use Psr\Log\LoggerInterface;

/**
 * Pulls pending rows from `oc_photos_transcodes` and runs ffmpeg
 * over each one, with a wall-clock budget per tick so a long video
 * can't starve the rest of the cron schedule.
 *
 * State management is in PhotoTranscodeMapper — this job is the
 * "loop" layer. The mapper's `claimNextPending` is atomic so two
 * cron ticks running in parallel won't both transcode the same
 * file (whichever loses the race gets `null` and exits the loop).
 *
 * Stale-`transcoding` rows from a worker that died mid-run are
 * reaped by `releaseStaleTranscoding` on every tick, so a broken
 * cron setup eventually self-heals.
 */
class PhotoTranscodeJob extends TimedJob {
	private const WALL_BUDGET_SECONDS = 30 * 60;

	public function __construct(
		ITimeFactory $time,
		private readonly PhotoTranscodeMapper $mapper,
		private readonly PhotoTranscodeService $service,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct($time);
		$this->setTimeSensitivity(IJob::TIME_INSENSITIVE);
		// 5-minute interval so newly-uploaded videos pick up
		// quickly. Each tick can produce one or two transcodes
		// before the wall budget runs out — for a typical
		// instance this drains the queue overnight.
		$this->setInterval(5 * 60);
	}

	protected function run($argument): void {
		if (!$this->service->isEnabled()) {
			return;
		}

		$now = $this->time->getTime();
		$released = $this->mapper->releaseStaleTranscoding($now);
		if ($released > 0) {
			$this->logger->info('photos transcode: re-queued {count} stale rows', [
				'count' => $released,
			]);
		}

		$deadline = $now + self::WALL_BUDGET_SECONDS;
		while ($this->time->getTime() < $deadline) {
			$fileId = $this->mapper->claimNextPending($this->time->getTime());
			if ($fileId === null) {
				return;
			}
			$this->logger->debug('photos transcode: starting fileId={fileId}', [
				'fileId' => $fileId,
			]);
			try {
				$this->service->transcodeFile($fileId);
			} catch (\Throwable $e) {
				$this->logger->warning('photos transcode: unhandled exception for {fileId}', [
					'fileId' => $fileId,
					'exception' => $e,
				]);
				$this->mapper->markFailed($fileId, $e->getMessage(), $this->time->getTime());
			}
		}
	}
}
