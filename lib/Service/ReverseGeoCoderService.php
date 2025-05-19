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

class ReverseGeoCoderService {
	public const CONFIG_DISABLE_PLACES = 'disable_places';
	private ?ISimpleFolder $geoNameFolderCache = null;
	private ?NearestSearch $fsSearcher = null;
	/** @var array<int, string> */
	private ?array $citiesMapping = null;

	public function __construct(
		private readonly IAppData $appData,
		private readonly IClientService $clientService,
		private readonly IConfig $config,
	) {
	}

	public function getPlaceForCoordinates(float $latitude, float $longitude): string {
		$this->loadKdTree();
		$result = $this->fsSearcher->search(new Point([$latitude, $longitude]), 1);
		return $this->getPlaceNameForPlaceId($result[0]->getId());
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

	private function getPlaceNameForPlaceId(int $placeId): string {
		if ($this->citiesMapping === null) {
			$this->downloadCities1000();
			$cities1000 = $this->loadCities1000();
			$this->citiesMapping = [];
			foreach ($cities1000 as $city) {
				$this->citiesMapping[$city['id']] = $city['name'];
			}
		}

		return $this->citiesMapping[$placeId];
	}

	public function arePlacesEnabled(): bool {
		return ($this->config->getAppValue(Application::APP_ID, self::CONFIG_DISABLE_PLACES, '0') !== '1');
	}

	private function downloadCities1000(bool $force = false): void {
		if (!$this->arePlacesEnabled() || ($this->geoNameFolder()->fileExists('cities1000.csv') && !$force)) {
			return;
		}

		// Download zip file to a tmp file.
		$response = $this->clientService->newClient()->get('https://download.nextcloud.com/server/apps/photos/cities1000.zip');
		$tmpFile = tmpfile();
		$cities1000ZipTmpFileName = stream_get_meta_data($tmpFile)['uri'];
		fclose($tmpFile);
		file_put_contents($cities1000ZipTmpFileName, $response->getBody());

		// Unzip the txt file into a stream.
		$zip = new \ZipArchive;
		$res = $zip->open($cities1000ZipTmpFileName);
		if ($res !== true) {
			throw new \Exception("Fail to unzip place file: $res", $res);
		}
		$cities1000TxtSteam = $zip->getStream('cities1000.txt');

		// Dump the txt file info into a smaller csv file.
		$destinationStream = $this->geoNameFolder()->newFile('cities1000.csv')->write();

		while (($fields = fgetcsv($cities1000TxtSteam, 0, '	')) !== false) {
			$result = fputcsv(
				$destinationStream,
				[
					'id' => (int)$fields[0],
					'name' => $fields[1],
					'latitude' => (float)$fields[4],
					'longitude' => (float)$fields[5],
				]
			);

			if ($result === false) {
				throw new \Exception('Failed to write csv line to tmp stream');
			}
		}

		$zip->close();
	}

	private function loadCities1000(): array {
		$csvStream = $this->geoNameFolder()->getFile('cities1000.csv')->read();
		$cities = [];

		while (($fields = fgetcsv($csvStream)) !== false) {
			$cities[] = [
				'id' => (int)$fields[0],
				'name' => $fields[1],
				'latitude' => (float)$fields[2],
				'longitude' => (float)$fields[3],
			];
		}

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

	private function loadKdTree(): void {
		if ($this->fsSearcher !== null) {
			return;
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
