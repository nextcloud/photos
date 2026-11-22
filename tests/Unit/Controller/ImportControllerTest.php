<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Controller;

use OCA\Photos\Controller\ImportController;
use OCA\Photos\Import\IImporter;
use OCA\Photos\Import\ImportException;
use OCA\Photos\Import\ImportManager;
use OCA\Photos\Jobs\ImportJob;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJobList;
use OCP\Config\IUserConfig;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\NotPermittedException;
use OCP\IL10N;
use OCP\IRequest;
use OCP\Security\ICrypto;
use OCP\Security\ISecureRandom;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Container\ContainerInterface;
use Test\TestCase;

class ImportControllerTest extends TestCase {
	private const NOW = 1700000000;

	private IImporter&MockObject $importer;
	private IJobList&MockObject $jobList;
	private IUserFolder&MockObject $userFolder;
	private ImportManager $importManager;

	/** @var array<string, array> Stored user config values, by user id */
	private array $config = [];

	protected function setUp(): void {
		parent::setUp();

		$this->importer = $this->createMock(IImporter::class);
		$this->importer->method('getId')->willReturn('service');
		$this->importer->method('getName')->willReturn('Service');
		$this->importer->method('getFields')->willReturn([
			['id' => 'force', 'type' => 'checkbox', 'label' => 'Force'],
			['id' => 'apiKey', 'type' => 'password', 'label' => 'API key'],
		]);
		$this->importer->method('getSummaryLabels')->willReturn([
			'found' => ['media' => 'Media files'],
			'changed' => ['updated' => 'Updated'],
			'skipped' => ['no_sidecar' => 'No sidecar', 'not_editable' => 'Not editable'],
		]);

		$container = $this->createMock(ContainerInterface::class);
		$container->method('get')->willReturn($this->importer);

		$userConfig = $this->createMock(IUserConfig::class);
		$userConfig->method('getValueArray')
			->willReturnCallback(fn (string $userId): array => $this->config[$userId] ?? []);
		$userConfig->method('setValueArray')
			->willReturnCallback(function (string $userId, string $app, string $key, array $value): bool {
				$this->config[$userId] = $value;
				return true;
			});

		$crypto = $this->createMock(ICrypto::class);
		$crypto->method('encrypt')->willReturnCallback(fn (string $value): string => 'encrypted:' . $value);

		$random = $this->createMock(ISecureRandom::class);
		$random->method('generate')->willReturnOnConsecutiveCalls('import1', 'import2');

		$timeFactory = $this->createMock(ITimeFactory::class);
		$timeFactory->method('getTime')->willReturn(self::NOW);

		$this->jobList = $this->createMock(IJobList::class);
		$this->importManager = new ImportManager($container, $userConfig, $this->jobList, $crypto, $random, $timeFactory);

		$this->userFolder = $this->createMock(IUserFolder::class);
		$this->userFolder->method('getRelativePath')
			->willReturnCallback(fn (string $path): ?string => str_starts_with($path, '/alice/files/') ? substr($path, 12) : null);
	}

	private function createController(?string $userId = 'alice'): ImportController {
		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->with('alice')->willReturn($this->userFolder);

		$l10n = $this->createMock(IL10N::class);
		$l10n->method('t')->willReturnArgument(0);

		return new ImportController($this->createMock(IRequest::class), $userId, $this->importManager, $rootFolder, $l10n);
	}

	private function createFolder(string $path): Folder&MockObject {
		$folder = $this->createMock(Folder::class);
		$folder->method('getId')->willReturn(42);
		$folder->method('getPath')->willReturn($path);

		return $folder;
	}

	public function testEndpointsAreForLoggedInUsers(): void {
		foreach (['index', 'start', 'status'] as $method) {
			$reflection = new \ReflectionMethod(ImportController::class, $method);
			$this->assertNotEmpty($reflection->getAttributes(NoAdminRequired::class), $method);
			$this->assertEmpty($reflection->getAttributes(PublicPage::class), $method);
			$this->assertEmpty($reflection->getAttributes(NoCSRFRequired::class), $method);
		}
	}

	public function testIndexListsTheImporters(): void {
		$response = $this->createController()->index();

		$this->assertSame('service', $response->getData()['providers'][0]['id']);
		$this->assertSame('API key', $response->getData()['providers'][0]['fields'][1]['label']);
		$this->assertNull($response->getData()['status']);
	}

	public function testStartQueuesAnImportForTheCurrentUser(): void {
		$this->userFolder->method('get')->with('/Takeout')->willReturn($this->createFolder('/alice/files/Takeout'));
		$this->importer->expects($this->once())->method('validateOptions')
			->with('alice', ['force' => true, 'apiKey' => 'secret']);

		$this->jobList->expects($this->once())->method('add')->with(ImportJob::class, [
			'id' => 'import1',
			'userId' => 'alice',
			'provider' => 'service',
			'folderId' => 42,
			'dryRun' => false,
			'options' => ['force' => true, 'apiKey' => 'encrypted:secret'],
		]);

		$response = $this->createController()->start('service', '/Takeout', false, ['force' => true, 'apiKey' => ' secret ', 'other' => 'ignored']);

		$this->assertSame(Http::STATUS_ACCEPTED, $response->getStatus());
		$this->assertSame('import1', $response->getData()['id']);
		$this->assertSame('queued', $response->getData()['state']);
		$this->assertSame('/Takeout', $response->getData()['folder']);
		$this->assertStringNotContainsString('secret', json_encode($response->getData()));
		$this->assertStringNotContainsString('secret', json_encode($this->config));
	}

	public function testStartRejectsAnUnknownImporter(): void {
		$this->jobList->expects($this->never())->method('add');

		$this->assertSame(Http::STATUS_NOT_FOUND, $this->createController()->start('unknown', '/Takeout')->getStatus());
	}

	public function testStartRejectsAFolderOutsideTheFilesOfTheUser(): void {
		$this->userFolder->method('get')->willReturnCallback(fn (string $path) => match ($path) {
			'/../bob/files' => throw new NotPermittedException(),
			'/shared' => $this->createFolder('/bob/files/shared'),
			'/photo.jpg' => $this->createMock(File::class),
		});
		$this->jobList->expects($this->never())->method('add');

		$controller = $this->createController();
		foreach (['/../bob/files', '/shared', '/photo.jpg'] as $path) {
			$response = $controller->start('service', $path);
			$this->assertSame(Http::STATUS_BAD_REQUEST, $response->getStatus(), $path);
		}
		$this->assertSame([], $this->config);
	}

	public function testStartRejectsInvalidOptions(): void {
		$this->userFolder->method('get')->willReturn($this->createFolder('/alice/files/Takeout'));
		$this->importer->method('validateOptions')->willThrowException(new ImportException('Invalid server address'));
		$this->jobList->expects($this->never())->method('add');

		$response = $this->createController()->start('service', '/Takeout');

		$this->assertSame(Http::STATUS_BAD_REQUEST, $response->getStatus());
		$this->assertSame('Invalid server address', $response->getData()['message']);
	}

	public function testStartRejectsASecondImportWhileOneIsActive(): void {
		$this->userFolder->method('get')->willReturn($this->createFolder('/alice/files/Takeout'));
		$this->jobList->expects($this->once())->method('add');

		$controller = $this->createController();
		$this->assertSame(Http::STATUS_ACCEPTED, $controller->start('service', '/Takeout')->getStatus());
		$this->assertSame(Http::STATUS_CONFLICT, $controller->start('service', '/Takeout')->getStatus());
		$this->assertSame('import1', $this->config['alice']['id']);
	}

	public function testStartReplacesAFinishedOrStaleImport(): void {
		$this->userFolder->method('get')->willReturn($this->createFolder('/alice/files/Takeout'));
		$this->jobList->expects($this->exactly(2))->method('add');

		$controller = $this->createController();
		foreach ([
			['state' => 'done', 'updatedAt' => self::NOW],
			['state' => 'running', 'updatedAt' => self::NOW - ImportManager::STALE_AFTER],
		] as $previous) {
			$this->config['alice'] = [...$this->storedStatus(), ...$previous];
			$this->assertSame(Http::STATUS_ACCEPTED, $controller->start('service', '/Takeout')->getStatus());
		}
	}

	private function storedStatus(): array {
		return [
			'id' => 'import0',
			'provider' => 'service',
			'folder' => '/Takeout',
			'dryRun' => true,
			'state' => 'done',
			'processed' => 4,
			'counts' => ['media' => 4, 'updated' => 1, 'no_sidecar' => 3, 'unknown' => 1],
			'examples' => [['Takeout/a.jpg', 'no_sidecar']],
			'error' => null,
			'updatedAt' => self::NOW,
		];
	}

	public function testStatusReturnsTheSummary(): void {
		$this->config['alice'] = $this->storedStatus();

		$response = $this->createController()->status('import0');

		$this->assertSame(Http::STATUS_OK, $response->getStatus());
		$this->assertSame([
			'id' => 'import0',
			'provider' => 'service',
			'folder' => '/Takeout',
			'dryRun' => true,
			'state' => 'done',
			'processed' => 4,
			'found' => [['label' => 'Media files', 'count' => 4]],
			'changed' => [['label' => 'Updated', 'count' => 1]],
			'skipped' => [['label' => 'No sidecar', 'count' => 3]],
			'examples' => [['path' => 'Takeout/a.jpg', 'reason' => 'No sidecar']],
			'error' => null,
		], $response->getData());
	}

	public function testStatusReportsAStaleImportAsFailed(): void {
		$this->config['alice'] = [...$this->storedStatus(), 'state' => 'running', 'updatedAt' => self::NOW - ImportManager::STALE_AFTER];

		$data = $this->createController()->status('import0')->getData();

		$this->assertSame('failed', $data['state']);
		$this->assertNotNull($data['error']);
	}

	public function testStatusIsOnlyFoundForTheLastImportOfTheUser(): void {
		$this->config['alice'] = $this->storedStatus();
		$this->config['bob'] = [...$this->storedStatus(), 'id' => 'import9'];

		$this->assertSame(Http::STATUS_NOT_FOUND, $this->createController()->status('import9')->getStatus());
		$this->assertSame(Http::STATUS_NOT_FOUND, $this->createController(null)->status('import0')->getStatus());
	}
}
