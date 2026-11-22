<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Import;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Import\ImmichImporter;
use OCA\Photos\Import\ImportException;
use OCA\Photos\Import\ImportReport;
use OCA\Photos\Service\ImmichApiService;
use OCP\Files\Folder;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\Http\Client\IClient;
use OCP\Http\Client\IClientService;
use OCP\Http\Client\IResponse;
use OCP\Http\Client\LocalServerException;
use OCP\IGroupManager;
use OCP\IL10N;
use OCP\ITagManager;
use OCP\Security\IRemoteHostValidator;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class ImmichImporterTest extends TestCase {
	private const OPTIONS = ['url' => 'http://192.168.1.20:2283', 'apiKey' => 'secret-key'];

	private IClient&MockObject $client;
	private IRemoteHostValidator&MockObject $remoteHostValidator;
	private ImmichImporter $importer;

	/** @var list<array> Options of the HTTP requests */
	private array $requestOptions = [];
	private ?\Exception $requestException = null;

	protected function setUp(): void {
		parent::setUp();

		$this->client = $this->createMock(IClient::class);
		$this->client->method('get')->willReturnCallback(function (string $url, array $options): IResponse {
			$this->requestOptions[] = $options;
			if ($this->requestException !== null) {
				throw $this->requestException;
			}
			return $this->response([['id' => 'a1', 'albumName' => 'Summer']]);
		});
		$this->client->method('post')->willReturnCallback(function (string $url, array $options): IResponse {
			$this->requestOptions[] = $options;
			return $this->response(['assets' => ['items' => [], 'nextPage' => null]]);
		});
		$clientService = $this->createMock(IClientService::class);
		$clientService->method('newClient')->willReturn($this->client);

		$groupManager = $this->createMock(IGroupManager::class);
		$groupManager->method('isAdmin')->willReturnCallback(fn (string $userId): bool => $userId === 'admin');

		$this->remoteHostValidator = $this->createMock(IRemoteHostValidator::class);

		$l10n = $this->createMock(IL10N::class);
		$l10n->method('t')->willReturnCallback(fn (string $text, array $parameters = []): string => vsprintf($text, $parameters));

		$this->importer = new ImmichImporter(
			$this->createMock(IFilesMetadataManager::class),
			$this->createMock(ITagManager::class),
			$this->createMock(AlbumMapper::class),
			new ImmichApiService($clientService),
			$groupManager,
			$this->remoteHostValidator,
			$l10n,
		);
	}

	private function response(array $data): IResponse {
		$response = $this->createMock(IResponse::class);
		$response->method('getStatusCode')->willReturn(200);
		$response->method('getBody')->willReturn(json_encode($data));
		return $response;
	}

	private function import(string $userId): ImportReport {
		$folder = $this->createMock(Folder::class);
		$folder->method('getDirectoryListing')->willReturn([]);
		$report = new ImportReport();
		$this->importer->import($userId, $folder, self::OPTIONS, true, $report);
		return $report;
	}

	public static function dataInvalidOptions(): array {
		return [
			'no url' => [['apiKey' => 'secret-key'], 'Enter the address'],
			'file url' => [['url' => 'file:///etc/passwd', 'apiKey' => 'secret-key'], 'Enter the address'],
			'no api key' => [['url' => 'https://immich.example.com', 'apiKey' => ''], 'Enter an Immich API key'],
		];
	}

	/**
	 * @dataProvider dataInvalidOptions
	 */
	public function testRejectsInvalidOptions(array $options, string $message): void {
		$this->remoteHostValidator->method('isValid')->willReturn(true);

		$this->expectException(ImportException::class);
		$this->expectExceptionMessage($message);
		$this->importer->validateOptions('alice', $options);
	}

	public function testRejectsLocalAddressesForUsers(): void {
		$this->remoteHostValidator->expects($this->once())->method('isValid')->with('192.168.1.20')->willReturn(false);

		$this->expectException(ImportException::class);
		$this->expectExceptionMessage('local network');
		$this->importer->validateOptions('alice', self::OPTIONS);
	}

	public function testAllowsPublicAddressesForUsers(): void {
		$this->remoteHostValidator->expects($this->once())->method('isValid')->with('immich.example.com')->willReturn(true);

		$this->importer->validateOptions('alice', ['url' => 'https://immich.example.com', 'apiKey' => 'secret-key']);
	}

	public function testUserRequestsKeepTheLocalAddressProtection(): void {
		$this->remoteHostValidator->method('isValid')->willReturn(true);

		$report = $this->import('alice');

		$this->assertSame(1, $report->get('albums'));
		$this->assertCount(3, $this->requestOptions);
		foreach ($this->requestOptions as $options) {
			$this->assertArrayNotHasKey('nextcloud', $options);
			$this->assertFalse($options['allow_redirects']);
			$this->assertSame('secret-key', $options['headers']['x-api-key']);
		}
	}

	public function testAdministratorsMayReachTheLocalNetwork(): void {
		$this->remoteHostValidator->expects($this->never())->method('isValid');

		$this->import('admin');

		$this->assertNotEmpty($this->requestOptions);
		foreach ($this->requestOptions as $options) {
			$this->assertTrue($options['nextcloud']['allow_local_address']);
		}
	}

	public function testReportsAddressesRefusedByTheHttpClient(): void {
		$this->remoteHostValidator->method('isValid')->willReturn(true);
		$this->requestException = new LocalServerException('Host "immich.example.com" violates local access rules');

		try {
			$this->import('alice');
			$this->fail('The import should fail');
		} catch (ImportException $e) {
			$this->assertStringContainsString('local network', $e->getMessage());
			$this->assertStringNotContainsString('secret-key', $e->getMessage());
		}
	}
}
