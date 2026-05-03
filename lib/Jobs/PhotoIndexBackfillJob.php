<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Jobs;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Service\PhotoIndexService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJob;
use OCP\BackgroundJob\TimedJob;
use OCP\IConfig;
use OCP\IUserManager;
use Psr\Log\LoggerInterface;

/**
 * Walks every user's primary folder once to seed `oc_photos_index`
 * with rows for files that pre-date the index. Modeled on the
 * AutomaticPlaceMapperJob next door — same cursor-by-userId pattern,
 * same one-hour wall budget per tick.
 *
 * The cursor (`index.backfillLastUser`) lets the job resume across
 * cron ticks without re-walking finished users. A user is "done" when
 * the service writes the per-user `index.backfillDone.<uid>` flag —
 * that flag also drives the migration banner in the UI.
 */
class PhotoIndexBackfillJob extends TimedJob {
	private const WALL_BUDGET_SECONDS = 60 * 60;

	public function __construct(
		ITimeFactory $time,
		private readonly IConfig $config,
		private readonly IUserManager $userManager,
		private readonly PhotoIndexService $indexService,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct($time);
		$this->setTimeSensitivity(IJob::TIME_INSENSITIVE);
		// 15-minute cron tick is short enough that a fresh install
		// gets its first user processed quickly, and long enough
		// that we don't burn cycles when there's no work left.
		$this->setInterval(15 * 60);
	}

	protected function run($argument): void {
		$users = $this->userManager->search('');
		if ($users === []) {
			return;
		}

		$lastUser = $this->config->getAppValue(
			Application::APP_ID,
			PhotoIndexService::APP_KEY_BACKFILL_LAST_USER,
			'',
		);

		// Resume after lastUser; if empty we start at the first user.
		// We sort the list so cursor advancement is stable across
		// runs (IUserManager::search returns insertion order which
		// can shift if users are removed).
		usort($users, fn ($a, $b) => strcmp($a->getUID(), $b->getUID()));

		$startedScanning = $lastUser === '';
		$deadline = $this->time->getTime() + self::WALL_BUDGET_SECONDS;

		foreach ($users as $user) {
			$uid = $user->getUID();

			if (!$startedScanning) {
				if ($uid === $lastUser) {
					$startedScanning = true;
				}
				continue;
			}

			if ($this->indexService->isBackfillDoneForUser($uid)) {
				$this->config->setAppValue(
					Application::APP_ID,
					PhotoIndexService::APP_KEY_BACKFILL_LAST_USER,
					$uid,
				);
				continue;
			}

			if ($this->time->getTime() >= $deadline) {
				return;
			}

			try {
				$count = $this->indexService->backfillUser($uid, $deadline);
				$this->logger->debug('photos index: backfilled {count} files for {uid}', [
					'count' => $count,
					'uid' => $uid,
				]);
			} catch (\Throwable $e) {
				$this->logger->warning('photos index: backfill failed for {uid}', [
					'uid' => $uid,
					'exception' => $e,
				]);
			}

			// Advance the cursor only after the user finishes; if we
			// hit the deadline mid-user, the next tick re-enters and
			// the upsert keeps already-indexed rows fresh.
			if ($this->indexService->isBackfillDoneForUser($uid)) {
				$this->config->setAppValue(
					Application::APP_ID,
					PhotoIndexService::APP_KEY_BACKFILL_LAST_USER,
					$uid,
				);
			} else {
				return;
			}
		}

		// Walked the whole list this tick — clear the cursor so the
		// next tick re-checks any users still flagged not-done (e.g.
		// users added since the last walk).
		$this->config->deleteAppValue(
			Application::APP_ID,
			PhotoIndexService::APP_KEY_BACKFILL_LAST_USER,
		);
	}
}
