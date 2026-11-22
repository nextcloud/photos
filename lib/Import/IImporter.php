<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Import;

use OCP\Files\Folder;

/**
 * Applies the metadata of the library of another photo service to the files
 * a user copied from it into a folder of their files.
 *
 * @psalm-type ImportField = array{id: string, type: 'checkbox'|'url'|'password', label: string}
 * @psalm-type ImportOptions = array<string, bool|string>
 */
interface IImporter {
	public function getId(): string;

	public function getName(): string;

	/**
	 * What the import changes.
	 */
	public function getDescription(): string;

	/**
	 * Which folder to choose.
	 */
	public function getFolderHint(): string;

	/**
	 * Additional fields of the import form. Values of password fields are
	 * encrypted while the import is queued and never returned.
	 *
	 * @return list<ImportField>
	 */
	public function getFields(): array;

	/**
	 * Labels of the outcomes counted in the report: totals found, changes,
	 * and items left unchanged.
	 *
	 * @return array{found: array<string, string>, changed: array<string, string>, skipped: array<string, string>}
	 */
	public function getSummaryLabels(): array;

	/**
	 * @param ImportOptions $options Values of the fields
	 * @throws ImportException if the import cannot run with these options
	 */
	public function validateOptions(string $userId, array $options): void;

	/**
	 * @param Folder $folder Folder of the user holding the copied files
	 * @param ImportOptions $options Values of the fields
	 * @param bool $dryRun Only count what would be changed
	 * @throws ImportException if the import failed
	 */
	public function import(string $userId, Folder $folder, array $options, bool $dryRun, ImportReport $report): void;
}
