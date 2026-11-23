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
use OCP\Migration\Attributes\AddColumn;
use OCP\Migration\Attributes\ColumnType;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Add the cover and description columns to albums
 */
#[AddColumn(table: 'photos_albums', name: 'cover', type: ColumnType::BIGINT, description: 'file id of the cover photo picked by the owner, -1 for none')]
#[AddColumn(table: 'photos_albums', name: 'description', type: ColumnType::TEXT, description: 'album description')]
class Version90000Date20261122120000 extends SimpleMigrationStep {

	#[\Override]
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		$albumsTable = $schema->getTable('photos_albums');

		if (!$albumsTable->hasColumn('cover')) {
			$albumsTable->addColumn('cover', Types::BIGINT, [
				'notnull' => true,
				'default' => -1,
			]);
		}

		if (!$albumsTable->hasColumn('description')) {
			$albumsTable->addColumn('description', Types::TEXT, ['notnull' => false]);
		}

		return $schema;
	}
}
