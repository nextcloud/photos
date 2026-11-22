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
	private ?ISimpleFolder $geoNameFolderCache = null;
	private ?NearestSearch $fsSearcher = null;
	/** @var array<int, string> */
	private ?array $citiesMapping = null;
	/** @var array<int, string> */
	private ?array $countryCodesMapping = null;

	public function __construct(
		private readonly IAppData $appData,
		private readonly IClientService $clientService,
		private readonly IConfig $config,
		private readonly LoggerInterface $logger,
	) {
	}

	/**
	 * The city nearest to the coordinates, with the ISO 3166-1 alpha-2 code of
	 * its country, or an empty code when the cities list carries none.
	 *
	 * @return array{name: string, countryCode: string}
	 */
	public function getPlaceForCoordinates(float $latitude, float $longitude): array {
		$this->loadKdTree();
		$result = $this->fsSearcher->search(new Point([$latitude, $longitude]), 1);
		return $this->getPlaceForPlaceId($result[0]->getId());
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
	 * @return array{name: string, countryCode: string}
	 */
	private function getPlaceForPlaceId(int $placeId): array {
		if ($this->citiesMapping === null || $this->countryCodesMapping === null) {
			$this->downloadCities1000();
			$cities1000 = $this->loadCities1000();
			$this->citiesMapping = [];
			$this->countryCodesMapping = [];
			foreach ($cities1000 as $city) {
				$this->citiesMapping[$city['id']] = $city['name'];
				$this->countryCodesMapping[$city['id']] = $city['countryCode'];
			}
		}

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
				if (count($fields) < 9) {
					throw new \Exception('Malformed cities1000.txt row: expected at least 9 fields, got ' . count($fields));
				}
				$result = fputcsv(
					$destinationStream,
					[
						'id' => (int)$fields[0],
						'name' => $fields[1],
						'latitude' => (float)$fields[4],
						'longitude' => (float)$fields[5],
						'countryCode' => $fields[8],
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
	 * @return list<array{id: int, name: string, latitude: float, longitude: float, countryCode: string}>
	 */
	private function loadCities1000(): array {
		$csvStream = $this->geoNameFolder()->getFile('cities1000.csv')->read();
		if ($csvStream === false || !is_resource($csvStream)) {
			throw new \Exception('Failed to open cities1000.csv for reading.');
		}
		$cities = [];

		while (($fields = fgetcsv($csvStream, 0, ',', '"', '\\')) !== false) {
			if (count($fields) < 4) {
				fclose($csvStream);
				throw new \Exception('Malformed cities1000.csv row: expected at least 4 fields, got ' . count($fields));
			}
			$cities[] = [
				'id' => (int)$fields[0],
				'name' => $fields[1],
				'latitude' => (float)$fields[2],
				'longitude' => (float)$fields[3],
				'countryCode' => $fields[4] ?? '',
			];
		}

		fclose($csvStream);
		return $cities;
	}

	public function buildKDTree($force = false): void {
		if ($this->geoNameFolder()->fileExists('cities1000.bin') && !$force) {
			return;
		}

		$this->downloadCities1000($force);
		$cities1000 = $this->loadCities1000();

		$itemList = new ItemList(2);
		foreach ($cities1000 as $city) {
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
	 * Whether the cached cities list predates the country codes.
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

		return $fields !== false && count($fields) < 5;
	}

	private function loadKdTree(): void {
		if ($this->fsSearcher !== null) {
			return;
		}

		if ($this->isCities1000Outdated()) {
			try {
				$this->buildKDTree(true);
			} catch (\Exception $e) {
				$this->logger->warning('Failed to update the cities list, places will have no country', ['exception' => $e]);
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
