<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Jobs;

use OCA\Photos\Jobs\ConvertVideoJob;
use OCA\Photos\Service\VideoRenditionService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\Files\File;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\Storage\IStorage;
use OCP\ITempManager;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class ConvertVideoJobTest extends TestCase {
	private IRootFolder&MockObject $rootFolder;
	private VideoRenditionService&MockObject $renditionService;
	private ITempManager&MockObject $tempManager;
	private ConvertVideoJob&MockObject $job;
	private string $output;

	protected function setUp(): void {
		parent::setUp();

		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->renditionService = $this->createMock(VideoRenditionService::class);
		$this->renditionService->method('getFfmpegPath')->willReturn('/usr/bin/ffmpeg');
		$this->renditionService->method('getFfprobePath')->willReturn('/usr/bin/ffprobe');
		$this->renditionService->method('getMaxSourceSize')->willReturn(1000);

		$this->output = tempnam(sys_get_temp_dir(), 'rendition');
		$this->tempManager = $this->createMock(ITempManager::class);
		$this->tempManager->method('getTemporaryFile')->willReturn($this->output);

		$this->job = $this->getMockBuilder(ConvertVideoJob::class)
			->setConstructorArgs([
				$this->createMock(ITimeFactory::class),
				$this->rootFolder,
				$this->renditionService,
				$this->tempManager,
				$this->createMock(LoggerInterface::class),
			])
			->onlyMethods(['execute'])
			->getMock();
	}

	protected function tearDown(): void {
		if (file_exists($this->output)) {
			unlink($this->output);
		}

		parent::tearDown();
	}

	public static function dataPlan(): array {
		return [
			'HEVC in QuickTime' => ['video/quicktime', 'hevc', ConvertVideoJob::PLAN_TRANSCODE],
			'HEVC in MP4' => ['video/mp4', 'hevc', ConvertVideoJob::PLAN_TRANSCODE],
			'ProRes' => ['video/quicktime', 'prores', ConvertVideoJob::PLAN_TRANSCODE],
			'H.264 in QuickTime' => ['video/quicktime', 'h264', ConvertVideoJob::PLAN_REMUX],
			'H.264 in MP4' => ['video/mp4', 'h264', null],
			'VP9 in WebM' => ['video/webm', 'vp9', null],
		];
	}

	/** @dataProvider dataPlan */
	public function testPlan(string $mimeType, string $codec, ?string $plan): void {
		$this->assertSame($plan, ConvertVideoJob::plan($mimeType, $codec));
	}

	public function testParseProbe(): void {
		$json = '{"streams": [{"codec_name": "hevc", "color_transfer": "arib-std-b67"}]}';

		$this->assertSame(['codec' => 'hevc', 'hdr' => true], ConvertVideoJob::parseProbe($json, 'configuration: --enable-libzimg'));
		// Without zscale there is no tonemapping to apply.
		$this->assertSame(['codec' => 'hevc', 'hdr' => false], ConvertVideoJob::parseProbe($json, 'configuration: --enable-libx264'));
		$this->assertSame(['codec' => 'h264', 'hdr' => false], ConvertVideoJob::parseProbe('{"streams": [{"codec_name": "h264"}]}', ''));
		$this->assertNull(ConvertVideoJob::parseProbe('{"streams": []}', ''));
		$this->assertNull(ConvertVideoJob::parseProbe('not json', ''));
	}

	public function testTranscodeCapsTheResolution(): void {
		$args = ConvertVideoJob::getFfmpegArgs('in.mov', 'out.mp4', ConvertVideoJob::PLAN_TRANSCODE, false);

		$filter = $args[array_search('-vf', $args, true) + 1];
		$this->assertStringContainsString("w='min(1920,iw)':h='min(1920,ih)'", $filter);
		$this->assertStringEndsWith('format=yuv420p', $filter);
		$this->assertContains('libx264', $args);
		$this->assertSame('out.mp4', end($args));
	}

	public function testTranscodeTonemapsHdr(): void {
		$args = ConvertVideoJob::getFfmpegArgs('in.mov', 'out.mp4', ConvertVideoJob::PLAN_TRANSCODE, true);

		$this->assertStringContainsString('tonemap=tonemap=hable', $args[array_search('-vf', $args, true) + 1]);
	}

	public function testRemuxCopiesTheVideo(): void {
		$args = ConvertVideoJob::getFfmpegArgs('in.mov', 'out.mp4', ConvertVideoJob::PLAN_REMUX, false);

		$this->assertSame('copy', $args[array_search('-c:v', $args, true) + 1]);
		$this->assertNotContains('-vf', $args);
	}

	public function testDoesNothingWhenDisabled(): void {
		$this->renditionService->method('isEnabled')->willReturn(false);
		$this->rootFolder->expects($this->never())->method('getUserFolder');
		$this->job->expects($this->never())->method('execute');

		$this->runJob();
	}

	public function testSkipsFilesTheUserCannotReach(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$this->mockFile(null);
		$this->job->expects($this->never())->method('execute');
		$this->renditionService->expects($this->never())->method('markUnconvertible');

		$this->runJob();
	}

	public function testSkipsVideosWithARendition(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$this->renditionService->method('getRendition')->willReturn($this->createMock(ISimpleFile::class));
		$this->mockFile($this->createVideo('video/quicktime', 100));
		$this->job->expects($this->never())->method('execute');

		$this->runJob();
	}

	public function testMarksVideosAboveTheSizeLimit(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$file = $this->createVideo('video/quicktime', 1001);
		$this->mockFile($file);
		$this->job->expects($this->never())->method('execute');
		$this->renditionService->expects($this->once())->method('markUnconvertible')->with($file);

		$this->runJob();
	}

	public function testMarksVideosBrowsersAlreadyPlay(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$file = $this->createVideo('video/mp4', 100);
		$this->mockFile($file);
		$this->job->expects($this->once())->method('execute')
			->willReturn([0, '{"streams": [{"codec_name": "h264"}]}', '']);
		$this->renditionService->expects($this->once())->method('markUnconvertible')->with($file);
		$this->renditionService->expects($this->never())->method('saveRendition');

		$this->runJob();
	}

	public function testConvertsHevcAndStoresTheRendition(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$file = $this->createVideo('video/quicktime', 100);
		$this->mockFile($file);
		$this->job->expects($this->exactly(2))->method('execute')
			->willReturnCallback(function (array $command): array {
				if ($command[0] === '/usr/bin/ffprobe') {
					$this->assertSame('/local/clip.mov', end($command));
					return [0, '{"streams": [{"codec_name": "hevc"}]}', ''];
				}

				$this->assertSame('/usr/bin/ffmpeg', $command[0]);
				$this->assertContains('libx264', $command);
				file_put_contents($this->output, 'mp4');
				return [0, '', ''];
			});
		$this->renditionService->expects($this->never())->method('markUnconvertible');
		$this->renditionService->expects($this->once())->method('saveRendition')
			->with($file, $this->callback(fn ($content) => stream_get_contents($content) === 'mp4'));

		$this->runJob();

		$this->assertFileDoesNotExist($this->output);
	}

	public function testMarksVideosFfmpegFailsOn(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$file = $this->createVideo('video/quicktime', 100);
		$this->mockFile($file);
		$this->job->method('execute')->willReturnOnConsecutiveCalls(
			[0, '{"streams": [{"codec_name": "prores"}]}', ''],
			[1, '', 'Invalid data found when processing input'],
		);
		$this->renditionService->expects($this->once())->method('markUnconvertible')->with($file);
		$this->renditionService->expects($this->never())->method('saveRendition');

		$this->runJob();

		$this->assertFileDoesNotExist($this->output);
	}

	public function testDeletesTheTemporaryCopyOfARemoteFile(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$copy = tempnam(sys_get_temp_dir(), 'video');
		$this->mockFile($this->createVideo('video/quicktime', 100, $copy, false));
		$this->job->method('execute')->willReturn([1, '', '']);

		$this->runJob();

		$this->assertFileDoesNotExist($copy);
	}

	private function runJob(): void {
		self::invokePrivate($this->job, 'run', [['userId' => 'alice', 'fileId' => 42]]);
	}

	private function mockFile(?File $file): void {
		$userFolder = $this->createMock(IUserFolder::class);
		$userFolder->method('getFirstNodeById')->with(42)->willReturn($file);
		$this->rootFolder->method('getUserFolder')->with('alice')->willReturn($userFolder);
	}

	private function createVideo(string $mimeType, int $size, string $localFile = '/local/clip.mov', bool $isLocal = true): File&MockObject {
		$storage = $this->createMock(IStorage::class);
		$storage->method('getLocalFile')->with('files/clip.mov')->willReturn($localFile);
		$storage->method('isLocal')->willReturn($isLocal);

		$file = $this->createMock(File::class);
		$file->method('getId')->willReturn(42);
		$file->method('getMimetype')->willReturn($mimeType);
		$file->method('getSize')->willReturn($size);
		$file->method('getStorage')->willReturn($storage);
		$file->method('getInternalPath')->willReturn('files/clip.mov');
		return $file;
	}
}
