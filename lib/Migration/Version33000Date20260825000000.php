<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\DB\Types;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Store user-editable photo details (description and rating) that Nextcloud does
 * not keep anywhere else, keyed by file id.
 */
class Version33000Date20260825000000 extends SimpleMigrationStep {
	/**
	 * @param IOutput $output
	 * @param Closure(): ISchemaWrapper $schemaClosure
	 * @param array $options
	 */
	#[\Override]
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if ($schema->hasTable('photos_metadata')) {
			return null;
		}

		$table = $schema->createTable('photos_metadata');
		$table->addColumn('id', Types::BIGINT, [
			'autoincrement' => true,
			'notnull' => true,
		]);
		$table->addColumn('file_id', Types::BIGINT, [
			'notnull' => true,
		]);
		$table->addColumn('description', Types::TEXT, [
			'notnull' => false,
		]);
		$table->addColumn('rating', Types::SMALLINT, [
			'notnull' => true,
			'default' => 0,
		]);
		$table->setPrimaryKey(['id']);
		// One row of details per file.
		$table->addUniqueIndex(['file_id'], 'photos_meta_fileid_idx');

		return $schema;
	}
}
