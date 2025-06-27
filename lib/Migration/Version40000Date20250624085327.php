<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;
use Psr\Log\LoggerInterface;

use function array_map;
use function json_decode;

/**
 * Fix incorrect type in photosLocation and photosSourceFolders
 */
class Version40000Date20250624085327 extends SimpleMigrationStep {
	public function __construct(
		private IDBConnection $db,
		private LoggerInterface $logger,
	) {
	}

	/**
	 * @param Closure(): ISchemaWrapper $schemaClosure
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
		/* Convert photosLocation from array to string if needed */
		$select = $this->db->getQueryBuilder();
		$select->select('userid', 'configvalue')
			->from('preferences')
			->where($select->expr()->eq('appid', $select->expr()->literal('photos')))
			->andWhere($select->expr()->eq('configkey', $select->expr()->literal('photosLocation')))
			->andWhere($select->expr()->like('configvalue', $select->expr()->literal('[%]')));

		$update = $this->db->getQueryBuilder();
		$update->update('preferences')
			->set('configvalue', $update->createParameter('newvalue'))
			->where($update->expr()->eq('appid', $update->expr()->literal('photos')))
			->andWhere($update->expr()->eq('configkey', $update->expr()->literal('photosLocation')))
			->andWhere($update->expr()->eq('userid', $update->createParameter('userid')));

		$result = $select->executeQuery();
		while (($row = $result->fetch()) !== false) {
			$update->setParameter('userid', $row['userid'], IQueryBuilder::PARAM_STR);
			try {
				$newvalue = json_decode($row['configvalue'], flags:JSON_THROW_ON_ERROR)[0];
			} catch (\Throwable $t) {
				$this->logger->error('Could not fix configvalue for photosLocation', ['exception' => $t]);
				continue;
			}
			$update->setParameter('newvalue', (string)$newvalue, IQueryBuilder::PARAM_STR);
			$update->executeStatement();
		}
		$result->closeCursor();

		/* Convert photosSourceFolders items from array to string if needed */
		$select = $this->db->getQueryBuilder();
		$select->select('userid', 'configvalue')
			->from('preferences')
			->where($select->expr()->eq('appid', $select->expr()->literal('photos')))
			->andWhere($select->expr()->eq('configkey', $select->expr()->literal('photosSourceFolders')))
			->andWhere($select->expr()->like('configvalue', $select->expr()->literal('[%[%]')));

		$update = $this->db->getQueryBuilder();
		$update->update('preferences')
			->set('configvalue', $update->createParameter('newvalue'))
			->where($update->expr()->eq('appid', $update->expr()->literal('photos')))
			->andWhere($update->expr()->eq('configkey', $update->expr()->literal('photosSourceFolders')))
			->andWhere($update->expr()->eq('userid', $update->createParameter('userid')));

		$result = $select->executeQuery();
		while (($row = $result->fetch()) !== false) {
			$update->setParameter('userid', $row['userid'], IQueryBuilder::PARAM_STR);
			try {
				$newvalue = json_encode(
					array_map(
						fn (array|string $item): string => (is_array($item) ? (string)reset($item) : $item),
						json_decode($row['configvalue'], flags:JSON_THROW_ON_ERROR),
					),
					flags:JSON_THROW_ON_ERROR
				);
			} catch (\Throwable $t) {
				$this->logger->error('Could not fix configvalue for photosSourceFolders', ['exception' => $t]);
				continue;
			}
			$update->setParameter('newvalue', (string)$newvalue, IQueryBuilder::PARAM_STR);
			$update->executeStatement();
		}
		$result->closeCursor();
	}
}
