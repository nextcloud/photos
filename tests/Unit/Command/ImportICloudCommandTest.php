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
use OCA\Photos\Command\ImportICloudCommand;
use OCA\Photos\Import\ICloudImporter;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Service\ICloudExportService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\Node;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IFilesMetadata;
use OCP\IL10N;
use OCP\ITagManager;
use OCP\ITags;
use OCP\IUser;
use OCP\IUserManager;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Tester\CommandTester;
use Test\TestCase;

class ImportICloudCommandTest extends TestCase {
	private const HEADER = "imgName,fileChecksum,favorite,hidden,deleted,originalCreationDate,viewCount,importDate\n";

	private IUserFolder&MockObject $userFolder;
	private IFilesMetadataManager&MockObject $filesMetadataManager;
	private ITags&MockObject $tags;
	private AlbumMapper&MockObject $albumMapper;
	private CommandTester $commandTester;

	/** @var array<int, IFilesMetadata> Metadata, by file id */
	private array $metadata = [];
	private int $lastFileId = 0;

	/** @var array<string, AlbumInfo> Albums of alice, by name */
	private array $albums = [];
	/** @var array<string, list<int>> File ids, by album name */
	private array $albumFiles = [];

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

		$this->filesMetadataManager = $this->createMock(IFilesMetadataManager::class);
		$this->filesMetadataManager->method('getMetadataForNode')
			->willReturnCallback(fn (Node $node): IFilesMetadata => $this->metadata[$node->getId()]);

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

		$this->commandTester = new CommandTester(new ImportICloudCommand(
			$userManager,
			$rootFolder,
			new ICloudImporter(
				$this->filesMetadataManager,
				$tagManager,
				$this->albumMapper,
				new ICloudExportService(),
				$this->createMock(IL10N::class),
			),
		));
	}

	private function albumName(int $albumId): string {
		foreach ($this->albums as $name => $album) {
			if ($album->getId() === $albumId) {
				return $name;
			}
		}
		$this->fail("Unknown album $albumId");
	}

	/**
	 * @param array<string, mixed> $values Stored metadata values, by key
	 */
	private function createMedia(string $name, array $values = [], bool $updateable = true): File&MockObject {
		$fileId = ++$this->lastFileId;

		$storedMetadata = new FilesMetadata($fileId);
		foreach ($values as $key => $value) {
			is_array($value) ? $storedMetadata->setArray($key, $value) : $storedMetadata->setInt($key, (int)$value, true);
		}
		$this->metadata[$fileId] = (new FilesMetadata($fileId))->import($storedMetadata->jsonSerialize());

		$file = $this->createMock(File::class);
		$file->method('getId')->willReturn($fileId);
		$file->method('getName')->willReturn($name);
		$file->method('getMimeType')->willReturn(str_ends_with($name, '.MOV') ? 'video/quicktime' : 'image/jpeg');
		$file->method('isUpdateable')->willReturn($updateable);

		return $file;
	}

	private function createCsv(string $name, string $content): File&MockObject {
		$file = $this->createMock(File::class);
		$file->method('getId')->willReturn(++$this->lastFileId);
		$file->method('getName')->willReturn($name);
		$file->method('getMimeType')->willReturn('text/csv');
		$file->method('getSize')->willReturn(strlen($content));
		$file->method('getContent')->willReturn($content);

		return $file;
	}

	/**
	 * Create a folder and set the path and parent of its children.
	 *
	 * @param list<Node&MockObject> $nodes
	 */
	private function createFolder(string $path, array $nodes): Folder&MockObject {
		$folder = $this->createMock(Folder::class);
		$folder->method('getName')->willReturn(basename($path));
		$folder->method('getPath')->willReturn($path);
		$folder->method('getDirectoryListing')->willReturn($nodes);

		foreach ($nodes as $node) {
			if ($node instanceof File) {
				$node->method('getPath')->willReturn($path . '/' . $node->getName());
				$node->method('getParent')->willReturn($folder);
			}
		}

		return $folder;
	}

	private function runCommand(Folder $folder, array $options = []): string {
		$this->userFolder->method('get')->with('iCloud Photos')->willReturn($folder);

		$exitCode = $this->commandTester->execute(
			['user' => 'alice', 'folder' => 'iCloud Photos', ...$options],
			['verbosity' => OutputInterface::VERBOSITY_VERBOSE],
		);
		$this->assertSame(0, $exitCode);

		return $this->commandTester->getDisplay();
	}

	private function takenAt(File $file): ?int {
		$metadata = $this->metadata[$file->getId()];
		return $metadata->hasKey(OriginalDateTimeMetadataProvider::METADATA_KEY)
			? $metadata->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY)
			: null;
	}

	public function testImportsDatesFavoritesAndAlbums(): void {
		$plain = $this->createMedia('IMG_0001.JPG', [OriginalDateTimeMetadataProvider::METADATA_KEY => 1700000000]);
		$favorite = $this->createMedia('IMG_0002.JPG');
		$exif = $this->createMedia('IMG_0003.JPG', [
			ExifMetadataProvider::METADATA_KEY_EXIF => ['DateTimeOriginal' => '2020:01:01 10:00:00'],
			OriginalDateTimeMetadataProvider::METADATA_KEY => 1577872800,
		]);
		$hidden = $this->createMedia('IMG_0004.JPG');
		$deleted = $this->createMedia('IMG_0005.JPG');
		$readOnly = $this->createMedia('IMG_0006.MOV', [], false);
		$withoutDetails = $this->createMedia('IMG_0007.JPG');

		$photosFolder = $this->createFolder('/alice/files/iCloud Photos/Part 1/Photos', [
			$plain, $favorite, $exif, $hidden, $deleted, $readOnly, $withoutDetails,
			$this->createCsv('Photo Details.csv', self::HEADER
				. "IMG_0001.JPG,a,no,no,no,\"Saturday June 4,2022 12:11 PM GMT\",1,\"Saturday June 4,2022 12:11 PM GMT\"\n"
				. "IMG_0002.JPG,b,yes,no,no,\"Sunday June 5,2022 8:00 AM GMT\",1,\"Sunday June 5,2022 8:00 AM GMT\"\n"
				. "IMG_0003.JPG,c,no,no,no,\"Saturday June 4,2022 12:11 PM GMT\",1,\"Saturday June 4,2022 12:11 PM GMT\"\n"),
			$this->createCsv('Photo Details-1.csv', self::HEADER
				. "IMG_0004.JPG,d,yes,yes,no,\"Saturday June 4,2022 12:11 PM GMT\",1,\"Saturday June 4,2022 12:11 PM GMT\"\n"
				. "IMG_0005.JPG,e,yes,no,yes,\"Saturday June 4,2022 12:11 PM GMT\",1,\"Saturday June 4,2022 12:11 PM GMT\"\n"
				. "IMG_0006.MOV,f,no,no,no,\"Saturday June 4,2022 12:11 PM GMT\",1,\"Saturday June 4,2022 12:11 PM GMT\"\n"
				. "IMG_9999.JPG,g,no,no,no,\"Saturday June 4,2022 12:11 PM GMT\",1,\"Saturday June 4,2022 12:11 PM GMT\"\n"),
		]);
		$albumsFolder = $this->createFolder('/alice/files/iCloud Photos/Part 1/Albums', [
			$this->createCsv('Summer.csv', "imgName\nIMG_0001.JPG\nIMG_0002.JPG\nIMG_0004.JPG\nIMG_0005.JPG\nIMG_0404.JPG\n"),
			$this->createCsv('Empty.csv', ''),
		]);
		$memoriesFolder = $this->createFolder('/alice/files/iCloud Photos/Part 1/Memories', [
			$this->createCsv('1. April 2025.csv', "imgName\nIMG_0001.JPG\n"),
		]);

		$this->tags->method('getFavorites')->willReturn([]);
		$this->tags->expects($this->once())->method('addToFavorites')->with($favorite->getId());
		$this->filesMetadataManager->expects($this->exactly(3))->method('saveMetadata');

		$display = $this->runCommand($this->createFolder('/alice/files/iCloud Photos', [
			$this->createFolder('/alice/files/iCloud Photos/Part 1', [$photosFolder, $albumsFolder, $memoriesFolder]),
		]));

		$this->assertSame(gmmktime(12, 11, 0, 6, 4, 2022), $this->takenAt($plain));
		$this->assertTrue($this->metadata[$plain->getId()]->isIndex(OriginalDateTimeMetadataProvider::METADATA_KEY));
		$this->assertSame(gmmktime(8, 0, 0, 6, 5, 2022), $this->takenAt($favorite));
		$this->assertSame(1577872800, $this->takenAt($exif));
		$this->assertSame(gmmktime(12, 11, 0, 6, 4, 2022), $this->takenAt($hidden));
		$this->assertNull($this->takenAt($deleted));
		$this->assertNull($this->takenAt($readOnly));
		$this->assertNull($this->takenAt($withoutDetails));

		$this->assertSame(['Summer', ICloudImporter::HIDDEN_ALBUM], array_keys($this->albums));
		$this->assertSame([$plain->getId(), $favorite->getId()], $this->albumFiles['Summer']);
		$this->assertSame([$hidden->getId()], $this->albumFiles[ICloudImporter::HIDDEN_ALBUM]);

		$this->assertStringContainsString('Media files: 7', $display);
		$this->assertStringContainsString('Media files with details: 6', $display);
		$this->assertStringContainsString('Dated from the export: 3', $display);
		$this->assertStringContainsString('Kept, capture date in EXIF data: 1', $display);
		$this->assertStringContainsString('Not dated, not editable: 1', $display);
		$this->assertStringContainsString('Marked as favorite: 1', $display);
		$this->assertStringContainsString('Skipped, recently deleted in iCloud: 1', $display);
		$this->assertStringContainsString('Created albums: 2', $display);
		$this->assertStringContainsString('Added to albums: 2', $display);
		$this->assertStringContainsString('Added to the album "Hidden (iCloud)": 1', $display);
		$this->assertStringContainsString('Details without media file: 1', $display);
		$this->assertStringContainsString('Album members not found: 1', $display);
		$this->assertStringContainsString('/alice/files/iCloud Photos/Part 1/Photos/IMG_0002.JPG: favorite', $display);
	}

	public function testDryRunChangesNothing(): void {
		$photo = $this->createMedia('IMG_0001.JPG');
		$folder = $this->createFolder('/alice/files/iCloud Photos', [
			$this->createFolder('/alice/files/iCloud Photos/Photos', [
				$photo,
				$this->createCsv('Photo Details.csv', self::HEADER
					. "IMG_0001.JPG,a,yes,no,no,\"Saturday June 4,2022 12:11 PM GMT\",1,\"Saturday June 4,2022 12:11 PM GMT\"\n"),
			]),
			$this->createFolder('/alice/files/iCloud Photos/Albums', [
				$this->createCsv('Summer.csv', "imgName\nIMG_0001.JPG\n"),
			]),
		]);

		$this->tags->method('getFavorites')->willReturn([]);
		$this->tags->expects($this->never())->method('addToFavorites');
		$this->filesMetadataManager->expects($this->never())->method('saveMetadata');
		$this->albumMapper->expects($this->never())->method('create');
		$this->albumMapper->expects($this->never())->method('addFile');

		$display = $this->runCommand($folder, ['--dry-run' => true]);

		$this->assertStringContainsString('Would be dated from the export: 1', $display);
		$this->assertStringContainsString('Would be marked as favorite: 1', $display);
		$this->assertStringContainsString('Would be created albums: 1', $display);
		$this->assertStringContainsString('Would be added to albums: 1', $display);
	}

	public function testDuplicateNamesAcrossParts(): void {
		$first = $this->createMedia('IMG_0403.MOV');
		$second = $this->createMedia('IMG_0403.MOV');
		$moved = $this->createMedia('IMG_0500.JPG');

		$folder = $this->createFolder('/alice/files/iCloud Photos', [
			$this->createFolder('/alice/files/iCloud Photos/Part 1', [
				$this->createFolder('/alice/files/iCloud Photos/Part 1/Photos', [
					$first,
					$this->createCsv('Photo Details.csv', self::HEADER
						. "IMG_0403.MOV,a,no,no,no,\"Thursday August 29,2013 7:08 AM GMT\",0,\"Wednesday September 4,2013 9:10 PM GMT\"\n"
						. "IMG_0500.JPG,b,no,no,no,\"Saturday June 4,2022 12:11 PM GMT\",1,\"Saturday June 4,2022 12:11 PM GMT\"\n"),
				]),
				$this->createFolder('/alice/files/iCloud Photos/Part 1/Albums', [
					$this->createCsv('Trip.csv', "imgName\nIMG_0403.MOV\nIMG_0500.JPG\n"),
				]),
			]),
			$this->createFolder('/alice/files/iCloud Photos/Part 2', [
				$this->createFolder('/alice/files/iCloud Photos/Part 2/Photos', [
					$second,
					$this->createCsv('Photo Details.csv', self::HEADER
						. "IMG_0403.MOV,c,no,no,no,\"Wednesday October 11,2017 3:53 PM GMT\",0,\"Wednesday October 11,2017 3:53 PM GMT\"\n"),
				]),
				$this->createFolder('/alice/files/iCloud Photos/Part 2/Elsewhere', [$moved]),
				$this->createFolder('/alice/files/iCloud Photos/Part 2/Albums', [
					$this->createCsv('Trip.csv', "imgName\nIMG_0500.JPG\n"),
				]),
			]),
		]);
		$this->tags->method('getFavorites')->willReturn([]);

		$display = $this->runCommand($folder);

		$this->assertSame(gmmktime(7, 8, 0, 8, 29, 2013), $this->takenAt($first));
		$this->assertSame(gmmktime(15, 53, 0, 10, 11, 2017), $this->takenAt($second));
		$this->assertSame(gmmktime(12, 11, 0, 6, 4, 2022), $this->takenAt($moved));

		$this->assertSame(['Trip'], array_keys($this->albums));
		$this->assertSame([$moved->getId()], $this->albumFiles['Trip']);
		$this->assertStringContainsString('Album members skipped, file name not unique: 1', $display);
	}

	public function testRerunKeepsExistingAlbumsAndFavorites(): void {
		$photo = $this->createMedia('IMG_0001.JPG', [OriginalDateTimeMetadataProvider::METADATA_KEY => gmmktime(12, 11, 0, 6, 4, 2022)]);
		$this->albums['Summer'] = new AlbumInfo(7, 'alice', 'Summer', '', 0, -1);
		$this->albumFiles['Summer'] = [$photo->getId()];

		$folder = $this->createFolder('/alice/files/iCloud Photos', [
			$this->createFolder('/alice/files/iCloud Photos/Photos', [
				$photo,
				$this->createCsv('Photo Details.csv', self::HEADER
					. "IMG_0001.JPG,a,yes,no,no,\"Saturday June 4,2022 12:11 PM GMT\",1,\"Saturday June 4,2022 12:11 PM GMT\"\n"),
			]),
			$this->createFolder('/alice/files/iCloud Photos/Albums', [
				$this->createCsv('Summer.csv', "imgName\nIMG_0001.JPG\n"),
			]),
		]);

		$this->tags->method('getFavorites')->willReturn([$photo->getId()]);
		$this->tags->expects($this->never())->method('addToFavorites');
		$this->filesMetadataManager->expects($this->never())->method('saveMetadata');
		$this->albumMapper->expects($this->never())->method('create');
		$this->albumMapper->expects($this->never())->method('addFile');

		$display = $this->runCommand($folder);

		$this->assertStringContainsString('Dated from the export: 0', $display);
		$this->assertStringContainsString('Created albums: 0', $display);
		$this->assertStringContainsString('Added to albums: 0', $display);
	}

	public function testFailsForUnknownUserOrFolder(): void {
		$this->assertSame(1, $this->commandTester->execute(['user' => 'bob', 'folder' => 'iCloud Photos']));
		$this->assertStringContainsString('User bob was not found', $this->commandTester->getDisplay());

		$this->userFolder->method('get')->willReturn($this->createMock(File::class));
		$this->assertSame(1, $this->commandTester->execute(['user' => 'alice', 'folder' => 'iCloud Photos']));
		$this->assertStringContainsString('Folder iCloud Photos was not found', $this->commandTester->getDisplay());
	}
}
