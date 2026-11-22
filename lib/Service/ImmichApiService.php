<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use OCP\Http\Client\IClientService;

/**
 * Read the albums and favorites of an Immich server through its API.
 *
 * Assets are listed with the page based metadata search, which every Immich
 * release since 1.113 supports, including the 3.x releases which deprecate it
 * in favor of cursors.
 *
 * @psalm-type ImmichAlbum = array{id: string, name: string}
 * @psalm-type ImmichAsset = array{name: string, times: list<int>}
 */
class ImmichApiService {
	public const TIMEOUT = 30;
	private const CONNECT_TIMEOUT = 10;
	private const PAGE_SIZE = 1000;
	private const MAX_PAGES = 1000;

	/** Fields of an asset holding the capture time or the file time, in UTC or local time. */
	private const TIME_FIELDS = ['fileCreatedAt', 'localDateTime', 'fileModifiedAt'];

	/** Capture times of the same file differ by the fraction of a second Immich keeps. */
	private const TIME_TOLERANCE = 1;

	public function __construct(
		private readonly IClientService $clientService,
	) {
	}

	/**
	 * @return ?string Base URL of the API, NULL if the URL is no plain HTTP(S) URL
	 */
	public function getApiUrl(string $serverUrl): ?string {
		$parts = parse_url(trim($serverUrl));
		if ($parts === false || !in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true)
			|| ($parts['host'] ?? '') === '' || isset($parts['user']) || isset($parts['query']) || isset($parts['fragment'])) {
			return null;
		}

		$url = rtrim(trim($serverUrl), '/');
		return preg_match('#/api$#', $url) === 1 ? $url : $url . '/api';
	}

	/**
	 * Albums owned by or shared with the user of the API key.
	 *
	 * @param bool $allowLocalAddress Whether the server may be in the local network
	 * @return list<ImmichAlbum>
	 * @throws \Exception on network or API errors
	 */
	public function getAlbums(string $apiUrl, #[\SensitiveParameter] string $apiKey, bool $allowLocalAddress = false): array {
		$albums = [];
		foreach ($this->request('GET', $apiUrl . '/albums', $apiKey, $allowLocalAddress) as $album) {
			if (is_array($album) && is_string($album['id'] ?? null) && is_string($album['albumName'] ?? null)) {
				$albums[] = ['id' => $album['id'], 'name' => $album['albumName']];
			}
		}

		return $albums;
	}

	/**
	 * @return list<ImmichAsset>
	 * @throws \Exception on network or API errors
	 */
	public function getAlbumAssets(string $apiUrl, #[\SensitiveParameter] string $apiKey, string $albumId, bool $allowLocalAddress = false): array {
		return $this->searchAssets($apiUrl, $apiKey, ['albumIds' => [$albumId]], $allowLocalAddress);
	}

	/**
	 * @return list<ImmichAsset>
	 * @throws \Exception on network or API errors
	 */
	public function getFavoriteAssets(string $apiUrl, #[\SensitiveParameter] string $apiKey, bool $allowLocalAddress = false): array {
		return $this->searchAssets($apiUrl, $apiKey, ['isFavorite' => true], $allowLocalAddress);
	}

	/**
	 * Whether a file with the name of the asset is the asset: its capture time
	 * is the capture time of the asset, in UTC or in local time when the time
	 * zone is unknown, or the modification time of the asset file.
	 *
	 * @param ImmichAsset $asset
	 */
	public function isSameTime(array $asset, int $takenAt): bool {
		foreach ($asset['times'] as $time) {
			if (abs($time - $takenAt) <= self::TIME_TOLERANCE) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @param array<string, mixed> $filters
	 * @return list<ImmichAsset>
	 * @throws \Exception on network or API errors
	 */
	private function searchAssets(string $apiUrl, #[\SensitiveParameter] string $apiKey, array $filters, bool $allowLocalAddress): array {
		$assets = [];
		$page = 1;

		for ($i = 0; $i < self::MAX_PAGES; $i++) {
			$response = $this->request('POST', $apiUrl . '/search/metadata', $apiKey, $allowLocalAddress, [
				...$filters,
				'page' => $page,
				'size' => self::PAGE_SIZE,
				'withExif' => true,
			]);

			$result = is_array($response['assets'] ?? null) ? $response['assets'] : [];
			foreach (is_array($result['items'] ?? null) ? $result['items'] : [] as $item) {
				$asset = is_array($item) ? $this->parseAsset($item) : null;
				if ($asset !== null) {
					$assets[] = $asset;
				}
			}

			$nextPage = $result['nextPage'] ?? null;
			if (!is_numeric($nextPage) || (int)$nextPage <= $page) {
				break;
			}
			$page = (int)$nextPage;
		}

		return $assets;
	}

	/**
	 * @return ?ImmichAsset NULL for trashed assets and assets without name
	 */
	private function parseAsset(array $item): ?array {
		$name = $item['originalFileName'] ?? null;
		if (!is_string($name) || $name === '' || ($item['isTrashed'] ?? false) === true) {
			return null;
		}

		$values = array_map(fn (string $field): mixed => $item[$field] ?? null, self::TIME_FIELDS);
		$exif = $item['exifInfo'] ?? null;
		if (is_array($exif)) {
			$values[] = $exif['dateTimeOriginal'] ?? null;
		}

		$times = [];
		foreach ($values as $value) {
			$time = is_string($value) ? $this->parseTime($value) : null;
			if ($time !== null) {
				$times[] = $time;
			}
		}

		return ['name' => $name, 'times' => array_values(array_unique($times))];
	}

	private function parseTime(string $value): ?int {
		foreach ([DATE_RFC3339_EXTENDED, DATE_ATOM] as $format) {
			$date = \DateTimeImmutable::createFromFormat($format, $value);
			if ($date !== false) {
				return $date->getTimestamp();
			}
		}

		return null;
	}

	/**
	 * Requests are bound to the given server: redirects are not followed.
	 * Local and private addresses are refused unless allowed, the server
	 * address may come from any user.
	 *
	 * @param ?array<string, mixed> $body JSON body
	 * @throws \Exception on network or API errors
	 */
	private function request(string $method, string $url, #[\SensitiveParameter] string $apiKey, bool $allowLocalAddress, ?array $body = null): array {
		$options = [
			'headers' => ['x-api-key' => $apiKey, 'Accept' => 'application/json'],
			'timeout' => self::TIMEOUT,
			'connect_timeout' => self::CONNECT_TIMEOUT,
			'allow_redirects' => false,
		];
		if ($allowLocalAddress) {
			$options['nextcloud'] = ['allow_local_address' => true];
		}

		$client = $this->clientService->newClient();
		$response = $body === null
			? $client->get($url, $options)
			: $client->post($url, [...$options, 'json' => $body]);

		if ($response->getStatusCode() !== 200) {
			throw new \RuntimeException(sprintf('Immich answered %s %s with status %d', $method, $url, $response->getStatusCode()));
		}

		$data = json_decode((string)$response->getBody(), true);
		if (!is_array($data)) {
			throw new \RuntimeException(sprintf('Immich answered %s %s with an invalid response', $method, $url));
		}

		return $data;
	}
}
