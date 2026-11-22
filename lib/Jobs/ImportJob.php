<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Jobs;

use OCA\Photos\Import\ImportException;
use OCA\Photos\Import\ImportManager;
use OCA\Photos\Import\ImportReport;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\QueuedJob;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\IL10N;
use Psr\Log\LoggerInterface;

/**
 * Run an import queued by {@see ImportManager::queue()} and keep its status
 * up to date for the user.
 *
 * @psalm-import-type ImportOptions from \OCA\Photos\Import\IImporter
 */
class ImportJob extends QueuedJob {
	/** Skipped items listed in the status, the counts cover all of them. */
	public const MAX_EXAMPLES = 20;

	/** Seconds between two saves of the progress. */
	private const SAVE_INTERVAL = 5;

	public function __construct(
		ITimeFactory $time,
		private readonly ImportManager $importManager,
		private readonly IRootFolder $rootFolder,
		private readonly IL10N $l10n,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct($time);
	}

	/**
	 * @param array{id: string, userId: string, provider: string, folderId: int, dryRun: bool, options: ImportOptions} $argument
	 */
	#[\Override]
	protected function run($argument): void {
		$userId = $argument['userId'];
		$status = $this->importManager->getStatus($userId);
		if ($status === null || $status['id'] !== $argument['id'] || !$this->importManager->isActive($status)) {
			return;
		}

		$importer = $this->importManager->getImporter($argument['provider']);
		$userFolder = $this->rootFolder->getUserFolder($userId);
		$folder = $userFolder->getFirstNodeById($argument['folderId']);
		if ($importer === null || !$folder instanceof Folder) {
			$status['state'] = 'failed';
			$status['error'] = $this->l10n->t('The folder to import from was not found');
			$this->importManager->setStatus($userId, $status);
			return;
		}

		$status['state'] = 'running';
		$status = $this->importManager->setStatus($userId, $status);

		$skipped = $importer->getSummaryLabels()['skipped'];
		$lastSave = $this->time->getTime();
		$report = new ImportReport(function (string $outcome, ?string $item) use (&$status, &$lastSave, $skipped, $userFolder, $userId): void {
			$status['processed']++;
			if ($item !== null && isset($skipped[$outcome]) && count($status['examples']) < self::MAX_EXAMPLES) {
				$status['examples'][] = [$userFolder->getRelativePath($item) ?? basename($item), $outcome];
			}

			if ($this->time->getTime() - $lastSave >= self::SAVE_INTERVAL) {
				$status = $this->importManager->setStatus($userId, $status);
				$lastSave = $this->time->getTime();
			}
		});

		try {
			$importer->import($userId, $folder, $this->importManager->decryptOptions($importer, $argument['options']), $argument['dryRun'], $report);
			$status['state'] = 'done';
		} catch (ImportException $e) {
			$status['state'] = 'failed';
			$status['error'] = $e->getMessage();
		} catch (\Throwable $e) {
			$this->logger->error('Import from ' . $importer->getId() . ' failed', ['exception' => $e, 'userId' => $userId]);
			$status['state'] = 'failed';
			$status['error'] = $this->l10n->t('The import failed, your administrator can find the details in the server log');
		}

		$status['counts'] = $report->getCounts();
		$this->importManager->setStatus($userId, $status);
	}
}
