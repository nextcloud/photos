<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Migrate the photosSourceFolder user config to photosSourceFolders
 */
class Version30000Date20240417075405 extends SimpleMigrationStep {
	public function __construct(
		private readonly IDBConnection $db,
	) {
	}

	/**
	 * @param IOutput $output
	 * @param Closure(): ISchemaWrapper $schemaClosure
	 * @param array $options
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
		$select = $this->db->getQueryBuilder();
		$select->select('userid')
			->from('preferences')
			->where($select->expr()->eq('appid', $select->expr()->literal('photos')))
			->andWhere($select->expr()->eq('configkey', $select->expr()->literal('photosSourceFolders')));

		$result = $select->executeQuery();
		$alreadyMigrated = array_map(static fn (array $row) => $row['userid'], $result->fetchAll());
		$result->closeCursor();

		// Remove old entries for users who already have the new one
		$delete = $this->db->getQueryBuilder();
		$delete->delete('preferences')
			->where($delete->expr()->eq('appid', $delete->expr()->literal('photos')))
			->andWhere($delete->expr()->eq('configkey', $delete->expr()->literal('photosSourceFolder')))
			->andWhere($delete->expr()->in(
				'userid',
				$delete->createParameter('chunk'),
				IQueryBuilder::PARAM_STR
			));

		$chunks = array_chunk($alreadyMigrated, 1000);
		foreach ($chunks as $chunk) {
			$delete->setParameter('chunk', $chunk, IQueryBuilder::PARAM_STR_ARRAY);
			$delete->executeStatement();
		}

		// Update remaining old entries to new ones
		$update = $this->db->getQueryBuilder();
		$update->update('preferences')
			->set('configvalue', $update->func()->concat($update->createNamedParameter('["'), 'configvalue', $update->createNamedParameter('"]')))
			->set('configkey', $update->expr()->literal('photosSourceFolders'))
			->where($update->expr()->eq('appid', $update->expr()->literal('photos')))
			->andWhere($update->expr()->eq('configkey', $update->expr()->literal('photosSourceFolder')))
			->executeStatement();
	}
}
