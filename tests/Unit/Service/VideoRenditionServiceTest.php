<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Service;

use OCA\Photos\Jobs\ConvertVideoJob;
use OCA\Photos\Service\VideoRenditionService;
use OCP\BackgroundJob\IJobList;
use OCP\Files\File;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;
use OCP\IAppConfig;
use OCP\IBinaryFinder;
use OCP\IConfig;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class VideoRenditionServiceTest extends TestCase {
	private IAppConfig&MockObject $appConfig;
	private IConfig&MockObject $config;
	private IBinaryFinder&MockObject $binaryFinder;
	private IAppData&MockObject $appData;
	private IJobList&MockObject $jobList;
	private VideoRenditionService $service;

	protected function setUp(): void {
		parent::setUp();

		$this->appConfig = $this->createMock(IAppConfig::class);
		$this->config = $this->createMock(IConfig::class);
		$this->binaryFinder = $this->createMock(IBinaryFinder::class);
		$this->appData = $this->createMock(IAppData::class);
		$this->jobList = $this->createMock(IJobList::class);

		$this->service = new VideoRenditionService($this->appConfig, $this->config, $this->binaryFinder, $this->appData, $this->jobList);
	}

	public function testUsesTheFfmpegOfThePreviews(): void {
		$this->config->method('getSystemValue')->willReturnMap([
			['preview_ffmpeg_path', null, '/opt/ffmpeg/bin/ffmpeg'],
			['preview_ffprobe_path', null, null],
		]);
		$this->binaryFinder->expects($this->never())->method('findBinaryPath');

		$this->assertSame('/opt/ffmpeg/bin/ffmpeg', $this->service->getFfmpegPath());
		$this->assertSame('/opt/ffmpeg/bin/ffprobe', $this->service->getFfprobePath('/opt/ffmpeg/bin/ffmpeg'));
	}

	public function testFindsFfmpegOnThePath(): void {
		$this->config->method('getSystemValue')->willReturn(null);
		$this->binaryFinder->method('findBinaryPath')->with('ffmpeg')->willReturn('/usr/bin/ffmpeg');

		$this->assertSame('/usr/bin/ffmpeg', $this->service->getFfmpegPath());
	}

	public function testIsDisabledByDefault(): void {
		$this->appConfig->method('getValueBool')->with('photos', VideoRenditionService::CONFIG_ENABLED)->willReturn(false);
		$this->binaryFinder->method('findBinaryPath')->willReturn('/usr/bin/ffmpeg');

		$this->assertFalse($this->service->isEnabled());
	}

	public function testIsDisabledWithoutFfmpeg(): void {
		$this->appConfig->method('getValueBool')->willReturn(true);
		$this->config->method('getSystemValue')->willReturn(null);
		$this->binaryFinder->method('findBinaryPath')->willReturn(false);

		$this->assertFalse($this->service->isEnabled());
	}

	public function testIsEnabledWithSwitchAndFfmpeg(): void {
		$this->appConfig->method('getValueBool')->willReturn(true);
		$this->config->method('getSystemValue')->willReturn(null);
		$this->binaryFinder->method('findBinaryPath')->willReturn('/usr/bin/ffmpeg');

		$this->assertTrue($this->service->isEnabled());
	}

	public function testFindsTheRenditionOfTheCurrentVersion(): void {
		$rendition = $this->createMock(ISimpleFile::class);
		$folder = $this->createMock(ISimpleFolder::class);
		$folder->method('getFile')->willReturnCallback(fn (string $name) => $name === 'abc123.mp4' ? $rendition : throw new NotFoundException());
		$root = $this->createMock(ISimpleFolder::class);
		$root->method('getFolder')->with('42')->willReturn($folder);
		$this->appData->method('getFolder')->with('video-renditions')->willReturn($root);

		$this->assertSame($rendition, $this->service->getRendition($this->createVideo('"abc123"')));
		$this->assertNull($this->service->getRendition($this->createVideo('def456')));
		$this->assertFalse($this->service->isUnconvertible($this->createVideo('abc123')));
	}

	public function testHasNoRenditionForVideosNeverConverted(): void {
		$root = $this->createMock(ISimpleFolder::class);
		$root->method('getFolder')->willThrowException(new NotFoundException());
		$this->appData->method('getFolder')->willReturn($root);

		$this->assertNull($this->service->getRendition($this->createVideo('abc123')));
	}

	public function testQueuesTheConversionForTheUser(): void {
		$this->jobList->expects($this->once())->method('add')
			->with(ConvertVideoJob::class, ['userId' => 'alice', 'fileId' => 42]);

		$this->service->queue('alice', $this->createVideo('abc123'));
	}

	private function createVideo(string $etag): File&MockObject {
		$file = $this->createMock(File::class);
		$file->method('getId')->willReturn(42);
		$file->method('getEtag')->willReturn($etag);
		return $file;
	}
}
