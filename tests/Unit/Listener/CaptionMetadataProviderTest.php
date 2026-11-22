<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Listener;

use OCA\Photos\Listener\CaptionMetadataProvider;
use OCA\Photos\Listener\CaptionTaskListener;
use OCA\Photos\Service\CaptionService;
use OCP\Files\File;
use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use OCP\FilesMetadata\Model\IFilesMetadata;
use OCP\TaskProcessing\Events\TaskSuccessfulEvent;
use OCP\TaskProcessing\Task;
use OCP\TaskProcessing\TaskTypes\AnalyzeImages;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class CaptionMetadataProviderTest extends TestCase {
	private CaptionService&MockObject $captionService;
	private IFilesMetadata&MockObject $metadata;
	private CaptionMetadataProvider $provider;

	protected function setUp(): void {
		parent::setUp();

		$this->captionService = $this->createMock(CaptionService::class);
		$this->metadata = $this->createMock(IFilesMetadata::class);
		$this->provider = new CaptionMetadataProvider($this->captionService);
	}

	private function file(string $mimeType = 'image/jpeg'): File&MockObject {
		$file = $this->createMock(File::class);
		$file->method('getMimeType')->willReturn($mimeType);
		return $file;
	}

	public function testLiveEventRequestsABackgroundJobWhenEnabled(): void {
		$this->captionService->method('isEnabled')->willReturn(true);
		$event = new MetadataLiveEvent($this->file(), $this->metadata);

		$this->provider->handle($event);

		$this->assertTrue($event->isRunAsBackgroundJobRequested());
	}

	public function testLiveEventDoesNothingWhenDisabled(): void {
		$this->captionService->method('isEnabled')->willReturn(false);
		$event = new MetadataLiveEvent($this->file(), $this->metadata);

		$this->provider->handle($event);

		$this->assertFalse($event->isRunAsBackgroundJobRequested());
	}

	public function testLiveEventIgnoresOtherMedia(): void {
		$this->captionService->method('isEnabled')->willReturn(true);
		$event = new MetadataLiveEvent($this->file('video/mp4'), $this->metadata);

		$this->provider->handle($event);

		$this->assertFalse($event->isRunAsBackgroundJobRequested());
	}

	public function testBackgroundEventQueuesPhotosWithoutDescription(): void {
		$file = $this->file();
		$this->metadata->method('hasKey')->with('photos-caption')->willReturn(false);
		$this->captionService->method('isAvailable')->willReturn(true);
		$this->captionService->expects($this->once())->method('queue')->with($file);

		$this->provider->handle(new MetadataBackgroundEvent($file, $this->metadata));
	}

	public function testBackgroundEventSkipsPhotosWithDescription(): void {
		$this->metadata->method('hasKey')->with('photos-caption')->willReturn(true);
		$this->captionService->method('isAvailable')->willReturn(true);
		$this->captionService->expects($this->never())->method('queue');

		$this->provider->handle(new MetadataBackgroundEvent($this->file(), $this->metadata));
	}

	public function testBackgroundEventSkipsWithoutProvider(): void {
		$this->metadata->method('hasKey')->willReturn(false);
		$this->captionService->method('isAvailable')->willReturn(false);
		$this->captionService->expects($this->never())->method('queue');

		$this->provider->handle(new MetadataBackgroundEvent($this->file(), $this->metadata));
	}

	public function testTaskListenerSavesTheDescription(): void {
		$task = new Task(AnalyzeImages::ID, [], 'photos', 'alice', 'caption:42');
		$this->captionService->expects($this->once())->method('saveCaption')->with($task);

		(new CaptionTaskListener($this->captionService))->handle(new TaskSuccessfulEvent($task));
	}
}
