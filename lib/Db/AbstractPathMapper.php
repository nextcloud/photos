<?php

namespace OCA\Photos\Db;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Exception;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\Folder;
use OCP\Files\Node;
use PDO;

class AbstractPathMapper extends QBMapper {
	public function deleteNode(Folder $node) {
		$qb = $this->db->getQueryBuilder();
		$qb->delete($this->getTableName())
			->where($qb->expr()->eq('path', $qb->createNamedParameter($node->getPath(), IQueryBuilder::PARAM_STR)));

		$qb->executeStatement();
	}

	public function getAllPaths() {
		$qb = $this->db->getQueryBuilder();
		$qb->select(['path'])
			->from($this->getTableName());

		return $qb->executeQuery()->fetchAll(PDO::FETCH_COLUMN);
	}

	public function insertNode(Node $node) {
		try {
			$qb = $this->db->getQueryBuilder();
			$qb->insert($this->getTableName())
				->values([
					'path' => $qb->createNamedParameter($node->getPath(), IQueryBuilder::PARAM_STR)
				]);

			$qb->executeStatement();
		} catch (Exception $e) {
			// Ignore any unique constraint violations as it just means we already have the path
			if ($e->getPrevious() instanceof UniqueConstraintViolationException) {
				return;
			}

			throw $e;
		}
	}
}
