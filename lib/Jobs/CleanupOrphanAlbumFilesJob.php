<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Jobs;

use OCA\Photos\Album\AlbumMapper;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJob;
use OCP\BackgroundJob\TimedJob;
use Psr\Log\LoggerInterface;

/**
 * Drop album entries that point at files which no longer exist.
 *
 * AlbumsManagementEventListener already removes them when it sees the deletion,
 * but it cannot see every way a file can go away - changes made outside of
 * Nextcloud and only picked up by a scan, for instance. What is left behind is
 * an entry that resolves to no node, which every listing of that album then has
 * to work around. This job collects them once a week instead.
 */
class CleanupOrphanAlbumFilesJob extends TimedJob {
	private const int BATCH_SIZE = 1000;
	private const int INTERVAL = 7 * 24 * 3600;

	public function __construct(
		ITimeFactory $time,
		private readonly AlbumMapper $albumMapper,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct($time);

		$this->setInterval(self::INTERVAL);
		$this->setTimeSensitivity(IJob::TIME_INSENSITIVE);
	}

	#[\Override]
	protected function run($argument): void {
		$deleted = $this->albumMapper->deleteOrphanFiles(self::BATCH_SIZE);

		if ($deleted > 0) {
			$this->logger->info('Removed ' . $deleted . ' orphan album entries', ['app' => 'photos']);
		}
	}
}
