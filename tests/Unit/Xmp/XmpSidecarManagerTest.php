<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Xmp;

use OC\Files\Storage\Temporary;
use OCA\Photos\Xmp\XmpPacket;
use OCA\Photos\Xmp\XmpSidecarManager;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\Mount\IMountPoint;
use OCP\Files\NotFoundException;
use OCP\IDateTimeZone;
use OCP\ITagManager;
use OCP\ITags;
use OCP\SystemTag\ISystemTag;
use OCP\SystemTag\ISystemTagManager;
use OCP\SystemTag\ISystemTagObjectMapper;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

/**
 * @group DB
 */
class XmpSidecarManagerTest extends TestCase {
	private const PHOTO_ID = 42;
	private const TAKEN_AT = 1594755000; // 2020-07-14 19:30:00 UTC

	private Temporary $storage;
	private ITags&MockObject $favorites;
	private ISystemTagObjectMapper&MockObject $systemTagObjectMapper;
	private ISystemTagManager&MockObject $systemTagManager;
	private XmpSidecarManager $manager;
	private bool $folderCreatable = true;
	private bool $sidecarUpdateable = true;

	protected function setUp(): void {
		parent::setUp();

		$this->storage = new Temporary();
		$this->storage->mkdir('Photos');

		$dateTimeZone = $this->createMock(IDateTimeZone::class);
		$dateTimeZone->method('getTimeZone')->with(self::TAKEN_AT, 'alice')->willReturn(new \DateTimeZone('Europe/Paris'));

		$this->favorites = $this->createMock(ITags::class);
		$tagManager = $this->createMock(ITagManager::class);
		$tagManager->method('load')->with('files', [], false, 'alice')->willReturn($this->favorites);

		$this->systemTagObjectMapper = $this->createMock(ISystemTagObjectMapper::class);
		$this->systemTagManager = $this->createMock(ISystemTagManager::class);

		$this->manager = new XmpSidecarManager(
			$dateTimeZone,
			$tagManager,
			$this->systemTagObjectMapper,
			$this->systemTagManager,
			$this->createMock(LoggerInterface::class),
		);
	}

	protected function tearDown(): void {
		$this->storage->cleanUp();
		parent::tearDown();
	}

	/**
	 * A photo in the Photos folder of the temporary storage, whose sibling
	 * files are looked up in that storage.
	 */
	private function createPhoto(string $name = 'IMG_1234.jpg', string $photoMountPoint = '/alice/files/'): File {
		$folder = $this->createMock(Folder::class);
		$folder->method('getMountPoint')->willReturn($this->createMountPoint('/alice/files/'));
		$folder->method('isCreatable')->willReturnCallback(fn () => $this->folderCreatable);
		$folder->method('getStorage')->willReturn($this->storage);
		$folder->method('getInternalPath')->willReturn('Photos');
		$folder->method('get')->willReturnCallback(function (string $name): File {
			$path = 'Photos/' . $name;
			if (!$this->storage->file_exists($path)) {
				throw new NotFoundException();
			}
			$file = $this->createMock(File::class);
			$file->method('getName')->willReturn($name);
			$file->method('getSize')->willReturn($this->storage->filesize($path));
			$file->method('getContent')->willReturn($this->storage->file_get_contents($path));
			$file->method('isUpdateable')->willReturn($this->sidecarUpdateable);
			return $file;
		});

		$photo = $this->createMock(File::class);
		$photo->method('getName')->willReturn($name);
		$photo->method('getId')->willReturn(self::PHOTO_ID);
		$photo->method('getParent')->willReturn($folder);
		$photo->method('getMountPoint')->willReturn($this->createMountPoint($photoMountPoint));

		return $photo;
	}

	private function readSidecar(string $name = 'IMG_1234.jpg.xmp'): XmpPacket {
		return XmpPacket::fromString((string)$this->storage->file_get_contents('Photos/' . $name));
	}

	private function copySample(string $sample, string $name): string {
		$content = (string)file_get_contents(__DIR__ . '/samples/' . $sample);
		$this->storage->file_put_contents('Photos/' . $name, $content);
		return $content;
	}

	public function testListsTheSidecarNamesByPreference(): void {
		$this->assertSame(['IMG_1234.jpg.xmp', 'IMG_1234.xmp'], XmpSidecarManager::getSidecarNames('IMG_1234.jpg'));
		$this->assertSame(['README.xmp'], XmpSidecarManager::getSidecarNames('README'));
	}

	public function testCreatesASidecarNamedAfterThePhoto(): void {
		$this->favorites->method('getTagsForObjects')->willReturn([self::PHOTO_ID => [ITags::TAG_FAVORITE]]);
		$this->systemTagObjectMapper->method('getTagIdsForObjects')->willReturn([(string)self::PHOTO_ID => ['1', '2']]);
		$this->systemTagManager->method('getTagsByIds')->with(['1', '2'])->willReturn([
			'1' => $this->createTag('Holiday', true),
			'2' => $this->createTag('Internal', false),
		]);

		$this->assertTrue($this->manager->write($this->createPhoto(), 'alice', [
			'takenAt' => self::TAKEN_AT,
			'gps' => ['latitude' => 48.8583, 'longitude' => 2.2945],
		]));

		$packet = $this->readSidecar();
		// Written in the time zone of the user, as other tools show the time as it is written.
		$this->assertSame('2020-07-14T21:30:00+02:00', $packet->getDateTimeOriginal()?->format('Y-m-d\TH:i:sP'));
		$this->assertEqualsWithDelta(48.8583, $packet->getCoordinates()['latitude'] ?? null, 0.000001);
		$this->assertSame(5, $packet->getRating());
		$this->assertSame(['Holiday'], $packet->getSubjects());
		$this->assertSame(['IMG_1234.jpg.xmp'], $this->listFolder());
	}

	public function testMergesIntoTheSidecarOfAnotherTool(): void {
		$this->copySample('darktable.jpg.xmp', 'IMG_1234.jpg.xmp');

		$this->assertTrue($this->manager->write($this->createPhoto(), 'alice', ['gps' => ['latitude' => -33.8568, 'longitude' => 151.2153]]));

		$content = (string)$this->storage->file_get_contents('Photos/IMG_1234.jpg.xmp');
		$this->assertStringContainsString('darktable:operation="exposure"', $content);
		$packet = $this->readSidecar();
		$this->assertEqualsWithDelta(-33.8568, $packet->getCoordinates()['latitude'] ?? null, 0.000001);
		// Values which were not edited are left as they are.
		$this->assertSame('2019-08-17 12:34:56', $packet->getDateTimeOriginal()?->format('Y-m-d H:i:s'));
		$this->assertSame(3, $packet->getRating());
		$this->assertSame(['holiday', 'darktable|format|jpg'], $packet->getSubjects());
	}

	public function testUpdatesALightroomSidecarWhenItIsTheOnlyOne(): void {
		$this->copySample('lightroom.xmp', 'IMG_1234.xmp');

		$this->assertTrue($this->manager->write($this->createPhoto(), 'alice', ['takenAt' => null]));

		$this->assertSame(['IMG_1234.xmp'], $this->listFolder());
		$this->assertNull($this->readSidecar('IMG_1234.xmp')->getDateTimeOriginal());
	}

	public function testPrefersTheSidecarNamedAfterTheWholeFileName(): void {
		$this->copySample('lightroom.xmp', 'IMG_1234.xmp');
		$this->copySample('darktable.jpg.xmp', 'IMG_1234.jpg.xmp');

		$this->assertSame(3, $this->manager->read($this->createPhoto())?->getRating());
	}

	public function testReadsNothingWithoutASidecar(): void {
		$this->assertNull($this->manager->read($this->createPhoto()));
	}

	public function testNeverReplacesASidecarItCannotRead(): void {
		$this->storage->file_put_contents('Photos/IMG_1234.jpg.xmp', 'not xml');

		$this->assertFalse($this->manager->write($this->createPhoto(), 'alice', ['takenAt' => self::TAKEN_AT]));
		$this->assertSame('not xml', $this->storage->file_get_contents('Photos/IMG_1234.jpg.xmp'));
		$this->assertNull($this->manager->read($this->createPhoto()));
	}

	public function testWritesNothingInAFolderTheUserCannotWrite(): void {
		$this->folderCreatable = false;

		$this->assertFalse($this->manager->write($this->createPhoto(), 'alice', ['takenAt' => self::TAKEN_AT]));
		$this->assertSame([], $this->listFolder());
	}

	public function testLeavesASidecarTheUserCannotWriteAlone(): void {
		$original = $this->copySample('darktable.jpg.xmp', 'IMG_1234.jpg.xmp');
		$this->sidecarUpdateable = false;

		$this->assertFalse($this->manager->write($this->createPhoto(), 'alice', ['takenAt' => self::TAKEN_AT]));
		$this->assertSame($original, $this->storage->file_get_contents('Photos/IMG_1234.jpg.xmp'));
	}

	public function testWritesNothingForAPhotoSharedOnItsOwn(): void {
		$this->assertFalse($this->manager->write($this->createPhoto('IMG_1234.jpg', '/alice/files/IMG_1234.jpg/'), 'alice', ['takenAt' => self::TAKEN_AT]));
		$this->assertSame([], $this->listFolder());
	}

	private function createMountPoint(string $mountPoint): IMountPoint {
		$mount = $this->createMock(IMountPoint::class);
		$mount->method('getMountPoint')->willReturn($mountPoint);
		return $mount;
	}

	private function createTag(string $name, bool $visible): ISystemTag {
		$tag = $this->createMock(ISystemTag::class);
		$tag->method('getName')->willReturn($name);
		$tag->method('isUserVisible')->willReturn($visible);
		return $tag;
	}

	/**
	 * @return list<string> Names in the Photos folder, part files included
	 */
	private function listFolder(): array {
		$names = [];
		$directory = $this->storage->opendir('Photos');
		while (($name = readdir($directory)) !== false) {
			if ($name !== '.' && $name !== '..') {
				$names[] = $name;
			}
		}
		sort($names);
		return $names;
	}
}
