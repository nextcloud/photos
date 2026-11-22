<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Jobs;

use OCA\Photos\Import\IImporter;
use OCA\Photos\Import\ImportException;
use OCA\Photos\Import\ImportManager;
use OCA\Photos\Import\ImportReport;
use OCA\Photos\Jobs\ImportJob;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJobList;
use OCP\Config\IUserConfig;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\IL10N;
use OCP\Security\ICrypto;
use OCP\Security\ISecureRandom;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class ImportJobTest extends TestCase {
	private const NOW = 1700000000;
	private const ARGUMENT = [
		'id' => 'import1',
		'userId' => 'alice',
		'provider' => 'service',
		'folderId' => 42,
		'dryRun' => true,
		'options' => ['apiKey' => 'encrypted:secret'],
	];

	private IImporter&MockObject $importer;
	private IUserFolder&MockObject $userFolder;
	private LoggerInterface&MockObject $logger;
	private ImportJob $job;

	/** @var array Stored import status of alice */
	private array $status = [];

	protected function setUp(): void {
		parent::setUp();

		$this->importer = $this->createMock(IImporter::class);
		$this->importer->method('getId')->willReturn('service');
		$this->importer->method('getFields')->willReturn([['id' => 'apiKey', 'type' => 'password', 'label' => 'API key']]);
		$this->importer->method('getSummaryLabels')->willReturn([
			'found' => [],
			'changed' => ['updated' => 'Updated'],
			'skipped' => ['no_sidecar' => 'No sidecar'],
		]);

		$container = $this->createMock(ContainerInterface::class);
		$container->method('get')->willReturn($this->importer);

		$userConfig = $this->createMock(IUserConfig::class);
		$userConfig->method('getValueArray')->with('alice')->willReturnCallback(fn (): array => $this->status);
		$userConfig->method('setValueArray')
			->willReturnCallback(function (string $userId, string $app, string $key, array $value): bool {
				$this->status = $value;
				return true;
			});

		$crypto = $this->createMock(ICrypto::class);
		$crypto->method('decrypt')->willReturnCallback(fn (string $value): string => substr($value, strlen('encrypted:')));

		$time = $this->createMock(ITimeFactory::class);
		$time->method('getTime')->willReturn(self::NOW);

		$importManager = new ImportManager($container, $userConfig, $this->createMock(IJobList::class), $crypto, $this->createMock(ISecureRandom::class), $time);

		$this->userFolder = $this->createMock(IUserFolder::class);
		$this->userFolder->method('getRelativePath')->willReturnCallback(fn (string $path): string => substr($path, strlen('/alice/files')));
		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->with('alice')->willReturn($this->userFolder);

		$l10n = $this->createMock(IL10N::class);
		$l10n->method('t')->willReturnArgument(0);

		$this->logger = $this->createMock(LoggerInterface::class);

		$this->job = new ImportJob($time, $importManager, $rootFolder, $l10n, $this->logger);

		$this->status = [
			'id' => 'import1',
			'provider' => 'service',
			'folder' => '/Takeout',
			'dryRun' => true,
			'state' => 'queued',
			'processed' => 0,
			'counts' => [],
			'examples' => [],
			'error' => null,
			'updatedAt' => self::NOW,
		];
	}

	private function givenFolder(): Folder&MockObject {
		$folder = $this->createMock(Folder::class);
		$this->userFolder->method('getFirstNodeById')->with(42)->willReturn($folder);
		return $folder;
	}

	public function testRunsTheImportAndStoresTheSummary(): void {
		$folder = $this->givenFolder();
		$this->importer->expects($this->once())->method('import')
			->with('alice', $folder, ['apiKey' => 'secret'], true)
			->willReturnCallback(function (string $userId, Folder $folder, array $options, bool $dryRun, ImportReport $report): void {
				$this->assertSame('running', $this->status['state']);
				$report->add('updated', '/alice/files/Takeout/a.jpg');
				for ($i = 0; $i < ImportJob::MAX_EXAMPLES + 5; $i++) {
					$report->add('no_sidecar', "/alice/files/Takeout/$i.jpg");
				}
			});

		self::invokePrivate($this->job, 'run', [self::ARGUMENT]);

		$this->assertSame('done', $this->status['state']);
		$this->assertSame(ImportJob::MAX_EXAMPLES + 6, $this->status['processed']);
		$this->assertSame(['updated' => 1, 'no_sidecar' => ImportJob::MAX_EXAMPLES + 5], $this->status['counts']);
		$this->assertCount(ImportJob::MAX_EXAMPLES, $this->status['examples']);
		$this->assertSame(['/Takeout/0.jpg', 'no_sidecar'], $this->status['examples'][0]);
		$this->assertStringNotContainsString('secret', json_encode($this->status));
	}

	public function testSkipsAnImportThatIsNoLongerTheCurrentOne(): void {
		$this->status['id'] = 'import2';
		$this->importer->expects($this->never())->method('import');

		self::invokePrivate($this->job, 'run', [self::ARGUMENT]);

		$this->assertSame('queued', $this->status['state']);
	}

	public function testFailsWhenTheFolderIsGone(): void {
		$this->userFolder->method('getFirstNodeById')->willReturn(null);
		$this->importer->expects($this->never())->method('import');

		self::invokePrivate($this->job, 'run', [self::ARGUMENT]);

		$this->assertSame('failed', $this->status['state']);
	}

	public function testStoresTheMessageOfAnImportException(): void {
		$this->givenFolder();
		$this->importer->method('import')->willThrowException(new ImportException('Immich rejected the API key'));

		self::invokePrivate($this->job, 'run', [self::ARGUMENT]);

		$this->assertSame('failed', $this->status['state']);
		$this->assertSame('Immich rejected the API key', $this->status['error']);
	}

	public function testHidesUnexpectedErrorsFromTheUser(): void {
		$this->givenFolder();
		$this->importer->method('import')->willThrowException(new \RuntimeException('SQLSTATE[HY000]'));
		$this->logger->expects($this->once())->method('error');

		self::invokePrivate($this->job, 'run', [self::ARGUMENT]);

		$this->assertSame('failed', $this->status['state']);
		$this->assertStringNotContainsString('SQLSTATE', $this->status['error']);
	}
}
