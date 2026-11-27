<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Unit\DemoLibrary;

use OC\FilesMetadata\Model\FilesMetadata;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Tests\DemoLibrary\DemoLibrary;
use OCA\Photos\Tests\DemoLibrary\ExifWriter;
use OCP\Files\File;
use OCP\Files\Storage\IStorage;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use Psr\Log\LoggerInterface;
use Test\TestCase;

require_once __DIR__ . '/../../demo-library/ExifWriter.php';
require_once __DIR__ . '/../../demo-library/DemoLibrary.php';

class DemoLibraryTest extends TestCase {
	private const END = 1795392000; // 2026-11-23

	public function testExifIsReadBackByPhp(): void {
		$jpeg = ExifWriter::addTo($this->blankJpeg(), '2019:07:04 18:30:05', -33.92, 18.42, 'Maker', 'Model X');

		$exif = exif_read_data($this->stream($jpeg), 'EXIF, GPS, IFD0', true);

		$this->assertSame('2019:07:04 18:30:05', $exif['EXIF']['DateTimeOriginal']);
		$this->assertSame('Maker', $exif['IFD0']['Make']);
		$this->assertSame('Model X', $exif['IFD0']['Model']);
		$this->assertSame('S', $exif['GPS']['GPSLatitudeRef']);
		$this->assertSame(['33/1', '55/1', '1200/100'], $exif['GPS']['GPSLatitude']);
		$this->assertSame('E', $exif['GPS']['GPSLongitudeRef']);
		$this->assertSame(['18/1', '25/1', '1200/100'], $exif['GPS']['GPSLongitude']);
		$this->assertNotFalse(imagecreatefromstring($jpeg));
	}

	public function testRenderedPhotoIsReadBackByTheMetadataProviders(): void {
		$photo = DemoLibrary::plan(50, 3, self::END)[20];
		$jpeg = DemoLibrary::render($photo, 64);

		$storage = $this->createMock(IStorage::class);
		$storage->method('isLocal')->willReturn(true);
		$node = $this->createMock(File::class);
		$node->method('getSize')->willReturn(strlen($jpeg));
		$node->method('getMimeType')->willReturn('image/jpeg');
		$node->method('getStorage')->willReturn($storage);
		$node->method('fopen')->willReturn($this->stream($jpeg));
		// A name the date cannot be parsed from, so it has to come from the EXIF data
		$node->method('getName')->willReturn('photo.jpg');

		$logger = $this->createMock(LoggerInterface::class);
		$event = new MetadataLiveEvent($node, new FilesMetadata(1));
		(new ExifMetadataProvider($logger))->handle($event);
		(new OriginalDateTimeMetadataProvider($logger))->handle($event);
		$metadata = $event->getMetadata();

		$this->assertSame($photo['timestamp'], $metadata->getInt(OriginalDateTimeMetadataProvider::METADATA_KEY));
		$gps = $metadata->getArray(ExifMetadataProvider::METADATA_KEY_GPS);
		$this->assertEqualsWithDelta($photo['latitude'], $gps['latitude'], 0.00001);
		$this->assertEqualsWithDelta($photo['longitude'], $gps['longitude'], 0.00001);
	}

	public function testPlanIsDeterministicAndSorted(): void {
		$photos = DemoLibrary::plan(2000, 42, self::END);

		$this->assertSame($photos, DemoLibrary::plan(2000, 42, self::END));
		$this->assertNotEquals($photos, DemoLibrary::plan(2000, 43, self::END));
		$this->assertCount(2000, $photos);
		$this->assertCount(2000, array_unique(array_column($photos, 'path')));

		$timestamps = array_column($photos, 'timestamp');
		$sorted = $timestamps;
		sort($sorted);
		$this->assertSame($sorted, $timestamps);
		$this->assertGreaterThan(self::END - 15 * 366 * 86400, $timestamps[0]);
		$this->assertLessThan(self::END + 86400, end($timestamps));

		foreach ($photos as $photo) {
			$this->assertSame(gmdate('Y/m/\I\M\G_Ymd_His', $photo['timestamp']), substr($photo['path'], 0, 27));
			$this->assertEqualsWithDelta(0, $photo['latitude'], 90);
			$this->assertEqualsWithDelta(0, $photo['longitude'], 180);
		}
	}

	public function testPlanRejectsTooManyPhotos(): void {
		$this->expectException(\InvalidArgumentException::class);
		DemoLibrary::plan(DemoLibrary::MAX_COUNT + 1, 1, self::END);
	}

	private function blankJpeg(): string {
		ob_start();
		imagejpeg(imagecreatetruecolor(8, 8));
		return ob_get_clean();
	}

	/**
	 * @return resource
	 */
	private function stream(string $content) {
		$stream = fopen('php://memory', 'r+');
		fwrite($stream, $content);
		rewind($stream);
		return $stream;
	}
}
