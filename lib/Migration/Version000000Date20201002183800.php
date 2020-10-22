<?php

namespace OCA\Photos\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\SimpleMigrationStep;
use OCP\Migration\IOutput;

class Version000000Date20201002183800 extends SimpleMigrationStep
{

  /**
    * @param IOutput $output
    * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
    * @param array $options
    * @return null|ISchemaWrapper
  */
  public function changeSchema(IOutput $output, Closure $schemaClosure, array $options)
  {
    /** @var ISchemaWrapper $schema */
    $schema = $schemaClosure();
    $tableName = "photosmetadata";
    if (!$schema->hasTable($tableName)) {
      $table = $schema->createTable($tableName);
      $table->addColumn('id', 'integer', [
				'notnull' => true,
				'autoincrement' => true,
      ]);
		 
			$table->addColumn('file_id', 'integer', [
				'notnull' => false,
        'length' => 64,
      ]);
			$table->addColumn('date_time_original', 'string', [
        'notnull' => false,
        'length' => 200
      ]);
      $table->addColumn('gps_latitude', 'string', [
        'notnull' => false,
      ]);
      $table->addColumn('gps_longitude', 'string', [
        'notnull' => false
      ]);
      $table->addColumn('gps_latitude_ref', 'string', [
        'notnull' => false
      ]);
      $table->addColumn('gps_longitude_ref', 'string', [
        'notnull' => false
      ]);
			
			$table->addColumn('path', 'string', [
        'notnull' => false
      ]);


      $table->setPrimaryKey(['id']);
    }
    return $schema;
  }
}
