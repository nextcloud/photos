<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Import;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Jobs\ImportJob;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJobList;
use OCP\Config\IUserConfig;
use OCP\Files\Folder;
use OCP\Security\ICrypto;
use OCP\Security\ISecureRandom;
use Psr\Container\ContainerInterface;

/**
 * Registry of the importers, and the import of each user: one at a time,
 * run by {@see ImportJob}.
 *
 * @psalm-import-type ImportOptions from IImporter
 * @psalm-type ImportState = 'queued'|'running'|'done'|'failed'
 * @psalm-type ImportStatus = array{id: string, provider: string, folder: string, dryRun: bool, state: ImportState, processed: int, counts: array<string, int>, examples: list<array{string, string}>, error: ?string, updatedAt: int}
 */
class ImportManager {
	/** @var list<class-string<IImporter>> */
	private const IMPORTERS = [
		TakeoutImporter::class,
	];

	private const STATUS_KEY = 'importStatus';

	/** Seconds after which a queued or running import without progress is considered dead. */
	public const STALE_AFTER = 3600;

	public function __construct(
		private readonly ContainerInterface $container,
		private readonly IUserConfig $userConfig,
		private readonly IJobList $jobList,
		private readonly ICrypto $crypto,
		private readonly ISecureRandom $random,
		private readonly ITimeFactory $timeFactory,
	) {
	}

	/**
	 * @return array<string, IImporter> Importers, by id
	 */
	public function getImporters(): array {
		$importers = [];
		foreach (self::IMPORTERS as $class) {
			$importer = $this->container->get($class);
			$importers[$importer->getId()] = $importer;
		}

		return $importers;
	}

	public function getImporter(string $id): ?IImporter {
		return $this->getImporters()[$id] ?? null;
	}

	/**
	 * @return ?ImportStatus The last import of the user
	 */
	public function getStatus(string $userId): ?array {
		$status = $this->userConfig->getValueArray($userId, Application::APP_ID, self::STATUS_KEY, [], true);
		/** @var ?ImportStatus */
		return isset($status['id']) ? $status : null;
	}

	/**
	 * @param ImportStatus $status
	 * @return ImportStatus The status as stored
	 */
	public function setStatus(string $userId, array $status): array {
		$status['updatedAt'] = $this->timeFactory->getTime();
		$this->userConfig->setValueArray($userId, Application::APP_ID, self::STATUS_KEY, $status, true);
		return $status;
	}

	/**
	 * @param ?ImportStatus $status
	 */
	public function isActive(?array $status): bool {
		return $status !== null
			&& in_array($status['state'], ['queued', 'running'], true)
			&& $this->timeFactory->getTime() - $status['updatedAt'] < self::STALE_AFTER;
	}

	/**
	 * Keep the values of the fields of the importer, as booleans for
	 * checkboxes and strings otherwise.
	 *
	 * @return ImportOptions
	 */
	public function sanitizeOptions(IImporter $importer, array $options): array {
		$sanitized = [];
		foreach ($importer->getFields() as $field) {
			$value = $options[$field['id']] ?? null;
			$sanitized[$field['id']] = $field['type'] === 'checkbox'
				? $value === true || $value === 'true'
				: (is_string($value) ? trim($value) : '');
		}

		return $sanitized;
	}

	/**
	 * Queue an import unless the user already has one queued or running.
	 *
	 * @param ImportOptions $options Sanitized and validated values of the fields
	 * @return ?ImportStatus NULL if another import is active
	 */
	public function queue(string $userId, IImporter $importer, Folder $folder, string $path, array $options, bool $dryRun): ?array {
		if ($this->isActive($this->getStatus($userId))) {
			return null;
		}

		foreach ($importer->getFields() as $field) {
			if ($field['type'] === 'password') {
				$options[$field['id']] = $this->crypto->encrypt((string)$options[$field['id']]);
			}
		}

		$id = $this->random->generate(16, ISecureRandom::CHAR_ALPHANUMERIC);
		$status = $this->setStatus($userId, [
			'id' => $id,
			'provider' => $importer->getId(),
			'folder' => $path,
			'dryRun' => $dryRun,
			'state' => 'queued',
			'processed' => 0,
			'counts' => [],
			'examples' => [],
			'error' => null,
			'updatedAt' => 0,
		]);

		$this->jobList->add(ImportJob::class, [
			'id' => $id,
			'userId' => $userId,
			'provider' => $importer->getId(),
			'folderId' => $folder->getId(),
			'dryRun' => $dryRun,
			'options' => $options,
		]);

		return $status;
	}

	/**
	 * @param ImportOptions $options Values of the fields, as queued
	 * @return ImportOptions
	 */
	public function decryptOptions(IImporter $importer, array $options): array {
		foreach ($importer->getFields() as $field) {
			if ($field['type'] === 'password' && isset($options[$field['id']])) {
				$options[$field['id']] = $this->crypto->decrypt((string)$options[$field['id']]);
			}
		}

		return $options;
	}
}
