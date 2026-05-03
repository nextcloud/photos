<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\PhotoIndexMapper;
use OCA\Photos\Service\PhotoIndexService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\JSONResponse;
use OCP\Files\IRootFolder;
use OCP\IRequest;

/**
 * Index status + indexed timeline endpoints.
 *
 * Status drives the migration banner. Timeline is the fast indexed
 * read path — clients fall back to the DAV REPORT one when status
 * reports the index isn't ready yet.
 */
class IndexController extends Controller {
	public function __construct(
		IRequest $request,
		private readonly PhotoIndexService $indexService,
		private readonly PhotoIndexMapper $mapper,
		private readonly IRootFolder $rootFolder,
		private readonly string $userId,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	/**
	 * @return JSONResponse{
	 *   ready: bool,
	 *   indexed: int,
	 *   total: int,
	 * }
	 *
	 * `ready` is true when the per-user backfill flag is set. While
	 * false, clients show the migration banner and keep reading via
	 * the slow DAV path.
	 */
	#[NoAdminRequired]
	public function status(): JSONResponse {
		$indexed = $this->mapper->countForUser($this->userId);
		$total = $this->indexService->getCachedTotalForUser($this->userId);
		if ($total === null) {
			// First call after a fresh install — compute and cache.
			try {
				$storageId = $this->rootFolder
					->getUserFolder($this->userId)
					->getMountPoint()
					->getNumericStorageId();
				$total = $this->mapper->estimateTotalForUser($this->userId, (int)$storageId);
				$this->indexService->setCachedTotalForUser($this->userId, $total);
			} catch (\Throwable) {
				$total = $indexed;
			}
		}

		// Total can drift below indexed when a backfill scans shared
		// mounts the estimate didn't count — clamp so the banner
		// never reads "120 of 100".
		if ($indexed > $total) {
			$total = $indexed;
			$this->indexService->setCachedTotalForUser($this->userId, $total);
		}

		return new JSONResponse([
			'ready' => $this->indexService->isBackfillDoneForUser($this->userId),
			'indexed' => $indexed,
			'total' => $total,
		]);
	}

	/**
	 * Indexed timeline — compact rows by descending capture date.
	 * `before` is exclusive (pass the previous page's last
	 * `taken_at` to step backwards in time).
	 */
	#[NoAdminRequired]
	public function timeline(?int $before = null, int $limit = 100): JSONResponse {
		// Cap to a reasonable page; protects against pathological
		// clients while still letting initial loads cover ~one screen
		// of justified-grid tiles in a single round trip.
		$limit = max(1, min($limit, 500));

		$rows = $this->mapper->getTimelineForUser($this->userId, $before, $limit);
		return new JSONResponse([
			'items' => $rows,
			'nextBefore' => $rows === [] ? null : end($rows)['taken_at'],
		]);
	}
}
