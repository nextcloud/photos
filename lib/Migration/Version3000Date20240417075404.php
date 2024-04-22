<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2024 Louis Chmn <louis@chmn.me>
 *
 * @author Louis Chmn <louis@chmn.me>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
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
