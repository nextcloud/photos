<?php

declare(strict_types=1);

namespace OCA\Photos\Migration;

use Closure;
use OCA\Photos\Db\ExcludedPathMapper;
use OCA\Photos\Db\IncludedPathMapper;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Auto-generated migration step: Please modify to your needs!
 */
class Version1060Date20211230125342 extends SimpleMigrationStep {

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		foreach ([ExcludedPathMapper::TABLE_NAME, IncludedPathMapper::TABLE_NAME] as $tableName) {
			if (!$schema->hasTable($tableName)) {
				$table = $schema->createTable($tableName);
				$table->addColumn('id', 'integer', [
					'autoincrement' => true,
					'notnull' => true,
					'length' => 5
				]);
				$table->addColumn('path', 'string', [
					'notnull' => true,
					'length' => 256
				]);
				$table->setPrimaryKey(['id']);
				$table->addUniqueConstraint(['path']);
			}
		}

		return $schema;
	}
}
