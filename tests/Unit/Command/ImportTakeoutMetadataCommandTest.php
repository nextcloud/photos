<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Command;

use OC\FilesMetadata\Model\FilesMetadata;
use OCA\Photos\Command\ImportTakeoutMetadataCommand;
use OCA\Photos\Import\TakeoutImporter;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCA\Photos\Service\MediaPlaceManager;
use OCA\Photos\Service\TakeoutSidecarService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IFilesMetadata;
use OCP\IL10N;
use OCP\IUser;
use OCP\IUserManager;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Tester\CommandTester;
use Test\TestCase;

class ImportTakeoutMetadataCommandTest extends TestCase {
	private const TAKEN_AT = 1561982400;
	private const SIDECAR = '{"photoTakenTime":{"timestamp":"1561982400"},"geoData":{"latitude":48.85,"longitude":2.29,"altitude":0.0}}';

	private IUserManager&MockObject $userManager;
	private IUserFolder&MockObject $userFolder;
	private IFilesMetadataManager&MockObject $filesMetadataManager;
	private MediaPlaceManager&MockObject $mediaPlaceManager;
	private CommandTester $commandTester;

	/** @var array<int, IFilesMetadata> Metadata, by file id */
	private array $metadata = [];
	private int $lastFileId = 0;

	protected function setUp(): void {
		parent::setUp();

		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn('alice');

		$this->userManager = $this->createMock(IUserManager::class);
		$this->userManager->method('get')
			->willReturnCallback(fn (string $uid): ?IUser => $uid === 'alice' ? $user : null);

		$this->userFolder = $this->createMock(IUserFolder::class);
		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->with('alice')->willReturn($this->userFolder);

		$this->filesMetadataManager = $this->createMock(IFilesMetadataManager::class);
		$this->filesMetadataManager->method('getMetadataForNode')
			->willReturnCallback(fn (Node $node): IFilesMetadata => $this->metadata[$node->getId()]);

		$this->mediaPlaceManager = $this->createMock(MediaPlaceManager::class);
		$this->mediaPlaceManager->method('getPlaceForMetadata')->willReturn('Paris');

		$this->commandTester = new CommandTester(new ImportTakeoutMetadataCommand(
			$this->userManager,
			$rootFolder,
			new TakeoutImporter(
				$this->filesMetadataManager,
				$this->mediaPlaceManager,
				new TakeoutSidecarService(),
				$this->createMock(IL10N::class),
			),
		));
	}

	/**
	 * @param array<string, mixed> $values Stored metadata values, by key
	 */
	private function createFile(string $name, string $mimeType, array $values = [], bool $updateable = true): File&MockObject {
		$fileId = ++$this->lastFileId;

		$storedMetadata = new FilesMetadata($fileId);
		foreach ($values as $key => $value) {
			match (true) {
				is_int($value) => $storedMetadata->setInt($key, $value, true),
				is_array($value) => $storedMetadata->setArray($key, $value),
				default => $storedMetadata->setString($key, (string)$value, true),
			};
		}
		$this->metadata[$fileId] = (new FilesMetadata($fileId))->import($storedMetadata->jsonSerialize());

		$file = $this->createMock(File::class);
		$file->method('getId')->willReturn($fileId);
		$file->method('getName')->willReturn($name);
		$file->method('getPath')->willReturn('/alice/files/Takeout/' . $name);
		$file->method('getMimeType')->willReturn($mimeType);
		$file->method('isUpdateable')->willReturn($updateable);

		return $file;
	}

	private function createSidecar(string $name, string $content = self::SIDECAR): File&MockObject {
		$file = $this->createFile($name, 'application/json');
		$file->method('getSize')->willReturn(strlen($content));
		$file->method('getContent')->willReturn($content);

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

	/**
	 * @param list<Node> $nodes
	 * @param array<string, mixed> $options
	 */
	private function runCommand(array $nodes, array $options = []): string {
		$this->userFolder->method('get')->with('Takeout')->willReturn($this->createFolder($nodes));

		$exitCode = $this->commandTester->execute(
			['user' => 'alice', 'folder' => 'Takeout', ...$options],
			['verbosity' => OutputInterface::VERBOSITY_VERBOSE],
		);
		$this->assertSame(0, $exitCode);

		return $this->commandTester->getDisplay();
	}

	public function testAppliesTheSidecarToMediaWithoutExifDate(): void {
		$photo = $this->createFile('IMG_1234.jpg', 'image/jpeg', [OriginalDateTimeMetadataProvider::METADATA_KEY => 1700000000]);
		$video = $this->createFile('VID_1234(1).mp4', 'video/mp4');

		$this->filesMetadataManager->expects($this->exactly(2))->method('saveMetadata');

		$display = $this->runCommand([
			$photo,
			$this->createSidecar('IMG_1234.jpg.supplemental-metadata.json'),
			$video,
			$this->createSidecar('VID_1234.mp4(1).json', '{"photoTakenTime":{"timestamp":"1500000000"}}'),
		]);

		$metadata = $this->metadata[$photo->getId()];
		$this->assertSame(self::TAKEN_AT, $metadata->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY));
		$this->assertTrue($metadata->isIndex(OriginalDateTimeMetadataProvider::METADATA_KEY));
		$this->assertSame(['latitude' => 48.85, 'longitude' => 2.29], $metadata->getArray(ExifMetadataProvider::METADATA_KEY_GPS));
		$this->assertSame('Paris', $metadata->getString(PlaceMetadataProvider::METADATA_KEY));

		$metadata = $this->metadata[$video->getId()];
		$this->assertSame(1500000000, $metadata->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY));
		$this->assertFalse($metadata->hasKey(ExifMetadataProvider::METADATA_KEY_GPS));

		$this->assertStringContainsString('Media files: 2', $display);
		$this->assertStringContainsString('Updated: 2', $display);
		$this->assertStringContainsString('/alice/files/Takeout/IMG_1234.jpg: updated', $display);
	}

	public function testSkipsMediaWithExifDate(): void {
		$photo = $this->createFile('IMG_1234.jpg', 'image/jpeg', [
			ExifMetadataProvider::METADATA_KEY_EXIF => ['DateTimeOriginal' => '2020:01:01 10:00:00'],
			OriginalDateTimeMetadataProvider::METADATA_KEY => 1577872800,
		]);

		$this->filesMetadataManager->expects($this->never())->method('saveMetadata');

		$display = $this->runCommand([$photo, $this->createSidecar('IMG_1234.jpg.json')]);

		$this->assertSame(1577872800, $this->metadata[$photo->getId()]->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY));
		$this->assertStringContainsString('Skipped, capture date in EXIF data: 1', $display);
	}

	public function testForceReplacesTheExifDateAndPosition(): void {
		$photo = $this->createFile('IMG_1234.jpg', 'image/jpeg', [
			ExifMetadataProvider::METADATA_KEY_EXIF => ['DateTimeOriginal' => '2020:01:01 10:00:00'],
			ExifMetadataProvider::METADATA_KEY_GPS => ['latitude' => 1.0, 'longitude' => 2.0],
			OriginalDateTimeMetadataProvider::METADATA_KEY => 1577872800,
		]);

		$this->filesMetadataManager->expects($this->once())->method('saveMetadata')
			->with($this->metadata[$photo->getId()]);

		$display = $this->runCommand([$photo, $this->createSidecar('IMG_1234.jpg.json')], ['--force' => true]);

		$metadata = $this->metadata[$photo->getId()];
		$this->assertSame(self::TAKEN_AT, $metadata->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY));
		$this->assertSame(['latitude' => 48.85, 'longitude' => 2.29], $metadata->getArray(ExifMetadataProvider::METADATA_KEY_GPS));
		$this->assertStringContainsString('Updated: 1', $display);
	}

	public function testKeepsAnExistingPositionWithoutForce(): void {
		$photo = $this->createFile('IMG_1234.jpg', 'image/jpeg', [
			ExifMetadataProvider::METADATA_KEY_GPS => ['latitude' => 1.0, 'longitude' => 2.0],
			PlaceMetadataProvider::METADATA_KEY => 'Somewhere',
		]);

		$this->mediaPlaceManager->expects($this->never())->method('getPlaceForMetadata');

		$this->runCommand([$photo, $this->createSidecar('IMG_1234.jpg.json')]);

		$metadata = $this->metadata[$photo->getId()];
		$this->assertSame(self::TAKEN_AT, $metadata->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY));
		$this->assertSame(['latitude' => 1.0, 'longitude' => 2.0], $metadata->getArray(ExifMetadataProvider::METADATA_KEY_GPS));
		$this->assertSame('Somewhere', $metadata->getString(PlaceMetadataProvider::METADATA_KEY));
	}

	public function testDryRunDoesNotSave(): void {
		$photo = $this->createFile('IMG_1234.jpg', 'image/jpeg');

		$this->filesMetadataManager->expects($this->never())->method('saveMetadata');

		$display = $this->runCommand([$photo, $this->createSidecar('IMG_1234.jpg.json')], ['--dry-run' => true]);

		$this->assertStringContainsString('Would be updated: 1', $display);
	}

	public function testDoesNotSaveUnchangedMetadata(): void {
		$photo = $this->createFile('IMG_1234.jpg', 'image/jpeg', [
			OriginalDateTimeMetadataProvider::METADATA_KEY => self::TAKEN_AT,
			ExifMetadataProvider::METADATA_KEY_GPS => ['latitude' => 48.85, 'longitude' => 2.29],
		]);

		$this->filesMetadataManager->expects($this->never())->method('saveMetadata');

		$display = $this->runCommand([$photo, $this->createSidecar('IMG_1234.jpg.json')], ['--force' => true]);

		$this->assertStringContainsString('Already up to date: 1', $display);
	}

	public function testReportsSkippedFiles(): void {
		$readOnly = $this->createFile('shared.jpg', 'image/jpeg', [], false);
		$readOnlySidecar = $this->createSidecar('shared.jpg.json');
		$readOnlySidecar->expects($this->never())->method('getContent');

		$tooBig = $this->createFile('huge.jpg', 'image/jpeg');
		$tooBigSidecar = $this->createFile('huge.jpg.json', 'application/json');
		$tooBigSidecar->method('getSize')->willReturn(TakeoutSidecarService::MAX_SIDECAR_SIZE + 1);
		$tooBigSidecar->expects($this->never())->method('getContent');

		$this->filesMetadataManager->expects($this->never())->method('saveMetadata');

		$display = $this->runCommand([
			$this->createFile('lonely.jpg', 'image/jpeg'),
			$this->createFile('empty.jpg', 'image/jpeg'),
			$this->createSidecar('empty.jpg.json', '{"creationTime":{"timestamp":"1700000000"}}'),
			$tooBig,
			$tooBigSidecar,
			$readOnly,
			$readOnlySidecar,
			$this->createFile('notes.txt', 'text/plain'),
			$this->createFile('2019', 'application/octet-stream'),
			$this->createSidecar('notes.txt.json'),
			$this->createSidecar('metadata.json'),
		]);

		$this->assertStringContainsString('Media files: 4', $display);
		$this->assertStringContainsString('Updated: 0', $display);
		$this->assertStringContainsString('Skipped, no sidecar: 1', $display);
		$this->assertStringContainsString('Skipped, sidecar without date or position: 2', $display);
		$this->assertStringContainsString('Skipped, not editable: 1', $display);
	}

	public function testWalksSubfolders(): void {
		$photo = $this->createFile('IMG_1234.jpg', 'image/jpeg');
		$album = $this->createFolder([$photo, $this->createSidecar('IMG_1234.jpg.json')]);

		$this->runCommand([$album, $this->createSidecar('IMG_1234.jpg.json', '{"photoTakenTime":{"timestamp":"1"}}')]);

		$this->assertSame(self::TAKEN_AT, $this->metadata[$photo->getId()]->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY));
	}

	public function testFailsForUnknownUser(): void {
		$this->assertSame(1, $this->commandTester->execute(['user' => 'bob', 'folder' => 'Takeout']));
		$this->assertStringContainsString('User bob was not found', $this->commandTester->getDisplay());
	}

	public function testFailsForMissingFolder(): void {
		$this->userFolder->method('get')->willThrowException(new NotFoundException());

		$this->assertSame(1, $this->commandTester->execute(['user' => 'alice', 'folder' => 'Takeout']));
		$this->assertStringContainsString('Folder Takeout was not found', $this->commandTester->getDisplay());
	}

	public function testFailsForFile(): void {
		$this->userFolder->method('get')->willReturn($this->createFile('Takeout', 'image/jpeg'));

		$this->assertSame(1, $this->commandTester->execute(['user' => 'alice', 'folder' => 'Takeout']));
		$this->assertStringContainsString('Folder Takeout was not found', $this->commandTester->getDisplay());
	}
}
