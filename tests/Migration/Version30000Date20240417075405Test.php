<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\Photos\Tests\Migration;

use OCA\Photos\Migration\Version30000Date20240417075405;
use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Server;
use Test\TestCase;

/**
 * @group DB
 */
class Version30000Date20240417075405Test extends TestCase {
	protected IDBConnection $connection;

	protected function setUp(): void {
		parent::setUp();

		$this->connection = Server::get(IDBConnection::class);
	}

	protected function tearDown(): void {
		$this->deleteTestEntries();
		parent::tearDown();
	}

	protected function deleteTestEntries(): void {
		$delete = $this->connection->getQueryBuilder();
		$delete->delete('preferences')
			->where($delete->expr()->like('userid', $delete->createNamedParameter('Version30000Date20240417075405Test%')));
		$delete->executeStatement();
	}

	protected function createTestEntries(): void {
		$this->deleteTestEntries();

		$insert = $this->connection->getQueryBuilder();
		$insert->insert('preferences')
			->values([
				'userid' => $insert->createParameter('userid'),
				'appid' => $insert->createNamedParameter('photos'),
				'configkey' => $insert->createParameter('configkey'),
				'configvalue' => $insert->createNamedParameter('value'),
			]);

		$this->connection->beginTransaction();
		for ($i = 1; $i <= 3000; $i++) {
			$mod = $i % 3;
			if ($mod !== 0) {
				$insert->setParameter('userid', 'Version30000Date20240417075405Test#' . $i)
					->setParameter('configkey', 'photosSourceFolder');
				$insert->executeStatement();
			}
			if ($mod !== 1) {
				$insert->setParameter('userid', 'Version30000Date20240417075405Test#' . $i)
					->setParameter('configkey', 'photosSourceFolders');
				$insert->executeStatement();
			}
		}
		$this->connection->commit();
	}

	public function testPostSchemaChange(): void {
		$migration = new Version30000Date20240417075405($this->connection);

		$this->createTestEntries();


		$migration->postSchemaChange(
			$this->createMock(IOutput::class),
			\Closure::fromCallable(fn (): bool => false),
			[]
		);

		$select = $this->connection->getQueryBuilder();
		$select->select($select->func()->count())
			->from('preferences')
			->where($select->expr()->like('userid', $select->createNamedParameter('Version30000Date20240417075405Test%')))
			->andWhere($select->expr()->eq('appid', $select->expr()->literal('photos')))
			->andWhere($select->expr()->eq('configkey', $select->expr()->literal('photosSourceFolder')));
		$result = $select->executeQuery();
		$this->assertEquals(0, $result->fetchOne());
		$result->closeCursor();

		$select = $this->connection->getQueryBuilder();
		$select->select($select->func()->count())
			->from('preferences')
			->where($select->expr()->like('userid', $select->createNamedParameter('Version30000Date20240417075405Test%')))
			->andWhere($select->expr()->eq('appid', $select->expr()->literal('photos')))
			->andWhere($select->expr()->eq('configkey', $select->expr()->literal('photosSourceFolders')));
		$result = $select->executeQuery();
		$this->assertEquals(3000, $result->fetchOne());
		$result->closeCursor();
	}
}
