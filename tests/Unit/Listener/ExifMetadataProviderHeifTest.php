<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Listener;

use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Tests\Service\HeifExifReaderTest;
use OCP\Files\File;
use OCP\Files\Storage\IStorage;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use OCP\FilesMetadata\Model\IFilesMetadata;
use Psr\Log\LoggerInterface;
use Test\TestCase;

require_once __DIR__ . '/../Service/HeifExifReaderTest.php';

class ExifMetadataProviderHeifTest extends TestCase {
	/**
	 * @return array<string, mixed>
	 */
	private function extractMetadata(string $mimeType, string $content): array {
		$stream = fopen('php://memory', 'r+b');
		fwrite($stream, $content);
		rewind($stream);

		$storage = $this->createMock(IStorage::class);
		$storage->method('isLocal')->willReturn(true);

		$file = $this->createMock(File::class);
		$file->method('getStorage')->willReturn($storage);
		$file->method('getMimeType')->willReturn($mimeType);
		$file->method('getSize')->willReturn(strlen($content));
		$file->method('fopen')->willReturn($stream);

		$stored = [];
		$metadata = $this->createMock(IFilesMetadata::class);
		$metadata->method('setArray')->willReturnCallback(function (string $key, array $value) use (&$stored, $metadata) {
			$stored[$key] = $value;
			return $metadata;
		});

		$provider = new ExifMetadataProvider($this->createMock(LoggerInterface::class));
		$provider->handle(new MetadataLiveEvent($file, $metadata));

		return $stored;
	}

	public static function dataMimeTypes(): array {
		return [
			['image/heic', 'heic'],
			['image/heif', 'mif1'],
			['image/avif', 'avif'],
		];
	}

	/**
	 * @dataProvider dataMimeTypes
	 */
	public function testExtractsExifFromHeifImages(string $mimeType, string $brand): void {
		$stored = $this->extractMetadata($mimeType, HeifExifReaderTest::buildHeif($brand));

		$this->assertSame('2025:06:01 12:34:56', $stored[ExifMetadataProvider::METADATA_KEY_EXIF]['DateTimeOriginal']);
		$this->assertSame('Apple', $stored[ExifMetadataProvider::METADATA_KEY_IFD0]['Make']);
		$this->assertSame('iPhone 15', $stored[ExifMetadataProvider::METADATA_KEY_IFD0]['Model']);
		$this->assertEqualsWithDelta(52.51, $stored[ExifMetadataProvider::METADATA_KEY_GPS]['latitude'], 0.0001);
		$this->assertEqualsWithDelta(13.4, $stored[ExifMetadataProvider::METADATA_KEY_GPS]['longitude'], 0.0001);
	}

	public function testIgnoresMalformedHeifImages(): void {
		$file = HeifExifReaderTest::buildHeif();

		$this->assertSame([], $this->extractMetadata('image/heic', substr($file, 0, intdiv(strlen($file), 2))));
		$this->assertSame([], $this->extractMetadata('image/avif', str_repeat("\xFF", 64)));
	}
}
