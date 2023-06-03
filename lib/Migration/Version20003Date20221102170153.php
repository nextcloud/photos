<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
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
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\DB\Types;
use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Auto-generated migration step: Please modify to your needs!
 */
class Version20003Date20221102170153 extends SimpleMigrationStep {
	protected IDBConnection $connection;

	public function __construct(IDBConnection $connection) {
		$this->connection = $connection;
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if ($schema->hasTable("photos_albums_collabs")) {
			return null;
		}

		$table = $schema->createTable("photos_albums_collabs");
		$table->addColumn('id', Types::BIGINT, [
			'autoincrement' => true,
			'notnull' => true,
			'length' => 20,
		]);
		$table->addColumn('album_id', Types::BIGINT, [
			'notnull' => true,
			'length' => 20,
		]);
		$table->addColumn('collaborator_id', Types::STRING, [
			'notnull' => true,
			'length' => 64,
		]);
		$table->addColumn('collaborator_type', Types::INTEGER, [
			'notnull' => true,
		]);

		$table->setPrimaryKey(['id']);
		$table->addUniqueIndex(['album_id', 'collaborator_id', 'collaborator_type'], 'album_collabs_uniq_collab');

		return $schema;
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return void
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options) {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();
		if (!$schema->hasTable('photos_collaborators')) {
			return;
		}

		$insert = $this->connection->getQueryBuilder();
		$insert->insert('photos_albums_collabs')
			->values([
				'album_id' => $insert->createParameter('album_id'),
				'collaborator_id' => $insert->createParameter('collaborator_id'),
				'collaborator_type' => $insert->createParameter('collaborator_type'),
			]);

		$select = $this->connection->getQueryBuilder();
		$select->select('*')
			->from('photos_collaborators')
			->setMaxResults(1000);

		$offset = 0;
		$movedRows = 0;
		do {
			$movedRows = $this->chunkedCopying($insert, $select, $offset);
			$offset += $movedRows;
		} while ($movedRows !== 0);
	}

	protected function chunkedCopying(IQueryBuilder $insert, IQueryBuilder $select, int $offset): int {
		$this->connection->beginTransaction();

		$rowCount = 0;
		$result = $select
			->setFirstResult($offset)
			->executeQuery();

		while ($row = $result->fetch()) {
			$rowCount += $insert
				->setParameter('album_id', (int)$row['album_id'], IQueryBuilder::PARAM_INT)
				->setParameter('collaborator_id', $row['collaborator_id'])
				->setParameter('collaborator_type', (int) $row['collaborator_type'], IQueryBuilder::PARAM_INT)
				->executeStatement();
		}

		$result->closeCursor();
		$this->connection->commit();

		// $result->rowCount() cannot be relied on.
		// some database drivers may return the number of rows returned by that query
		return $rowCount;
	}
}
