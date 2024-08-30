<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\DB\Types;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Auto-generated migration step: Please modify to your needs!
 */
class Version20001Date20220830131446 extends SimpleMigrationStep {
	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();
		$modified = false;

		/**
		 * Replaced by Version20003Date20221102170153
		 *
		 * if (!$schema->hasTable("photos_collaborators")) {
		 * 	$modified = true;
		 * 	$table = $schema->createTable("photos_collaborators");
		 * 	$table->addColumn('album_id', Types::BIGINT, [
		 * 		'notnull' => true,
		 * 		'length' => 20,
		 * 	]);
		 * 	$table->addColumn('collaborator_id', Types::STRING, [
		 * 		'notnull' => true,
		 * 		'length' => 64,
		 * 	]);
		 * 	$table->addColumn('collaborator_type', Types::INTEGER, [
		 * 		'notnull' => true,
		 * 	]);
		 *
		 * 	$table->addUniqueConstraint(['album_id', 'collaborator_id', 'collaborator_type'], 'collaborators_unique_idx');
		 * }
		 */

		if (!$schema->getTable('photos_albums_files')->hasColumn('owner')) {
			$modified = true;
			$table = $schema->getTable('photos_albums_files');
			$table->addColumn('owner', Types::STRING, [
				'notnull' => false,
				'length' => 64,
			]);
		}

		if ($modified) {
			return $schema;
		} else {
			return null;
		}
	}
}
