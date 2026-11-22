<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Service;

use OCA\Photos\Service\ImmichApiService;
use OCP\Http\Client\IClient;
use OCP\Http\Client\IClientService;
use OCP\Http\Client\IResponse;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class ImmichApiServiceTest extends TestCase {
	private const API_URL = 'https://immich.example.com/api';

	private IClient&MockObject $client;
	private ImmichApiService $service;

	protected function setUp(): void {
		parent::setUp();

		$this->client = $this->createMock(IClient::class);
		$clientService = $this->createMock(IClientService::class);
		$clientService->method('newClient')->willReturn($this->client);

		$this->service = new ImmichApiService($clientService);
	}

	private function response(mixed $data, int $status = 200): IResponse&MockObject {
		$response = $this->createMock(IResponse::class);
		$response->method('getStatusCode')->willReturn($status);
		$response->method('getBody')->willReturn(is_string($data) ? $data : json_encode($data));

		return $response;
	}

	/**
	 * @param array<string, mixed> $overrides
	 */
	private static function asset(string $name, array $overrides = []): array {
		return [
			'id' => '5a1f2b3c-0000-4000-8000-000000000001',
			'originalFileName' => $name,
			'fileCreatedAt' => '2023-06-04T10:11:12.345Z',
			'localDateTime' => '2023-06-04T12:11:12.345Z',
			'fileModifiedAt' => '2023-06-05T08:00:00.000Z',
			'isFavorite' => false,
			'isTrashed' => false,
			'exifInfo' => ['dateTimeOriginal' => '2023-06-04T10:11:12.345+00:00'],
			...$overrides,
		];
	}

	public static function dataGetApiUrl(): array {
		return [
			['https://immich.example.com', 'https://immich.example.com/api'],
			['https://immich.example.com/', 'https://immich.example.com/api'],
			['http://192.168.1.20:2283', 'http://192.168.1.20:2283/api'],
			['https://example.com/immich/api/', 'https://example.com/immich/api'],
			[' HTTPS://immich.example.com ', 'HTTPS://immich.example.com/api'],
			['ftp://immich.example.com', null],
			['immich.example.com', null],
			['file:///etc/passwd', null],
			['https://user:secret@immich.example.com', null],
			['https://immich.example.com/?redirect=elsewhere', null],
			['https://immich.example.com/#fragment', null],
			['', null],
		];
	}

	/**
	 * @dataProvider dataGetApiUrl
	 */
	public function testGetApiUrl(string $url, ?string $expected): void {
		$this->assertSame($expected, $this->service->getApiUrl($url));
	}

	public function testGetAlbums(): void {
		$this->client->expects($this->once())->method('get')
			->with(self::API_URL . '/albums', $this->callback(function (array $options): bool {
				$this->assertSame('secret-key', $options['headers']['x-api-key']);
				$this->assertSame(ImmichApiService::TIMEOUT, $options['timeout']);
				$this->assertFalse($options['allow_redirects']);
				$this->assertArrayNotHasKey('nextcloud', $options);
				return true;
			}))
			->willReturn($this->response([
				['id' => 'a1', 'albumName' => 'Summer', 'assetCount' => 2],
				['id' => 'a2', 'albumName' => 'Été à Paris', 'assetCount' => 0],
				['id' => 'a3'],
				'invalid',
			]));

		$this->assertSame([
			['id' => 'a1', 'name' => 'Summer'],
			['id' => 'a2', 'name' => 'Été à Paris'],
		], $this->service->getAlbums(self::API_URL, 'secret-key'));
	}

	public function testAllowsLocalAddressesOnlyWhenAsked(): void {
		$this->client->expects($this->once())->method('post')
			->with(self::API_URL . '/search/metadata', $this->callback(fn (array $options): bool => $options['nextcloud']['allow_local_address'] === true))
			->willReturn($this->response(['assets' => ['items' => [], 'nextPage' => null]]));

		$this->assertSame([], $this->service->getFavoriteAssets(self::API_URL, 'secret-key', true));
	}

	public function testGetAlbumAssetsFollowsPages(): void {
		$bodies = [];
		$this->client->expects($this->exactly(2))->method('post')
			->with(self::API_URL . '/search/metadata', $this->anything())
			->willReturnCallback(function (string $url, array $options) use (&$bodies): IResponse {
				$bodies[] = $options['json'];
				return count($bodies) === 1
					? $this->response(['albums' => [], 'assets' => ['items' => [self::asset('IMG_0001.JPG')], 'nextPage' => '2']])
					: $this->response(['albums' => [], 'assets' => ['items' => [
						self::asset('IMG_0002.MOV', ['exifInfo' => null, 'localDateTime' => '2023-06-04T10:11:12.345Z']),
						self::asset('IMG_0003.JPG', ['isTrashed' => true]),
						self::asset('', []),
						['id' => 'no-name'],
					], 'nextPage' => null]]);
			});

		$assets = $this->service->getAlbumAssets(self::API_URL, 'secret-key', 'a1');

		$this->assertSame([
			['name' => 'IMG_0001.JPG', 'times' => [1685873472, 1685880672, 1685952000]],
			['name' => 'IMG_0002.MOV', 'times' => [1685873472, 1685952000]],
		], $assets);
		$this->assertSame(['albumIds' => ['a1'], 'page' => 1, 'size' => 1000, 'withExif' => true], $bodies[0]);
		$this->assertSame(2, $bodies[1]['page']);
	}

	public function testGetFavoriteAssetsStopsOnInvalidNextPage(): void {
		$this->client->expects($this->once())->method('post')
			->with(self::API_URL . '/search/metadata', $this->callback(fn (array $options): bool => $options['json']['isFavorite'] === true))
			->willReturn($this->response(['assets' => ['items' => [self::asset('IMG_0001.JPG')], 'nextPage' => '1']]));

		$this->assertCount(1, $this->service->getFavoriteAssets(self::API_URL, 'secret-key'));
	}

	public function testRejectsInvalidResponses(): void {
		$this->client->method('get')->willReturn($this->response('<html>Login</html>'));

		$this->expectException(\RuntimeException::class);
		$this->expectExceptionMessage('invalid response');
		$this->service->getAlbums(self::API_URL, 'secret-key');
	}

	public function testRejectsUnexpectedStatus(): void {
		$this->client->method('get')->willReturn($this->response([], 302));

		$this->expectException(\RuntimeException::class);
		$this->expectExceptionMessage('status 302');
		$this->service->getAlbums(self::API_URL, 'secret-key');
	}

	public static function dataIsSameTime(): array {
		$asset = ['name' => 'IMG_0001.JPG', 'times' => [1685873472, 1685880672]];
		return [
			'utc' => [$asset, 1685873472, true],
			'local time' => [$asset, 1685880672, true],
			'within a second' => [$asset, 1685873473, true],
			'other time' => [$asset, 1685873480, false],
			'no times' => [['name' => 'IMG_0001.JPG', 'times' => []], 1685873472, false],
		];
	}

	/**
	 * @dataProvider dataIsSameTime
	 */
	public function testIsSameTime(array $asset, int $takenAt, bool $expected): void {
		$this->assertSame($expected, $this->service->isSameTime($asset, $takenAt));
	}
}
