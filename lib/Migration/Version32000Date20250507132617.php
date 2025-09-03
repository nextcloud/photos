<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
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
 * Add smart_albums column
 */
#[AddColumn(table: 'photos_albums', name: 'filters', type: ColumnType::TEXT, description: 'storing album filters')]
class Version32000Date20250507132617 extends SimpleMigrationStep {

	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		$albumsTable = $schema->getTable('photos_albums');

		if (!$albumsTable->hasColumn('filters')) {
			$albumsTable->addColumn('filters', Types::TEXT, ['notnull' => false ]);
		}

		return $schema;
	}
}
