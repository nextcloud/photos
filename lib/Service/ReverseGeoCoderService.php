<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use Hexogen\KDTree\FSKDTree;
use Hexogen\KDTree\FSTreePersister;
use Hexogen\KDTree\Item;
use Hexogen\KDTree\ItemFactory;
use Hexogen\KDTree\ItemList;
use Hexogen\KDTree\KDTree;
use Hexogen\KDTree\NearestSearch;
use Hexogen\KDTree\Point;
use OCA\Photos\AppInfo\Application;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFolder;
use OCP\Http\Client\IClientService;
use OCP\IConfig;
use Psr\Log\LoggerInterface;

class ReverseGeoCoderService {
	public const CONFIG_DISABLE_PLACES = 'disable_places';
	/** Number of inhabitants from which a place is a city that photos taken around it are attributed to. */
	private const MAJOR_CITY_MIN_POPULATION = 100000;
	/** Inhabitants per square kilometre a city is taken to have when estimating how far it reaches. */
	private const MAJOR_CITY_DENSITY = 2500.0;
	/** Bounds, in kilometres, of the estimated reach of a city. */
	private const MAJOR_CITY_MIN_REACH = 5.0;
	private const MAJOR_CITY_MAX_REACH = 15.0;
	/** GeoNames feature code of a section of a populated place, such as a ward or a borough. */
	private const FEATURE_CODE_SECTION = 'PPLX';
	private const EARTH_RADIUS = 6371.0;
	/** Number of columns of the cached cities list. */
	private const CITIES_COLUMNS = 7;
	private ?ISimpleFolder $geoNameFolderCache = null;
	private ?NearestSearch $fsSearcher = null;
	/** @var array<int, string> */
	private ?array $citiesMapping = null;
	/** @var array<int, string> */
	private ?array $countryCodesMapping = null;
	/** @var list<array{id: int, latitude: float, longitude: float, countryCode: string, reach: float}> */
	private ?array $majorCities = null;

	public function __construct(
		private readonly IAppData $appData,
		private readonly IClientService $clientService,
		private readonly IConfig $config,
		private readonly LoggerInterface $logger,
	) {
	}

	/**
	 * The city the coordinates are in, with the ISO 3166-1 alpha-2 code of its
	 * country, or an empty code when the cities list carries none.
	 *
	 * The cities list also holds suburbs and districts, so the nearest entry is
	 * often not the city a photo is associated with. Every city of at least
	 * 100 000 inhabitants that is not itself a section of another place is
	 * therefore given a reach: the radius of a disc holding its population at
	 * 2 500 inhabitants per km², kept between 5 and 15 km. The coordinates
	 * belong to the city whose reach covers them, and to the one they lie
	 * deepest in, relative to its reach, when several do. That keeps a large
	 * city next to a metropolis (Oakland, Potsdam) and a town beyond its reach
	 * (Sintra, Versailles) themselves. Cities of another country than the
	 * nearest entry are left out, and the nearest entry is used when no city
	 * reaches the coordinates.
	 *
	 * @return array{name: string, countryCode: string}
	 */
	public function getPlaceForCoordinates(float $latitude, float $longitude): array {
		$this->loadKdTree();
		$result = $this->fsSearcher->search(new Point([$latitude, $longitude]), 1);
		$nearestPlace = $this->getPlaceForPlaceId($result[0]->getId());
		$majorCityId = $this->getMajorCityAround($latitude, $longitude, $nearestPlace['countryCode']);

		return $majorCityId === null ? $nearestPlace : $this->getPlaceForPlaceId($majorCityId);
	}

	/**
	 * The id of the city of the given country reaching the coordinates, the one
	 * they lie deepest in when several do.
	 */
	private function getMajorCityAround(float $latitude, float $longitude, string $countryCode): ?int {
		$this->loadCities();
		$kilometresPerDegree = self::EARTH_RADIUS * M_PI / 180.0;
		$bestId = null;
		$bestDepth = 1.0;

		foreach ($this->majorCities as $city) {
			if ((float)abs($city['latitude'] - $latitude) * $kilometresPerDegree > $city['reach'] || $city['countryCode'] !== $countryCode) {
				continue;
			}

			$depth = self::distance($latitude, $longitude, $city['latitude'], $city['longitude']) / $city['reach'];
			if ($depth <= $bestDepth) {
				$bestId = $city['id'];
				$bestDepth = $depth;
			}
		}

		return $bestId;
	}

	/**
	 * Great-circle distance in kilometres.
	 */
	private static function distance(float $latitudeA, float $longitudeA, float $latitudeB, float $longitudeB): float {
		$latitudeSine = sin(deg2rad($latitudeB - $latitudeA) / 2.0);
		$longitudeSine = sin(deg2rad($longitudeB - $longitudeA) / 2.0);
		$a = $latitudeSine * $latitudeSine + cos(deg2rad($latitudeA)) * cos(deg2rad($latitudeB)) * $longitudeSine * $longitudeSine;

		return 2.0 * self::EARTH_RADIUS * asin(min(1.0, sqrt($a)));
	}

	private function geoNameFolder(): ISimpleFolder {
		if ($this->geoNameFolderCache === null) {
			try {
				$this->geoNameFolderCache = $this->appData->getFolder('geonames');
			} catch (NotFoundException) {
				$this->geoNameFolderCache = $this->appData->newFolder('geonames');
			}
		}

		return $this->geoNameFolderCache;
	}

	/**
	 * Read the names, the countries and the major cities from the cities list.
	 */
	private function loadCities(): void {
		if ($this->citiesMapping !== null && $this->countryCodesMapping !== null && $this->majorCities !== null) {
			return;
		}

		$this->downloadCities1000();
		$this->citiesMapping = [];
		$this->countryCodesMapping = [];
		$this->majorCities = [];
		foreach ($this->loadCities1000() as $city) {
			$this->citiesMapping[$city['id']] = $city['name'];
			$this->countryCodesMapping[$city['id']] = $city['countryCode'];

			if ($city['population'] < self::MAJOR_CITY_MIN_POPULATION || $city['featureCode'] === self::FEATURE_CODE_SECTION) {
				continue;
			}

			$reach = sqrt((float)$city['population'] / (M_PI * self::MAJOR_CITY_DENSITY));
			$this->majorCities[] = [
				'id' => $city['id'],
				'latitude' => $city['latitude'],
				'longitude' => $city['longitude'],
				'countryCode' => $city['countryCode'],
				'reach' => max(self::MAJOR_CITY_MIN_REACH, min(self::MAJOR_CITY_MAX_REACH, $reach)),
			];
		}
	}

	/**
	 * @return array{name: string, countryCode: string}
	 */
	private function getPlaceForPlaceId(int $placeId): array {
		$this->loadCities();

		return [
			'name' => $this->citiesMapping[$placeId],
			'countryCode' => $this->countryCodesMapping[$placeId],
		];
	}

	public function arePlacesEnabled(): bool {
		if (!$this->config->getSystemValueBool('has_internet_connection', true)) {
			/* This feature cannot work without internet access */
			return false;
		}
		return ($this->config->getAppValue(Application::APP_ID, self::CONFIG_DISABLE_PLACES, '0') !== '1');
	}

	private function downloadCities1000(bool $force = false): void {
		if (!$this->arePlacesEnabled() || ($this->geoNameFolder()->fileExists('cities1000.csv') && !$force)) {
			return;
		}

		$response = $this->clientService->newClient()->get('https://download.nextcloud.com/server/apps/photos/cities1000.zip');
		$tmpFile = tmpfile();
		$cities1000ZipTmpFileName = stream_get_meta_data($tmpFile)['uri'];
		fclose($tmpFile);
		file_put_contents($cities1000ZipTmpFileName, $response->getBody());

		// Unzip the txt file into a stream.
		$zip = new \ZipArchive;
		$res = $zip->open($cities1000ZipTmpFileName);
		if ($res !== true) {
			unlink($cities1000ZipTmpFileName);
			throw new \Exception("Failed to unzip place file: $res", $res);
		}

		$cities1000TxtStream = $zip->getStream('cities1000.txt');
		if ($cities1000TxtStream === false) {
			$zip->close();
			unlink($cities1000ZipTmpFileName);
			throw new \Exception("Could not extract 'cities1000.txt' from ZIP archive.");
		}

		// Dump the txt file info into a smaller csv file.
		$destinationStream = $this->geoNameFolder()->newFile('cities1000.csv')->write();
		if ($destinationStream === false || !is_resource($destinationStream)) {
			fclose($cities1000TxtStream);
			$zip->close();
			unlink($cities1000ZipTmpFileName);
			throw new \Exception('Failed to open destination stream for cities1000.csv');
		}

		try {
			while (($fields = fgetcsv($cities1000TxtStream, 0, "\t")) !== false) {
				if (count($fields) < 15) {
					throw new \Exception('Malformed cities1000.txt row: expected at least 15 fields, got ' . count($fields));
				}
				$result = fputcsv(
					$destinationStream,
					[
						'id' => (int)$fields[0],
						'name' => $fields[1],
						'latitude' => (float)$fields[4],
						'longitude' => (float)$fields[5],
						'countryCode' => $fields[8],
						'population' => (int)$fields[14],
						'featureCode' => $fields[7],
					]
				);
				if ($result === false) {
					throw new \Exception('Failed to write csv line to tmp stream');
				}
			}
		} finally {
			fclose($cities1000TxtStream);
			fclose($destinationStream);
			$zip->close();
			unlink($cities1000ZipTmpFileName);
		}
	}

	/**
	 * The rows of the cached cities list, one at a time as the list is too
	 * large to be held in memory along with what is built from it. A list
	 * cached before a column was added yields the default for that column.
	 *
	 * @return \Generator<int, array{id: int, name: string, latitude: float, longitude: float, countryCode: string, population: int, featureCode: string}>
	 */
	private function loadCities1000(): \Generator {
		$csvStream = $this->geoNameFolder()->getFile('cities1000.csv')->read();
		if ($csvStream === false || !is_resource($csvStream)) {
			throw new \Exception('Failed to open cities1000.csv for reading.');
		}

		try {
			while (($fields = fgetcsv($csvStream, 0, ',', '"', '\\')) !== false) {
				if (count($fields) < 4) {
					throw new \Exception('Malformed cities1000.csv row: expected at least 4 fields, got ' . count($fields));
				}
				yield [
					'id' => (int)$fields[0],
					'name' => $fields[1],
					'latitude' => (float)$fields[2],
					'longitude' => (float)$fields[3],
					'countryCode' => $fields[4] ?? '',
					'population' => (int)($fields[5] ?? 0),
					'featureCode' => $fields[6] ?? '',
				];
			}
		} finally {
			fclose($csvStream);
		}
	}

	public function buildKDTree($force = false): void {
		if ($this->geoNameFolder()->fileExists('cities1000.bin') && !$force) {
			return;
		}

		$this->downloadCities1000($force);
		$itemList = new ItemList(2);
		foreach ($this->loadCities1000() as $city) {
			$itemList->addItem(new Item($city['id'], [$city['latitude'], $city['longitude']]));
		}
		$tree = new KDTree($itemList);

		// Persiste KDTree in app data.
		$persister = new FSTreePersister('/');
		$kdTreeTmpFileName = tempnam(sys_get_temp_dir(), 'nextcloud_photos_');
		$persister->convert($tree, $kdTreeTmpFileName);
		$kdTreeString = file_get_contents($kdTreeTmpFileName);
		$this->geoNameFolder()->newFile('cities1000.bin', $kdTreeString);
		unlink($kdTreeTmpFileName);
	}

	/**
	 * Whether the cached cities list predates one of its columns: the country
	 * codes, the populations or the feature codes.
	 */
	private function isCities1000Outdated(): bool {
		if (!$this->arePlacesEnabled() || !$this->geoNameFolder()->fileExists('cities1000.csv')) {
			return false;
		}

		$csvStream = $this->geoNameFolder()->getFile('cities1000.csv')->read();
		if ($csvStream === false || !is_resource($csvStream)) {
			return false;
		}

		$fields = fgetcsv($csvStream, 0, ',', '"', '\\');
		fclose($csvStream);

		return $fields !== false && count($fields) < self::CITIES_COLUMNS;
	}

	private function loadKdTree(): void {
		if ($this->fsSearcher !== null) {
			return;
		}

		if ($this->isCities1000Outdated()) {
			try {
				$this->buildKDTree(true);
			} catch (\Exception $e) {
				$this->logger->warning('Failed to update the cities list, places will be the nearest entry of the outdated one', ['exception' => $e]);
			}
		}

		$this->buildKDTree();
		$kdTreeFileContent = $this->geoNameFolder()->getFile('cities1000.bin')->getContent();
		$kdTreeTmpFileName = tempnam(sys_get_temp_dir(), 'nextcloud_photos_');
		file_put_contents($kdTreeTmpFileName, $kdTreeFileContent);
		$fsTree = new FSKDTree($kdTreeTmpFileName, new ItemFactory());
		$this->fsSearcher = new NearestSearch($fsTree);
		unlink($kdTreeTmpFileName);
	}
}
