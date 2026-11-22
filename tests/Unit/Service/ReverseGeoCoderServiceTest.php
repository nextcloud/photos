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
	/** Rows of the GeoNames cities list: id, name, latitude, longitude, country, feature code, population. */
	private const CITIES = [
		['2988507', 'Paris', 48.85341, 2.3488, 'FR', 'PPLC', 2138551],
		['2970761', 'Vanves', 48.82345, 2.29025, 'FR', 'PPL', 26068],
		['3031137', 'Boulogne-Billancourt', 48.83545, 2.24128, 'FR', 'PPLA3', 108782],
		['2969679', 'Versailles', 48.80359, 2.13424, 'FR', 'PPLA2', 85416],
		['2973783', 'Strasbourg', 48.58392, 7.74553, 'FR', 'PPLA', 274845],
		['2950159', 'Berlin', 52.52437, 13.41053, 'DE', 'PPLC', 3426354],
		['2852458', 'Potsdam', 52.39886, 13.06566, 'DE', 'PPLA', 182112],
		['2891951', 'Kehl', 48.57297, 7.81523, 'DE', 'PPL', 34009],
		['1850147', 'Tokyo', 35.6895, 139.69171, 'JP', 'PPLC', 8336599],
		['8715035', 'Nakano', 35.70449, 139.66946, 'JP', 'PPLX', 344880],
		['3413829', 'Reykjavík', 64.13548, -21.89541, 'IS', 'PPLC', 118918],
		['3415212', 'Kópavogur', 64.11234, -21.91298, 'IS', 'PPL', 37959],
		['3416706', 'Hafnarfjörður', 64.0671, -21.93774, 'IS', 'PPL', 29971],
		['2267057', 'Lisbon', 38.71667, -9.13333, 'PT', 'PPLC', 517802],
		['2262912', 'Sintra', 38.80097, -9.37826, 'PT', 'PPLA2', 26193],
		['5391959', 'San Francisco', 37.77493, -122.41942, 'US', 'PPLA2', 864816],
		['5378538', 'Oakland', 37.80437, -122.2708, 'US', 'PPLA2', 419267],
		['2747373', 'The Hague', 52.07667, 4.29861, 'NL', 'PPLG', 474292],
		['2757345', 'Delft', 52.00667, 4.35556, 'NL', 'PPL', 95060],
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
			fn (array $city): string => implode("\t", [$city[0], $city[1], $city[1], '', $city[2], $city[3], 'P', $city[5], $city[4], '', '', '', '', '', $city[6], '', '', '', '']),
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
	 * Write the cities list as it was cached when it had the given number of columns.
	 */
	private function writeOutdatedCities(int $columns = 4): void {
		$rows = array_map(fn (array $city): string => implode(',', array_slice($city, 0, $columns)), self::CITIES);
		file_put_contents($this->folderPath . '/cities1000.csv', implode("\n", $rows) . "\n");
	}

	public static function dataCoordinatesInACity(): array {
		return [
			'Nakano, a ward of Tokyo' => [35.7074, 139.6638, 'Tokyo', 'JP'],
			'Vanves, a suburb next to Paris' => [48.8214, 2.2897, 'Paris', 'FR'],
			'the Eiffel Tower, nearer to Vanves than to the centre of Paris' => [48.8584, 2.2945, 'Paris', 'FR'],
			'Kópavogur, a suburb next to Reykjavík' => [64.1010, -21.8830, 'Reykjavík', 'IS'],
			'the centre of Berlin' => [52.5163, 13.3777, 'Berlin', 'DE'],
		];
	}

	/**
	 * @dataProvider dataCoordinatesInACity
	 */
	public function testAttributesCoordinatesToTheCityReachingThem(float $latitude, float $longitude, string $name, string $countryCode): void {
		$this->expectDownloads(1);

		$this->assertSame(
			['name' => $name, 'countryCode' => $countryCode],
			$this->service->getPlaceForCoordinates($latitude, $longitude),
		);
	}

	public static function dataCoordinatesOutsideOfTheNextCity(): array {
		return [
			'Potsdam, a city of its own 26 km from Berlin' => [52.4042, 13.0385, 'Potsdam', 'DE'],
			'Babelsberg, the part of Potsdam facing Berlin' => [52.3936, 13.0940, 'Potsdam', 'DE'],
			'Sintra, a town 22 km from Lisbon' => [38.7876, -9.3906, 'Sintra', 'PT'],
			'Oakland, a city across the bay from San Francisco' => [37.7955, -122.2775, 'Oakland', 'US'],
			'Versailles, a town beyond the reach of Paris' => [48.8049, 2.1204, 'Versailles', 'FR'],
			'Delft, a town beyond the reach of The Hague' => [52.0116, 4.3571, 'Delft', 'NL'],
			'Hafnarfjörður, a town beyond the reach of Reykjavík' => [64.0671, -21.9377, 'Hafnarfjörður', 'IS'],
			'Boulogne-Billancourt, a city of its own next to Paris' => [48.8352, 2.2410, 'Boulogne-Billancourt', 'FR'],
			'Kehl, across the border from Strasbourg' => [48.5735, 7.8115, 'Kehl', 'DE'],
		];
	}

	/**
	 * @dataProvider dataCoordinatesOutsideOfTheNextCity
	 */
	public function testKeepsSeparatePlaces(float $latitude, float $longitude, string $name, string $countryCode): void {
		$this->expectDownloads(1);

		$this->assertSame(
			['name' => $name, 'countryCode' => $countryCode],
			$this->service->getPlaceForCoordinates($latitude, $longitude),
		);
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

	public function testRefreshesACitiesListWithoutPopulations(): void {
		$this->writeOutdatedCities(5);
		$this->expectDownloads(1);

		$this->assertSame(
			['name' => 'Paris', 'countryCode' => 'FR'],
			$this->service->getPlaceForCoordinates(48.8214, 2.2897),
		);
	}

	public function testFallsBackToTheNearestPlaceWhenTheCitiesListCannotBeRefreshed(): void {
		$this->writeOutdatedCities(5);
		$this->client->expects($this->once())->method('get')->willThrowException(new \Exception('offline'));
		$this->logger->expects($this->once())->method('warning');

		$this->assertSame(
			['name' => 'Vanves', 'countryCode' => 'FR'],
			$this->service->getPlaceForCoordinates(48.8214, 2.2897),
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
