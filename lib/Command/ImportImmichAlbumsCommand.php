<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Command;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\Exception\AlreadyInAlbumException;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Service\ImmichApiService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\ITagManager;
use OCP\IUserManager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Recreate the albums and favorites of an Immich user for the photos and
 * videos already copied from Immich into a folder. Nothing is downloaded:
 * files are matched by their original name and capture time.
 *
 * @psalm-import-type ImmichAsset from ImmichApiService
 */
class ImportImmichAlbumsCommand extends Command {
	private const METADATA_BATCH_SIZE = 500;

	/** @var array<string, int> Number of assets, by outcome */
	private array $results = [];

	public function __construct(
		private readonly IUserManager $userManager,
		private readonly IRootFolder $rootFolder,
		private readonly IFilesMetadataManager $filesMetadataManager,
		private readonly ITagManager $tagManager,
		private readonly AlbumMapper $albumMapper,
		private readonly ImmichApiService $immichApiService,
	) {
		parent::__construct();
	}

	#[\Override]
	protected function configure(): void {
		$this->setName('photos:import-immich-albums')
			->setDescription('Recreate the albums and favorites of an Immich user for the files copied from Immich into a folder')
			->addArgument('user', InputArgument::REQUIRED, 'User owning the files')
			->addArgument('immich-url', InputArgument::REQUIRED, 'URL of the Immich server. Example: https://immich.example.com')
			->addOption('api-key', null, InputOption::VALUE_REQUIRED, 'Immich API key with the album.read and asset.read permissions, defaults to the IMMICH_API_KEY environment variable')
			->addOption('match-folder', null, InputOption::VALUE_REQUIRED, 'Folder of the copied files, relative to the files of the user. Example: Immich')
			->addOption('dry-run', null, InputOption::VALUE_NONE, 'Only report what would be changed');
	}

	#[\Override]
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$userId = (string)$input->getArgument('user');
		$apiKey = (string)($input->getOption('api-key') ?? getenv('IMMICH_API_KEY'));
		$path = (string)$input->getOption('match-folder');
		$dryRun = (bool)$input->getOption('dry-run');

		$apiUrl = $this->immichApiService->getApiUrl((string)$input->getArgument('immich-url'));
		if ($apiUrl === null) {
			$output->writeln('<error>The Immich URL must be an http or https URL</error>');
			return 1;
		}
		if ($apiKey === '') {
			$output->writeln('<error>An Immich API key is required</error>');
			return 1;
		}
		if ($path === '') {
			$output->writeln('<error>The --match-folder option is required</error>');
			return 1;
		}

		$user = $this->userManager->get($userId);
		if ($user === null) {
			$output->writeln("<error>User $userId was not found</error>");
			return 1;
		}
		$userId = $user->getUID();

		try {
			$folder = $this->rootFolder->getUserFolder($userId)->get($path);
		} catch (NotFoundException) {
			$folder = null;
		}
		if (!$folder instanceof Folder) {
			$output->writeln("<error>Folder $path was not found</error>");
			return 1;
		}

		try {
			$albums = [];
			foreach ($this->immichApiService->getAlbums($apiUrl, $apiKey) as $album) {
				$albums[] = [$album['name'], $this->immichApiService->getAlbumAssets($apiUrl, $apiKey, $album['id'])];
			}
			$favorites = $this->immichApiService->getFavoriteAssets($apiUrl, $apiKey);
		} catch (\Exception $e) {
			$output->writeln('<error>Could not read from Immich: ' . $e->getMessage() . '</error>');
			return 1;
		}

		$names = [];
		foreach ([...array_merge(...array_column($albums, 1)), ...$favorites] as $asset) {
			$names[$asset['name']] = true;
		}
		$files = $this->findFiles($folder, $names);

		$this->results = [];
		foreach ($albums as [$name, $assets]) {
			$this->fillAlbum($name, $this->matchAssets($assets, $files), $userId, $dryRun, $output);
		}
		$this->addFavorites($this->matchAssets($favorites, $files), $userId, $dryRun, $output);

		$would = $dryRun ? 'Would be ' : '';
		$output->writeln(sprintf('Immich albums: %d', count($albums)));
		$output->writeln(sprintf('Immich favorites: %d', count($favorites)));
		foreach ([
			'album_created' => $would . 'created albums: %d',
			'album_file' => $would . 'added to albums: %d',
			'favorite' => $would . 'marked as favorite: %d',
			'not_found' => 'Assets without matching file: %d',
			'ambiguous' => 'Assets skipped, several matching files: %d',
		] as $result => $format) {
			$output->writeln(sprintf(ucfirst($format), $this->results[$result] ?? 0));
		}

		return 0;
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
	private function matchAssets(array $assets, array $files): array {
		$matches = [];
		foreach ($assets as $asset) {
			$candidates = array_filter(
				$files[$asset['name']] ?? [],
				fn (array $file): bool => $file[1] !== null && $this->immichApiService->isSameTime($asset, $file[1]),
			);

			if (count($candidates) === 1) {
				$matches[] = reset($candidates)[0];
			} else {
				$this->count($candidates === [] ? 'not_found' : 'ambiguous');
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
	private function fillAlbum(string $name, array $files, string $userId, bool $dryRun, OutputInterface $output): void {
		if ($files === []) {
			return;
		}

		$album = $this->albumMapper->getByName($name, $userId);
		if ($album === null) {
			$this->count('album_created');
			$output->writeln("Album $name: created", OutputInterface::VERBOSITY_VERBOSE);
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
			$this->count('album_file');
			$output->writeln($file->getPath() . ": added to album $name", OutputInterface::VERBOSITY_VERBOSE);
		}
	}

	/**
	 * @param list<File> $files
	 */
	private function addFavorites(array $files, string $userId, bool $dryRun, OutputInterface $output): void {
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
			$this->count('favorite');
			$output->writeln($file->getPath() . ': favorite', OutputInterface::VERBOSITY_VERBOSE);
		}
	}

	private function count(string $result): void {
		$this->results[$result] = ($this->results[$result] ?? 0) + 1;
	}
}
