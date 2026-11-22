<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Jobs;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Jobs\PregeneratePreviewsJob;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\Files\File;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\IAppConfig;
use OCP\IPreview;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class PregeneratePreviewsJobTest extends TestCase {
	private const ARGUMENT = ['userId' => 'alice', 'fileId' => 42];

	private IRootFolder&MockObject $rootFolder;
	private IUserFolder&MockObject $userFolder;
	private IPreview&MockObject $preview;
	private IAppConfig&MockObject $appConfig;
	private LoggerInterface&MockObject $logger;
	private File&MockObject $file;
	private PregeneratePreviewsJob $job;

	protected function setUp(): void {
		parent::setUp();

		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->userFolder = $this->createMock(IUserFolder::class);
		$this->preview = $this->createMock(IPreview::class);
		$this->appConfig = $this->createMock(IAppConfig::class);
		$this->logger = $this->createMock(LoggerInterface::class);
		$this->file = $this->createMock(File::class);

		$this->rootFolder->method('getUserFolder')->with('alice')->willReturn($this->userFolder);
		$this->userFolder->method('getFirstNodeById')->with(42)->willReturn($this->file);

		$this->job = new PregeneratePreviewsJob(
			$this->createMock(ITimeFactory::class),
			$this->rootFolder,
			$this->preview,
			$this->appConfig,
			$this->logger,
		);
	}

	private function enable(bool $enabled = true): void {
		$this->appConfig->method('getValueBool')
			->with(Application::APP_ID, PregeneratePreviewsJob::CONFIG_KEY, true)
			->willReturn($enabled);
	}

	private function runJob(mixed $argument = self::ARGUMENT): void {
		self::invokePrivate($this->job, 'run', [$argument]);
	}

	public function testGeneratesTimelineSizes(): void {
		$this->enable();
		$this->preview->method('isAvailable')->with($this->file)->willReturn(true);
		$this->preview->expects($this->once())
			->method('generatePreviews')
			->with($this->file, $this->callback(function (array $specifications): bool {
				$sizes = array_map(fn (array $specification): array => [$specification['width'], $specification['height']], $specifications);
				return $sizes === [[64, 64], [256, 256], [1024, 1024]]
					&& array_column($specifications, 'crop') === [false, false, false]
					&& array_column($specifications, 'mode') === [IPreview::MODE_FILL, IPreview::MODE_FILL, IPreview::MODE_FILL];
			}))
			->willReturn($this->createMock(ISimpleFile::class));
		$this->logger->expects($this->never())->method('warning');

		$this->runJob();
	}

	public function testSkipsWhenDisabled(): void {
		$this->enable(false);
		$this->rootFolder->expects($this->never())->method('getUserFolder');
		$this->preview->expects($this->never())->method('generatePreviews');

		$this->runJob();
	}

	public static function dataInvalidArguments(): array {
		return [
			'null' => [null],
			'missing file id' => [['userId' => 'alice']],
			'string file id' => [['userId' => 'alice', 'fileId' => '42']],
		];
	}

	/**
	 * @dataProvider dataInvalidArguments
	 */
	public function testSkipsInvalidArguments(mixed $argument): void {
		$this->enable();
		$this->rootFolder->expects($this->never())->method('getUserFolder');

		$this->runJob($argument);
	}

	public function testSkipsDeletedFiles(): void {
		$this->enable();
		$userFolder = $this->createMock(IUserFolder::class);
		$userFolder->method('getFirstNodeById')->willReturn(null);
		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->willReturn($userFolder);
		$job = new PregeneratePreviewsJob($this->createMock(ITimeFactory::class), $rootFolder, $this->preview, $this->appConfig, $this->logger);
		$this->preview->expects($this->never())->method('generatePreviews');

		self::invokePrivate($job, 'run', [self::ARGUMENT]);
	}

	public function testSkipsFilesWithoutPreviewProvider(): void {
		$this->enable();
		$this->preview->method('isAvailable')->willReturn(false);
		$this->preview->expects($this->never())->method('generatePreviews');

		$this->runJob();
	}

	public static function dataExpectedFailures(): array {
		return [
			'not found' => [new NotFoundException('Max preview size 0, invalid!')],
			'invalid image' => [new \InvalidArgumentException('Failed to generate preview')],
		];
	}

	/**
	 * @dataProvider dataExpectedFailures
	 */
	public function testLogsExpectedFailuresQuietly(\Exception $exception): void {
		$this->enable();
		$this->preview->method('isAvailable')->willReturn(true);
		$this->preview->method('generatePreviews')->willThrowException($exception);
		$this->logger->expects($this->once())->method('debug');
		$this->logger->expects($this->never())->method('warning');

		$this->runJob();
	}

	public function testLogsUnexpectedFailures(): void {
		$this->enable();
		$this->preview->method('isAvailable')->willReturn(true);
		$this->preview->method('generatePreviews')->willThrowException(new \RuntimeException('Out of memory'));
		$this->logger->expects($this->once())->method('warning');

		$this->runJob();
	}
}
