<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Service;

use OCA\Photos\Service\ReverseGeoCoderService;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;
use OCP\Http\Client\IClient;
use OCP\Http\Client\IClientService;
use OCP\Http\Client\IResponse;
use OCP\IConfig;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class ReverseGeoCoderServiceTest extends TestCase {
	private const CITIES = [
		['2988507', 'Paris', 48.85341, 2.3488, 'FR'],
		['2950159', 'Berlin', 52.52437, 13.41053, 'DE'],
	];

	private string $folderPath;
	private IClient&MockObject $client;
	private LoggerInterface&MockObject $logger;
	private ReverseGeoCoderService $service;

	protected function setUp(): void {
		parent::setUp();

		$this->folderPath = sys_get_temp_dir() . '/photos-geonames-' . bin2hex(random_bytes(6));
		mkdir($this->folderPath);

		$this->client = $this->createMock(IClient::class);
		$clientService = $this->createMock(IClientService::class);
		$clientService->method('newClient')->willReturn($this->client);

		$config = $this->createMock(IConfig::class);
		$config->method('getSystemValueBool')->willReturn(true);
		$config->method('getAppValue')->willReturn('0');

		$appData = $this->createMock(IAppData::class);
		$appData->method('getFolder')->with('geonames')->willReturn($this->createFolder());

		$this->logger = $this->createMock(LoggerInterface::class);

		$this->service = new ReverseGeoCoderService($appData, $clientService, $config, $this->logger);
	}

	protected function tearDown(): void {
		array_map('unlink', glob($this->folderPath . '/*') ?: []);
		rmdir($this->folderPath);

		parent::tearDown();
	}

	/**
	 * A folder storing its files in a local directory.
	 */
	private function createFolder(): ISimpleFolder {
		$folder = $this->createMock(ISimpleFolder::class);
		$folder->method('fileExists')->willReturnCallback(fn (string $name): bool => file_exists($this->folderPath . '/' . $name));
		$folder->method('getFile')->willReturnCallback(function (string $name): ISimpleFile {
			if (!file_exists($this->folderPath . '/' . $name)) {
				throw new NotFoundException();
			}
			return $this->createFile($name);
		});
		$folder->method('newFile')->willReturnCallback(function (string $name, $content = null): ISimpleFile {
			file_put_contents($this->folderPath . '/' . $name, $content ?? '');
			return $this->createFile($name);
		});

		return $folder;
	}

	private function createFile(string $name): ISimpleFile {
		$path = $this->folderPath . '/' . $name;
		$file = $this->createMock(ISimpleFile::class);
		$file->method('getContent')->willReturnCallback(fn (): string => file_get_contents($path));
		$file->method('read')->willReturnCallback(fn () => fopen($path, 'r'));
		$file->method('write')->willReturnCallback(fn () => fopen($path, 'w'));

		return $file;
	}

	/**
	 * The GeoNames cities archive, holding the given cities.
	 */
	private static function citiesArchive(): string {
		$rows = array_map(
			fn (array $city): string => implode("\t", [$city[0], $city[1], $city[1], '', $city[2], $city[3], 'P', 'PPLC', $city[4], '', '']),
			self::CITIES,
		);

		$zipPath = tempnam(sys_get_temp_dir(), 'photos-cities');
		$zip = new \ZipArchive();
		$zip->open($zipPath, \ZipArchive::OVERWRITE);
		$zip->addFromString('cities1000.txt', implode("\n", $rows) . "\n");
		$zip->close();
		$content = file_get_contents($zipPath);
		unlink($zipPath);

		return $content;
	}

	private function expectDownloads(int $count): void {
		$response = $this->createMock(IResponse::class);
		$response->method('getBody')->willReturn(self::citiesArchive());
		$this->client->expects($this->exactly($count))->method('get')->willReturn($response);
	}

	/**
	 * Write the cities list cached before the country codes were stored.
	 */
	private function writeOutdatedCities(): void {
		$rows = array_map(fn (array $city): string => implode(',', array_slice($city, 0, 4)), self::CITIES);
		file_put_contents($this->folderPath . '/cities1000.csv', implode("\n", $rows) . "\n");
	}

	public function testFindsTheNearestCityWithItsCountry(): void {
		$this->expectDownloads(1);

		$this->assertSame(
			['name' => 'Paris', 'countryCode' => 'FR'],
			$this->service->getPlaceForCoordinates(48.8583, 2.2945),
		);
		$this->assertSame(
			['name' => 'Berlin', 'countryCode' => 'DE'],
			$this->service->getPlaceForCoordinates(52.5, 13.4),
		);
	}

	public function testRefreshesACitiesListWithoutCountries(): void {
		$this->writeOutdatedCities();
		$this->expectDownloads(1);

		$this->assertSame(
			['name' => 'Berlin', 'countryCode' => 'DE'],
			$this->service->getPlaceForCoordinates(52.5, 13.4),
		);
	}

	public function testKeepsTheCitiesListWithoutCountriesWhenItCannotBeRefreshed(): void {
		$this->writeOutdatedCities();
		$this->client->expects($this->once())->method('get')->willThrowException(new \Exception('offline'));
		$this->logger->expects($this->once())->method('warning');

		$this->assertSame(
			['name' => 'Berlin', 'countryCode' => ''],
			$this->service->getPlaceForCoordinates(52.5, 13.4),
		);
	}
}
