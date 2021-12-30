<?php

namespace OCA\Photos\Db;

use OCP\IDBConnection;

class ExcludedPathMapper extends AbstractPathMapper {
	public const TABLE_NAME = 'photos_excluded_paths';

	public function __construct(IDBConnection $db) {
		parent::__construct($db, self::TABLE_NAME);
	}
}
