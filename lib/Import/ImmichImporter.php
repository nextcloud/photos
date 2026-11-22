<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Import;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\Exception\AlreadyInAlbumException;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Service\ImmichApiService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\Http\Client\LocalServerException;
use OCP\IGroupManager;
use OCP\IL10N;
use OCP\ITagManager;
use OCP\Security\IRemoteHostValidator;

/**
 * Recreate the albums and favorites of an Immich user for the photos and
 * videos already copied from Immich into a folder. Nothing is downloaded:
 * files are matched by their original name and capture time.
 *
 * Only administrators may reach an Immich server in the local network, the
 * server address is user input.
 *
 * @psalm-import-type ImmichAsset from ImmichApiService
 */
class ImmichImporter implements IImporter {
	private const METADATA_BATCH_SIZE = 500;

	public function __construct(
		private readonly IFilesMetadataManager $filesMetadataManager,
		private readonly ITagManager $tagManager,
		private readonly AlbumMapper $albumMapper,
		private readonly ImmichApiService $immichApiService,
		private readonly IGroupManager $groupManager,
		private readonly IRemoteHostValidator $remoteHostValidator,
		private readonly IL10N $l10n,
	) {
	}

	#[\Override]
	public function getId(): string {
		return 'immich';
	}

	#[\Override]
	public function getName(): string {
		return 'Immich';
	}

	#[\Override]
	public function getDescription(): string {
		return $this->l10n->t('Recreates your Immich albums and favorites for the photos and videos you already copied from Immich. Photos are matched by file name and capture time, nothing is downloaded. Create an API key with the album.read and asset.read permissions in the account settings of Immich, it is only used for this import and is not stored.');
	}

	#[\Override]
	public function getFolderHint(): string {
		return $this->l10n->t('Choose the folder containing the photos you copied from Immich.');
	}

	#[\Override]
	public function getFields(): array {
		return [
			['id' => 'url', 'type' => 'url', 'label' => $this->l10n->t('Immich server address')],
			['id' => 'apiKey', 'type' => 'password', 'label' => $this->l10n->t('Immich API key')],
		];
	}

	#[\Override]
	public function getSummaryLabels(): array {
		return [
			'found' => [
				'albums' => $this->l10n->t('Albums in Immich'),
				'favorites' => $this->l10n->t('Favorites in Immich'),
			],
			'changed' => [
				'album_created' => $this->l10n->t('Albums created'),
				'album_file' => $this->l10n->t('Added to albums'),
				'favorite' => $this->l10n->t('Marked as favorite'),
			],
			'skipped' => [
				'not_found' => $this->l10n->t('No matching file found'),
				'ambiguous' => $this->l10n->t('Several matching files'),
			],
		];
	}

	#[\Override]
	public function validateOptions(string $userId, #[\SensitiveParameter] array $options): void {
		$apiUrl = $this->immichApiService->getApiUrl((string)($options['url'] ?? ''));
		if ($apiUrl === null) {
			throw new ImportException($this->l10n->t('Enter the address of your Immich server, for example https://immich.example.com'));
		}
		if (($options['apiKey'] ?? '') === '') {
			throw new ImportException($this->l10n->t('Enter an Immich API key'));
		}
		if (!$this->groupManager->isAdmin($userId) && !$this->remoteHostValidator->isValid((string)parse_url($apiUrl, PHP_URL_HOST))) {
			throw new ImportException($this->l10n->t('The Immich server must be reachable from the internet, addresses of the local network are not allowed'));
		}
	}

	#[\Override]
	public function import(string $userId, Folder $folder, #[\SensitiveParameter] array $options, bool $dryRun, ImportReport $report): void {
		$this->validateOptions($userId, $options);
		$apiUrl = (string)$this->immichApiService->getApiUrl((string)($options['url'] ?? ''));

		$this->importAlbums($userId, $folder, $apiUrl, (string)($options['apiKey'] ?? ''), $dryRun, $report, $this->groupManager->isAdmin($userId));
	}

	/**
	 * @param string $apiUrl Base URL of the API, see ImmichApiService::getApiUrl()
	 * @param bool $allowLocalAddress Whether the server may be in the local network
	 * @throws ImportException if Immich cannot be read
	 */
	public function importAlbums(string $userId, Folder $folder, string $apiUrl, #[\SensitiveParameter] string $apiKey, bool $dryRun, ImportReport $report, bool $allowLocalAddress): void {
		try {
			$albums = [];
			foreach ($this->immichApiService->getAlbums($apiUrl, $apiKey, $allowLocalAddress) as $album) {
				$albums[] = [$album['name'], $this->immichApiService->getAlbumAssets($apiUrl, $apiKey, $album['id'], $allowLocalAddress)];
			}
			$favorites = $this->immichApiService->getFavoriteAssets($apiUrl, $apiKey, $allowLocalAddress);
		} catch (LocalServerException) {
			throw new ImportException($this->l10n->t('The Immich server must be reachable from the internet, addresses of the local network are not allowed'));
		} catch (\Exception $e) {
			throw new ImportException($this->l10n->t('Could not read from Immich: %s', [$e->getMessage()]));
		}

		$report->set('albums', count($albums));
		$report->set('favorites', count($favorites));

		$names = [];
		foreach ([...array_merge(...array_column($albums, 1)), ...$favorites] as $asset) {
			$names[$asset['name']] = true;
		}
		$files = $this->findFiles($folder, $names);

		foreach ($albums as [$name, $assets]) {
			$this->fillAlbum($name, $this->matchAssets($assets, $files, $report), $userId, $dryRun, $report);
		}
		$this->addFavorites($this->matchAssets($favorites, $files, $report), $userId, $dryRun, $report);
	}

	/**
	 * @param array<string, true> $names Names of the files to find
	 * @return array<string, list<array{File, ?int}>> Media files and their capture time, by name
	 */
	private function findFiles(Folder $folder, array $names): array {
		$files = [];
		$this->collectFiles($folder, $names, $files);

		$takenAt = [];
		foreach (array_chunk(array_keys($files), self::METADATA_BATCH_SIZE) as $fileIds) {
			foreach ($this->filesMetadataManager->getMetadataForFiles($fileIds) as $fileId => $metadata) {
				if ($metadata->hasKey(OriginalDateTimeMetadataProvider::METADATA_KEY)) {
					$takenAt[$fileId] = $metadata->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY);
				}
			}
		}

		$filesByName = [];
		foreach ($files as $fileId => $file) {
			$filesByName[$file->getName()][] = [$file, $takenAt[$fileId] ?? null];
		}

		return $filesByName;
	}

	/**
	 * @param array<string, true> $names
	 * @param array<int, File> $files Media files, by id
	 */
	private function collectFiles(Folder $folder, array $names, array &$files): void {
		foreach ($folder->getDirectoryListing() as $node) {
			if ($node instanceof Folder) {
				$this->collectFiles($node, $names, $files);
			} elseif ($node instanceof File && isset($names[$node->getName()])
				&& (in_array($node->getMimeType(), Application::IMAGE_MIMES, true) || in_array($node->getMimeType(), Application::VIDEO_MIMES, true))) {
				$files[$node->getId()] = $node;
			}
		}
	}

	/**
	 * @param list<ImmichAsset> $assets
	 * @param array<string, list<array{File, ?int}>> $files
	 * @return list<File> The files matching exactly one asset each
	 */
	private function matchAssets(array $assets, array $files, ImportReport $report): array {
		$matches = [];
		foreach ($assets as $asset) {
			$candidates = array_filter(
				$files[$asset['name']] ?? [],
				fn (array $file): bool => $file[1] !== null && $this->immichApiService->isSameTime($asset, $file[1]),
			);

			if (count($candidates) === 1) {
				$matches[] = reset($candidates)[0];
			} else {
				$report->add($candidates === [] ? 'not_found' : 'ambiguous', $asset['name']);
			}
		}

		return $matches;
	}

	/**
	 * Add the files to the album of the user with that name, creating it when
	 * needed. Albums without files are not created.
	 *
	 * @param list<File> $files
	 */
	private function fillAlbum(string $name, array $files, string $userId, bool $dryRun, ImportReport $report): void {
		if ($files === []) {
			return;
		}

		$album = $this->albumMapper->getByName($name, $userId);
		if ($album === null) {
			$report->add('album_created', $name);
			if (!$dryRun) {
				$album = $this->albumMapper->create($userId, $name);
			}
		}

		foreach ($files as $file) {
			if ($album !== null && $this->albumMapper->getForAlbumIdAndFileId($album->getId(), $file->getId()) !== null) {
				continue;
			}

			if (!$dryRun && $album !== null) {
				try {
					$this->albumMapper->addFile($album->getId(), $file->getId(), $userId);
				} catch (AlreadyInAlbumException) {
					continue;
				}
			}
			$report->add('album_file', $file->getPath());
		}
	}

	/**
	 * @param list<File> $files
	 */
	private function addFavorites(array $files, string $userId, bool $dryRun, ImportReport $report): void {
		$tags = $this->tagManager->load('files', [], false, $userId);
		if ($tags === null || $files === []) {
			return;
		}

		$favorites = array_fill_keys($tags->getFavorites() ?: [], true);
		foreach ($files as $file) {
			if (isset($favorites[$file->getId()])) {
				continue;
			}

			if (!$dryRun) {
				$tags->addToFavorites($file->getId());
			}
			$favorites[$file->getId()] = true;
			$report->add('favorite', $file->getPath());
		}
	}
}
