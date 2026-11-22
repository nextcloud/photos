<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Import\IImporter;
use OCA\Photos\Import\ImportException;
use OCA\Photos\Import\ImportManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\JSONResponse;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\IL10N;
use OCP\IRequest;

/**
 * Start imports from other photo services for the current user, on a
 * folder of their files, and follow their progress.
 *
 * @psalm-import-type ImportStatus from ImportManager
 */
class ImportController extends Controller {
	public function __construct(
		IRequest $request,
		private readonly ?string $userId,
		private readonly ImportManager $importManager,
		private readonly IRootFolder $rootFolder,
		private readonly IL10N $l10n,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	/**
	 * The importers and the last import of the user.
	 */
	#[NoAdminRequired]
	public function index(): JSONResponse {
		$providers = array_map(static fn (IImporter $importer): array => [
			'id' => $importer->getId(),
			'name' => $importer->getName(),
			'description' => $importer->getDescription(),
			'folderHint' => $importer->getFolderHint(),
			'fields' => $importer->getFields(),
		], array_values($this->importManager->getImporters()));

		$status = $this->userId === null ? null : $this->importManager->getStatus($this->userId);

		return new JSONResponse([
			'providers' => $providers,
			'status' => $status === null ? null : $this->formatStatus($status),
		]);
	}

	/**
	 * @param string $provider Id of the importer
	 * @param string $path Folder to import from, relative to the files of the user
	 * @param bool $dryRun Only count what would be changed
	 * @param array<string, mixed> $options Values of the fields of the importer
	 */
	#[NoAdminRequired]
	public function start(string $provider, string $path, bool $dryRun = true, array $options = []): JSONResponse {
		$importer = $this->importManager->getImporter($provider);
		if ($this->userId === null || $importer === null) {
			return new JSONResponse(['message' => $this->l10n->t('This import is not available')], Http::STATUS_NOT_FOUND);
		}

		$userFolder = $this->rootFolder->getUserFolder($this->userId);
		try {
			$folder = $userFolder->get($path);
		} catch (NotFoundException|NotPermittedException) {
			$folder = null;
		}
		$relativePath = $folder instanceof Folder ? $userFolder->getRelativePath($folder->getPath()) : null;
		if (!$folder instanceof Folder || $relativePath === null) {
			return new JSONResponse(['message' => $this->l10n->t('Choose a folder of your files')], Http::STATUS_BAD_REQUEST);
		}

		$options = $this->importManager->sanitizeOptions($importer, $options);
		try {
			$importer->validateOptions($this->userId, $options);
		} catch (ImportException $e) {
			return new JSONResponse(['message' => $e->getMessage()], Http::STATUS_BAD_REQUEST);
		}

		$status = $this->importManager->queue($this->userId, $importer, $folder, $relativePath, $options, $dryRun);
		if ($status === null) {
			return new JSONResponse(['message' => $this->l10n->t('Another import is still running')], Http::STATUS_CONFLICT);
		}

		return new JSONResponse($this->formatStatus($status), Http::STATUS_ACCEPTED);
	}

	/**
	 * @param string $id Id of the import, as returned when it was started
	 */
	#[NoAdminRequired]
	public function status(string $id): JSONResponse {
		$status = $this->userId === null ? null : $this->importManager->getStatus($this->userId);
		if ($status === null || $status['id'] !== $id) {
			return new JSONResponse(['message' => $this->l10n->t('Import not found')], Http::STATUS_NOT_FOUND);
		}

		return new JSONResponse($this->formatStatus($status));
	}

	/**
	 * @param ImportStatus $status
	 */
	private function formatStatus(array $status): array {
		$labels = $this->importManager->getImporter($status['provider'])?->getSummaryLabels()
			?? ['found' => [], 'changed' => [], 'skipped' => []];

		$state = $status['state'];
		$error = $status['error'];
		if (in_array($state, ['queued', 'running'], true) && !$this->importManager->isActive($status)) {
			$state = 'failed';
			$error = $this->l10n->t('The import stopped before it finished');
		}

		$counts = [];
		foreach ($labels as $group => $groupLabels) {
			$counts[$group] = [];
			foreach ($groupLabels as $outcome => $label) {
				$count = $status['counts'][$outcome] ?? 0;
				if ($count > 0) {
					$counts[$group][] = ['label' => $label, 'count' => $count];
				}
			}
		}

		return [
			'id' => $status['id'],
			'provider' => $status['provider'],
			'folder' => $status['folder'],
			'dryRun' => $status['dryRun'],
			'state' => $state,
			'processed' => $status['processed'],
			...$counts,
			'examples' => array_map(static fn (array $example): array => [
				'path' => $example[0],
				'reason' => $labels['skipped'][$example[1]] ?? $example[1],
			], $status['examples']),
			'error' => $error,
		];
	}
}
