<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Listener;

use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCP\Files\File;
use OCP\Files\Storage\IStorage;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use OCP\FilesMetadata\Model\IFilesMetadata;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class OriginalDateTimeMetadataProviderTest extends TestCase {
	public function testUsesOffsetTimeOriginal(): void {
		$this->assertOriginalDateTime(
			'2025:11:30 16:43:51',
			'+09:00',
			1764488631,
		);
	}

	public function testUsesNegativeOffsetTimeOriginal(): void {
		$this->assertOriginalDateTime(
			'2025:11:30 16:43:51',
			'-05:00',
			1764539031,
		);
	}

	private function assertOriginalDateTime(
		string $dateTimeOriginal,
		string $offsetTimeOriginal,
		int $expectedTimestamp,
	): void {
		$storage = $this->createMock(IStorage::class);
		$storage->method('isLocal')->willReturn(true);

		$file = $this->createMock(File::class);
		$file->method('getStorage')->willReturn($storage);
		$file->method('getMimeType')->willReturn('image/jpeg');

		$metadata = $this->createMock(IFilesMetadata::class);
		$metadata
			->method('hasKey')
			->with(ExifMetadataProvider::METADATA_KEY_EXIF)
			->willReturn(true);
		$metadata
			->method('getArray')
			->with(ExifMetadataProvider::METADATA_KEY_EXIF)
			->willReturn([
				'DateTimeOriginal' => $dateTimeOriginal,
				'OffsetTimeOriginal' => $offsetTimeOriginal,
			]);

		$metadata
			->expects($this->once())
			->method('setInt')
			->with(
				OriginalDateTimeMetadataProvider::METADATA_KEY,
				$expectedTimestamp,
				true,
			)
			->willReturnSelf();

		$logger = $this->createMock(LoggerInterface::class);
		$provider = new OriginalDateTimeMetadataProvider($logger);

		$event = new MetadataLiveEvent($file, $metadata);
		$provider->handle($event);
	}
}
