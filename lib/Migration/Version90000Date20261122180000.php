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
 * Add the guest_upload column to album collaborators
 */
#[AddColumn(table: 'photos_albums_collabs', name: 'guest_upload', type: ColumnType::BOOLEAN, description: 'whether visitors of a public link may add photos')]
class Version90000Date20261122180000 extends SimpleMigrationStep {

	#[\Override]
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		$collaboratorsTable = $schema->getTable('photos_albums_collabs');

		if (!$collaboratorsTable->hasColumn('guest_upload')) {
			$collaboratorsTable->addColumn('guest_upload', Types::BOOLEAN, [
				'notnull' => false,
				'default' => false,
			]);
		}

		return $schema;
	}
}
