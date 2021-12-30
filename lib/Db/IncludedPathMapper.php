<?php

namespace OCA\Photos\Db;

use OCP\IDBConnection;

class IncludedPathMapper extends AbstractPathMapper {
	public const TABLE_NAME = 'photos_included_paths';

	public function __construct(IDBConnection $db) {
		parent::__construct($db, self::TABLE_NAME);
	}
}
