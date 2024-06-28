<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Migrate the photosSourceFolder user config to photosSourceFolders
 */
class Version3000Date20240417075404 extends SimpleMigrationStep {
	public function __construct(
		private IDBConnection $db,
	) {
	}

	/**
	 * @param IOutput $output
	 * @param Closure(): ISchemaWrapper $schemaClosure
	 * @param array $options
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
		$query = $this->db->getQueryBuilder();
		$query->update('preferences')
			->set('configvalue', $query->func()->concat($query->expr()->literal('["'), 'configvalue', $query->expr()->literal('"]')))
			->set('configkey', $query->expr()->literal('photosSourceFolders'))
			->where($query->expr()->eq('appid', $query->expr()->literal('photos')))
			->andWhere($query->expr()->eq('configkey', $query->expr()->literal('photosSourceFolder')))
			->executeStatement();
	}
}
