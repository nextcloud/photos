<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Command;

use OC\FilesMetadata\Model\FilesMetadata;
use OCA\Photos\Album\AlbumFile;
use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Command\ImportImmichAlbumsCommand;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Service\ImmichApiService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\Node;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\Http\Client\IClient;
use OCP\Http\Client\IClientService;
use OCP\Http\Client\IResponse;
use OCP\ITagManager;
use OCP\ITags;
use OCP\IUser;
use OCP\IUserManager;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Tester\CommandTester;
use Test\TestCase;

class ImportImmichAlbumsCommandTest extends TestCase {
	private const URL = 'https://immich.example.com';
	/** 2023-06-04 10:11:12 UTC */
	private const TAKEN_AT = 1685873472;

	private IUserFolder&MockObject $userFolder;
	private IClient&MockObject $client;
	private ITags&MockObject $tags;
	private AlbumMapper&MockObject $albumMapper;
	private CommandTester $commandTester;

	/** @var array<int, int> Capture times, by file id */
	private array $takenAt = [];
	private int $lastFileId = 0;

	/** @var array<string, AlbumInfo> Albums of alice, by name */
	private array $albums = [];
	/** @var array<string, list<int>> File ids, by album name */
	private array $albumFiles = [];

	/** @var list<array{string, mixed}> Requested URLs and their JSON body */
	private array $requests = [];
	/** @var array<string, mixed> Immich albums with their assets, by album id */
	private array $immichAlbums = [];
	private array $immichFavorites = [];
	private ?\Exception $searchException = null;

	protected function setUp(): void {
		parent::setUp();

		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn('alice');
		$userManager = $this->createMock(IUserManager::class);
		$userManager->method('get')
			->willReturnCallback(fn (string $uid): ?IUser => $uid === 'alice' ? $user : null);

		$this->userFolder = $this->createMock(IUserFolder::class);
		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->with('alice')->willReturn($this->userFolder);

		$filesMetadataManager = $this->createMock(IFilesMetadataManager::class);
		$filesMetadataManager->method('getMetadataForFiles')
			->willReturnCallback(function (array $fileIds): array {
				$metadata = [];
				foreach ($fileIds as $fileId) {
					$metadata[$fileId] = new FilesMetadata($fileId);
					if (isset($this->takenAt[$fileId])) {
						$metadata[$fileId]->setInt(OriginalDateTimeMetadataProvider::METADATA_KEY, $this->takenAt[$fileId], true);
					}
				}
				return $metadata;
			});

		$this->tags = $this->createMock(ITags::class);
		$tagManager = $this->createMock(ITagManager::class);
		$tagManager->method('load')->with('files', [], false, 'alice')->willReturn($this->tags);

		$this->albumMapper = $this->createMock(AlbumMapper::class);
		$this->albumMapper->method('getByName')
			->willReturnCallback(fn (string $name, string $user): ?AlbumInfo => $user === 'alice' ? ($this->albums[$name] ?? null) : null);
		$this->albumMapper->method('create')
			->willReturnCallback(function (string $user, string $name): AlbumInfo {
				$this->assertSame('alice', $user);
				return $this->albums[$name] = new AlbumInfo(count($this->albums) + 1, $user, $name, '', 0, -1);
			});
		$this->albumMapper->method('getForAlbumIdAndFileId')
			->willReturnCallback(fn (int $albumId, int $fileId): ?AlbumFile => in_array($fileId, $this->albumFiles[$this->albumName($albumId)] ?? [], true)
				? $this->createMock(AlbumFile::class)
				: null);
		$this->albumMapper->method('addFile')
			->willReturnCallback(function (int $albumId, int $fileId, string $owner): void {
				$this->assertSame('alice', $owner);
				$this->albumFiles[$this->albumName($albumId)][] = $fileId;
			});

		$this->client = $this->createMock(IClient::class);
		$this->client->method('get')->willReturnCallback(function (string $url): IResponse {
			$this->requests[] = [$url, null];
			$this->assertSame(self::URL . '/api/albums', $url);
			$albums = [];
			foreach ($this->immichAlbums as $id => [$name]) {
				$albums[] = ['id' => $id, 'albumName' => $name];
			}
			return $this->response($albums);
		});
		$this->client->method('post')->willReturnCallback(function (string $url, array $options): IResponse {
			$this->requests[] = [$url, $options['json']];
			if ($this->searchException !== null) {
				throw $this->searchException;
			}
			$this->assertSame(self::URL . '/api/search/metadata', $url);
			$items = isset($options['json']['albumIds'])
				? $this->immichAlbums[$options['json']['albumIds'][0]][1]
				: $this->immichFavorites;
			return $this->response(['albums' => [], 'assets' => ['items' => $items, 'nextPage' => null]]);
		});
		$clientService = $this->createMock(IClientService::class);
		$clientService->method('newClient')->willReturn($this->client);

		$this->commandTester = new CommandTester(new ImportImmichAlbumsCommand(
			$userManager,
			$rootFolder,
			$filesMetadataManager,
			$tagManager,
			$this->albumMapper,
			new ImmichApiService($clientService),
		));
	}

	private function response(array $data): IResponse {
		$response = $this->createMock(IResponse::class);
		$response->method('getStatusCode')->willReturn(200);
		$response->method('getBody')->willReturn(json_encode($data));

		return $response;
	}

	private function albumName(int $albumId): string {
		foreach ($this->albums as $name => $album) {
			if ($album->getId() === $albumId) {
				return $name;
			}
		}
		$this->fail("Unknown album $albumId");
	}

	private static function asset(string $name, int $takenAt = self::TAKEN_AT): array {
		$utc = gmdate('Y-m-d\TH:i:s', $takenAt) . '.000Z';
		return [
			'originalFileName' => $name,
			'fileCreatedAt' => $utc,
			'localDateTime' => gmdate('Y-m-d\TH:i:s', $takenAt + 7200) . '.000Z',
			'fileModifiedAt' => '2024-01-01T00:00:00.000Z',
			'isTrashed' => false,
			'exifInfo' => ['dateTimeOriginal' => $utc],
		];
	}

	private function createMedia(string $name, ?int $takenAt = self::TAKEN_AT, string $mimeType = 'image/jpeg'): File&MockObject {
		$fileId = ++$this->lastFileId;
		if ($takenAt !== null) {
			$this->takenAt[$fileId] = $takenAt;
		}

		$file = $this->createMock(File::class);
		$file->method('getId')->willReturn($fileId);
		$file->method('getName')->willReturn($name);
		$file->method('getPath')->willReturn('/alice/files/Immich/' . $name);
		$file->method('getMimeType')->willReturn($mimeType);

		return $file;
	}

	/**
	 * @param list<Node> $nodes
	 */
	private function createFolder(array $nodes): Folder&MockObject {
		$folder = $this->createMock(Folder::class);
		$folder->method('getDirectoryListing')->willReturn($nodes);

		return $folder;
	}

	private function execute(array $options = []): int {
		$input = array_filter(
			['user' => 'alice', 'immich-url' => self::URL . '/', '--api-key' => 'secret-key', '--match-folder' => 'Immich', ...$options],
			fn (?string $value): bool => $value !== null,
		);

		return $this->commandTester->execute($input, ['verbosity' => OutputInterface::VERBOSITY_VERBOSE]);
	}

	public function testRecreatesAlbumsAndFavorites(): void {
		$summer = $this->createMedia('IMG_0001.JPG');
		$localTime = $this->createMedia('IMG_0002.JPG', self::TAKEN_AT + 7200);
		$otherShot = $this->createMedia('IMG_0001.JPG', self::TAKEN_AT - 86400);
		$video = $this->createMedia('VID_0003.MP4', null, 'video/mp4');
		$notMedia = $this->createMedia('notes.txt', self::TAKEN_AT, 'text/plain');
		$this->userFolder->method('get')->with('Immich')->willReturn($this->createFolder([
			$summer, $otherShot, $notMedia,
			$this->createFolder([$localTime, $video]),
		]));

		$this->immichAlbums = [
			'a1' => ['Summer', [self::asset('IMG_0001.JPG'), self::asset('IMG_0002.JPG'), self::asset('VID_0003.MP4'), self::asset('missing.jpg')]],
			'a2' => ['Empty', [self::asset('notes.txt')]],
		];
		$this->immichFavorites = [self::asset('IMG_0001.JPG'), self::asset('IMG_0001.JPG', self::TAKEN_AT - 86400)];

		$this->tags->method('getFavorites')->willReturn([$otherShot->getId()]);
		$this->tags->expects($this->once())->method('addToFavorites')->with($summer->getId());

		$this->assertSame(0, $this->execute());
		$display = $this->commandTester->getDisplay();

		$this->assertSame(['Summer'], array_keys($this->albums));
		$this->assertSame([$summer->getId(), $localTime->getId()], $this->albumFiles['Summer']);
		$this->assertSame([
			[self::URL . '/api/albums', null],
			[self::URL . '/api/search/metadata', ['albumIds' => ['a1'], 'page' => 1, 'size' => 1000, 'withExif' => true]],
			[self::URL . '/api/search/metadata', ['albumIds' => ['a2'], 'page' => 1, 'size' => 1000, 'withExif' => true]],
			[self::URL . '/api/search/metadata', ['isFavorite' => true, 'page' => 1, 'size' => 1000, 'withExif' => true]],
		], $this->requests);

		$this->assertStringContainsString('Immich albums: 2', $display);
		$this->assertStringContainsString('Immich favorites: 2', $display);
		$this->assertStringContainsString('Created albums: 1', $display);
		$this->assertStringContainsString('Added to albums: 2', $display);
		$this->assertStringContainsString('Marked as favorite: 1', $display);
		$this->assertStringContainsString('Assets without matching file: 3', $display);
		$this->assertStringContainsString('/alice/files/Immich/IMG_0001.JPG: added to album Summer', $display);
	}

	public function testSkipsAmbiguousMatches(): void {
		$first = $this->createMedia('IMG_0001.JPG');
		$copy = $this->createMedia('IMG_0001.JPG');
		$this->userFolder->method('get')->willReturn($this->createFolder([$first, $this->createFolder([$copy])]));
		$this->immichAlbums = ['a1' => ['Summer', [self::asset('IMG_0001.JPG')]]];
		$this->tags->method('getFavorites')->willReturn([]);

		$this->assertSame(0, $this->execute());

		$this->assertSame([], $this->albums);
		$this->assertStringContainsString('Assets skipped, several matching files: 1', $this->commandTester->getDisplay());
	}

	public function testDryRunAndRerunChangeNothing(): void {
		$photo = $this->createMedia('IMG_0001.JPG');
		$new = $this->createMedia('IMG_0002.JPG');
		$this->userFolder->method('get')->willReturn($this->createFolder([$photo, $new]));
		$this->albums['Summer'] = new AlbumInfo(4, 'alice', 'Summer', '', 0, -1);
		$this->albumFiles['Summer'] = [$photo->getId()];
		$this->immichAlbums = [
			'a1' => ['Summer', [self::asset('IMG_0001.JPG'), self::asset('IMG_0002.JPG')]],
			'a2' => ['Winter', [self::asset('IMG_0002.JPG')]],
		];
		$this->immichFavorites = [self::asset('IMG_0002.JPG')];

		$this->tags->method('getFavorites')->willReturn([]);
		$this->tags->expects($this->never())->method('addToFavorites');
		$this->albumMapper->expects($this->never())->method('create');
		$this->albumMapper->expects($this->never())->method('addFile');

		$this->assertSame(0, $this->execute(['--dry-run' => '1']));
		$display = $this->commandTester->getDisplay();

		$this->assertStringContainsString('Would be created albums: 1', $display);
		$this->assertStringContainsString('Would be added to albums: 2', $display);
		$this->assertStringContainsString('Would be marked as favorite: 1', $display);
	}

	public function testFailsOnImmichErrors(): void {
		$this->userFolder->method('get')->willReturn($this->createFolder([]));
		$this->searchException = new \Exception('Connection timed out');
		$this->immichAlbums = ['a1' => ['Summer', []]];

		$this->assertSame(1, $this->execute());
		$this->assertStringContainsString('Could not read from Immich: Connection timed out', $this->commandTester->getDisplay());
	}

	public static function dataInvalidArguments(): array {
		return [
			'url' => [['immich-url' => 'ftp://immich.example.com'], 'must be an http or https URL'],
			'api key' => [['--api-key' => ''], 'API key is required'],
			'folder option' => [['--match-folder' => null], 'The --match-folder option is required'],
			'user' => [['user' => 'bob'], 'User bob was not found'],
			'folder' => [['--match-folder' => 'Missing'], 'Folder Missing was not found'],
		];
	}

	/**
	 * @dataProvider dataInvalidArguments
	 */
	public function testFailsOnInvalidArguments(array $arguments, string $message): void {
		$this->userFolder->method('get')->willReturn($this->createMock(File::class));
		$this->client->expects($this->never())->method('get');

		$this->assertSame(1, $this->execute($arguments));
		$this->assertStringContainsString($message, $this->commandTester->getDisplay());
	}
}
