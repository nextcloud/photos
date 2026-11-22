<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Listener;

use OC\FilesMetadata\Model\FilesMetadata;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\XmpSidecarMetadataProvider;
use OCA\Photos\Xmp\XmpPacket;
use OCA\Photos\Xmp\XmpSidecarManager;
use OCP\Files\File;
use OCP\Files\Storage\IStorage;
use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class XmpSidecarMetadataProviderTest extends TestCase {
	private XmpSidecarManager&MockObject $xmpSidecarManager;
	private XmpSidecarMetadataProvider $provider;
	private FilesMetadata $metadata;

	protected function setUp(): void {
		parent::setUp();

		$this->xmpSidecarManager = $this->createMock(XmpSidecarManager::class);
		$this->provider = new XmpSidecarMetadataProvider($this->xmpSidecarManager);
		$this->metadata = new FilesMetadata(42);
	}

	private function createPhoto(string $mimeType = 'image/jpeg', bool $local = true): File {
		$storage = $this->createMock(IStorage::class);
		$storage->method('isLocal')->willReturn($local);

		$photo = $this->createMock(File::class);
		$photo->method('getMimeType')->willReturn($mimeType);
		$photo->method('getStorage')->willReturn($storage);

		return $photo;
	}

	private function sidecar(string $sample): XmpPacket {
		return XmpPacket::fromString((string)file_get_contents(__DIR__ . '/../Xmp/samples/' . $sample));
	}

	public function testPrefersTheValuesOfTheSidecar(): void {
		$this->metadata->setArray(ExifMetadataProvider::METADATA_KEY_EXIF, ['DateTimeOriginal' => '2010:01:01 00:00:00', 'Model' => 'X-T3']);
		$this->metadata->setArray(ExifMetadataProvider::METADATA_KEY_GPS, ['latitude' => 1.0, 'longitude' => 2.0, 'altitude' => 30.0]);
		$this->xmpSidecarManager->method('read')->willReturn($this->sidecar('lightroom.xmp'));

		$this->provider->handle(new MetadataBackgroundEvent($this->createPhoto(), $this->metadata));

		$this->assertSame(
			['DateTimeOriginal' => '2022:12:24 16:05:31', 'Model' => 'X-T3', 'OffsetTimeOriginal' => '+01:00'],
			$this->metadata->getArray(ExifMetadataProvider::METADATA_KEY_EXIF),
		);
		$gps = $this->metadata->getArray(ExifMetadataProvider::METADATA_KEY_GPS);
		$this->assertSame(['latitude', 'longitude'], array_keys($gps));
		$this->assertEqualsWithDelta(38.71136, $gps['latitude'], 0.000001);
	}

	/**
	 * The offset of the embedded date does not apply to the date of the
	 * sidecar.
	 */
	public function testDropsTheOffsetOfTheEmbeddedDate(): void {
		$this->metadata->setArray(ExifMetadataProvider::METADATA_KEY_EXIF, ['DateTimeOriginal' => '2010:01:01 00:00:00', 'OffsetTimeOriginal' => '+09:00']);
		$this->xmpSidecarManager->method('read')->willReturn($this->sidecar('darktable.jpg.xmp'));

		$this->provider->handle(new MetadataLiveEvent($this->createPhoto(), $this->metadata));

		$this->assertSame(['DateTimeOriginal' => '2019:08:17 12:34:56'], $this->metadata->getArray(ExifMetadataProvider::METADATA_KEY_EXIF));
	}

	public function testLeavesTheMetadataAloneWithoutASidecar(): void {
		$this->xmpSidecarManager->method('read')->willReturn(null);

		$this->provider->handle(new MetadataLiveEvent($this->createPhoto('video/mp4'), $this->metadata));

		$this->assertSame([], $this->metadata->getKeys());
	}

	public function testReadsTheSidecarOfPicturesOnRemoteStorageInTheBackground(): void {
		$this->xmpSidecarManager->expects($this->never())->method('read');

		$event = new MetadataLiveEvent($this->createPhoto(local: false), $this->metadata);
		$this->provider->handle($event);

		$this->assertTrue($event->isRunAsBackgroundJobRequested());
	}

	public function testIgnoresFilesWhichAreNotMedia(): void {
		$this->xmpSidecarManager->expects($this->never())->method('read');

		$this->provider->handle(new MetadataLiveEvent($this->createPhoto('application/octet-stream'), $this->metadata));
	}
}
