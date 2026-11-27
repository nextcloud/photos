<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Listener;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Jobs\PregeneratePreviewsJob;
use OCA\Photos\Listener\PreviewPregenerationListener;
use OCP\BackgroundJob\IJobList;
use OCP\Files\Events\Node\NodeWrittenEvent;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\IAppConfig;
use OCP\IPreview;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class PreviewPregenerationListenerTest extends TestCase {
	private IAppConfig&MockObject $appConfig;
	private IJobList&MockObject $jobList;
	private IPreview&MockObject $preview;
	private LoggerInterface&MockObject $logger;
	private PreviewPregenerationListener $listener;

	protected function setUp(): void {
		parent::setUp();

		$this->appConfig = $this->createMock(IAppConfig::class);
		$this->jobList = $this->createMock(IJobList::class);
		$this->preview = $this->createMock(IPreview::class);
		$this->logger = $this->createMock(LoggerInterface::class);

		$this->appConfig->method('getValueBool')
			->with(Application::APP_ID, PregeneratePreviewsJob::CONFIG_KEY, true)
			->willReturn(true);
		$this->preview->method('isAvailable')->willReturn(true);

		$this->listener = new PreviewPregenerationListener(
			$this->appConfig,
			$this->jobList,
			$this->preview,
			$this->logger,
		);
	}

	private function file(string $path, string $mimetype, int $id = 42): File&MockObject {
		$file = $this->createMock(File::class);
		$file->method('getPath')->willReturn($path);
		$file->method('getMimetype')->willReturn($mimetype);
		$file->method('getId')->willReturn($id);
		return $file;
	}

	public static function dataQueuedMedia(): array {
		return [
			'jpeg' => ['/alice/files/Photos/beach.jpg', 'image/jpeg', 'alice'],
			'heic in a subfolder' => ['/bob/files/A/B/IMG_0001.HEIC', 'image/heic', 'bob'],
			'mp4' => ['/alice/files/clip.mp4', 'video/mp4', 'alice'],
			'quicktime' => ['/alice/files/live.mov', 'video/quicktime', 'alice'],
		];
	}

	/**
	 * @dataProvider dataQueuedMedia
	 */
	public function testQueuesMediaInUserFiles(string $path, string $mimetype, string $userId): void {
		$this->jobList->expects($this->once())
			->method('add')
			->with(PregeneratePreviewsJob::class, ['userId' => $userId, 'fileId' => 42]);

		$this->listener->handle(new NodeWrittenEvent($this->file($path, $mimetype)));
	}

	public static function dataIgnoredFiles(): array {
		return [
			'document' => ['/alice/files/notes.txt', 'text/plain'],
			'unsupported image' => ['/alice/files/anim.gif', 'image/gif'],
			'trash bin' => ['/alice/files_trashbin/files/beach.jpg.d1700000000', 'image/jpeg'],
			'versions' => ['/alice/files_versions/beach.jpg.v1700000000', 'image/jpeg'],
			'app data' => ['/appdata_oc123/preview/1/2/beach.jpg', 'image/jpeg'],
		];
	}

	/**
	 * @dataProvider dataIgnoredFiles
	 */
	public function testIgnoresOtherFiles(string $path, string $mimetype): void {
		$this->jobList->expects($this->never())->method('add');

		$this->listener->handle(new NodeWrittenEvent($this->file($path, $mimetype)));
	}

	public function testIgnoresFolders(): void {
		$folder = $this->createMock(Folder::class);
		$folder->method('getPath')->willReturn('/alice/files/Photos');
		$this->jobList->expects($this->never())->method('add');

		$this->listener->handle(new NodeWrittenEvent($folder));
	}

	public function testIgnoresFilesWhenDisabled(): void {
		$appConfig = $this->createMock(IAppConfig::class);
		$appConfig->method('getValueBool')->willReturn(false);
		$listener = new PreviewPregenerationListener($appConfig, $this->jobList, $this->preview, $this->logger);
		$this->jobList->expects($this->never())->method('add');

		$listener->handle(new NodeWrittenEvent($this->file('/alice/files/beach.jpg', 'image/jpeg')));
	}

	public function testIgnoresFilesWithoutPreviewProvider(): void {
		$preview = $this->createMock(IPreview::class);
		$preview->method('isAvailable')->willReturn(false);
		$listener = new PreviewPregenerationListener($this->appConfig, $this->jobList, $preview, $this->logger);
		$this->jobList->expects($this->never())->method('add');

		$listener->handle(new NodeWrittenEvent($this->file('/alice/files/clip.mp4', 'video/mp4')));
	}

	public function testNeverFailsTheWrite(): void {
		$this->jobList->method('add')->willThrowException(new \RuntimeException('Database is gone'));
		$this->logger->expects($this->once())->method('warning');

		$this->listener->handle(new NodeWrittenEvent($this->file('/alice/files/beach.jpg', 'image/jpeg')));
	}
}
