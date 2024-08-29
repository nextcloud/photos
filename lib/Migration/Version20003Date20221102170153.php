<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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

		if ($schema->hasTable('photos_albums_collabs')) {
			return null;
		}

		$table = $schema->createTable('photos_albums_collabs');
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
				->setParameter('collaborator_type', (int)$row['collaborator_type'], IQueryBuilder::PARAM_INT)
				->executeStatement();
		}

		$result->closeCursor();
		$this->connection->commit();

		// $result->rowCount() cannot be relied on.
		// some database drivers may return the number of rows returned by that query
		return $rowCount;
	}
}
