<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Listener;

use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\SizeMetadataProvider;
use OCP\Files\File;
use OCP\Files\Storage\IStorage;
use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use OCP\FilesMetadata\Model\IFilesMetadata;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

class ImageOrientationMetadataTest extends TestCase {

	public static function metadataEvents(): array {
		return [
			'live' => [MetadataLiveEvent::class],
			'background' => [MetadataBackgroundEvent::class],
		];
	}

	/**
	 * @dataProvider metadataEvents
	 * @requires extension exif
	 * @requires extension mbstring
	 * @param class-string<MetadataLiveEvent|MetadataBackgroundEvent> $eventClass
	 */
	public function testOrientationWithoutExifOrGpsSections(string $eventClass): void {
		$path = __DIR__ . '/fixtures/ifd0-orientation.jpg';
		$stream = fopen($path, 'rb');
		$storage = $this->createMock(IStorage::class);
		$storage->method('isLocal')->willReturn(true);

		$node = $this->createMock(File::class);
		$node->method('getStorage')->willReturn($storage);
		$node->method('getSize')->willReturn(filesize($path));
		$node->method('getMimeType')->willReturn('image/jpeg');
		$node->method('fopen')->with('rb')->willReturn($stream);
		$node->method('getContent')->willReturn(file_get_contents($path));

		$values = [];
		$metadata = $this->createMock(IFilesMetadata::class);
		$metadata->method('setArray')->willReturnCallback(function (string $key, array $value) use (&$values, $metadata): IFilesMetadata {
			$values[$key] = $value;
			return $metadata;
		});
		$metadata->method('hasKey')->willReturnCallback(function (string $key) use (&$values): bool {
			return array_key_exists($key, $values);
		});
		$metadata->method('getArray')->willReturnCallback(function (string $key) use (&$values): array {
			return $values[$key];
		});

		$event = new $eventClass($node, $metadata);
		$logger = $this->createMock(LoggerInterface::class);

		try {
			(new ExifMetadataProvider($logger))->handle($event);
			(new SizeMetadataProvider($logger))->handle($event);
		} finally {
			fclose($stream);
		}

		$this->assertSame(['width' => 2, 'height' => 3], $values['photos-size']);
		$this->assertSame(6, $values[ExifMetadataProvider::METADATA_KEY_IFD0]['Orientation']);
		$this->assertArrayNotHasKey(ExifMetadataProvider::METADATA_KEY_EXIF, $values);
		$this->assertArrayNotHasKey(ExifMetadataProvider::METADATA_KEY_GPS, $values);
	}
}
