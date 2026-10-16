<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Jobs;

use OCA\Photos\DB\PhotoPreviewWarmupMapper;
use OCA\Photos\Service\PhotoPreviewWarmupService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJob;
use OCP\BackgroundJob\TimedJob;
use Psr\Log\LoggerInterface;

/**
 * Drains the preview-warmup queue. Each tick:
 *
 *  1. Reaps stale `warming` rows from a worker that died mid-run
 *     (>30 min in the warming state — the warmup service typically
 *     finishes a file in under a second, so 30 min is a generous
 *     ceiling that won't disturb a healthy worker).
 *  2. Backfills new pending rows from `oc_photos_index` so existing
 *     instances pick up their library on first install. The
 *     listener handles new uploads going forward; backfill is the
 *     one-time bootstrap.
 *  3. Pulls a batch of pending file_ids, warms each one, marks
 *     warmed/failed, repeats until the wall budget is up.
 *
 * Wall budget is shorter than the transcode job's 30 min because
 * each warmup is fast (sub-second) — we want the queue to drain in
 * a few cron ticks rather than monopolising one. 5 min covers
 * roughly 600-1500 photos per tick depending on hardware.
 */
class PhotoPreviewWarmupJob extends TimedJob {
	private const WALL_BUDGET_SECONDS = 5 * 60;
	private const BATCH_SIZE = 50;
	private const BACKFILL_PER_TICK = 5000;

	public function __construct(
		ITimeFactory $time,
		private readonly PhotoPreviewWarmupMapper $mapper,
		private readonly PhotoPreviewWarmupService $service,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct($time);
		$this->setTimeSensitivity(IJob::TIME_INSENSITIVE);
		$this->setInterval(5 * 60);
	}

	protected function run($argument): void {
		if (!$this->service->isEnabled()) {
			return;
		}

		$now = $this->time->getTime();

		$released = $this->mapper->releaseStaleWarming($now);
		if ($released > 0) {
			$this->logger->info('photos warmup: re-queued {count} stale rows', [
				'count' => $released,
			]);
		}

		$inserted = $this->mapper->backfillFromIndex($now, self::BACKFILL_PER_TICK);
		if ($inserted > 0) {
			$this->logger->info('photos warmup: backfilled {count} new rows from photos_index', [
				'count' => $inserted,
			]);
		}

		$deadline = $now + self::WALL_BUDGET_SECONDS;
		$processed = 0;
		while ($this->time->getTime() < $deadline) {
			$batch = $this->mapper->claimNextBatch($this->time->getTime(), self::BATCH_SIZE);
			if ($batch === []) {
				break;
			}
			foreach ($batch as $fileId) {
				$ok = false;
				try {
					$ok = $this->service->warmFile($fileId);
				} catch (\Throwable $e) {
					$this->logger->warning('photos warmup: unhandled exception for {fileId}', [
						'fileId' => $fileId,
						'exception' => $e,
					]);
				}
				if ($ok) {
					$this->mapper->markWarmed($fileId, $this->time->getTime());
				} else {
					$this->mapper->markFailed($fileId, $this->time->getTime());
				}
				$processed++;
				if ($this->time->getTime() >= $deadline) {
					break;
				}
			}
		}
		if ($processed > 0) {
			$this->logger->debug('photos warmup: warmed {count} files this tick', [
				'count' => $processed,
			]);
		}
	}
}
