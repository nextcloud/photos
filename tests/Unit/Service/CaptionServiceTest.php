<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Service;

use OCA\Photos\Jobs\GenerateCaptionJob;
use OCA\Photos\Service\CaptionService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJobList;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\FilesMetadata\Exceptions\FilesMetadataNotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IFilesMetadata;
use OCP\IAppConfig;
use OCP\IUser;
use OCP\IUserManager;
use OCP\L10N\IFactory;
use OCP\TaskProcessing\Exception\PreConditionNotMetException;
use OCP\TaskProcessing\IManager;
use OCP\TaskProcessing\Task;
use OCP\TaskProcessing\TaskTypes\AnalyzeImages;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class CaptionServiceTest extends TestCase {
	private const NOW = 1_800_000_000;
	private const FILE_ID = 42;

	private IAppConfig&MockObject $appConfig;
	private IManager&MockObject $taskProcessingManager;
	private IJobList&MockObject $jobList;
	private IUserFolder&MockObject $userFolder;
	private IFilesMetadataManager&MockObject $metadataManager;
	private LoggerInterface&MockObject $logger;
	private CaptionService $service;

	/** @var array<string, bool|int> */
	private array $config = [];

	protected function setUp(): void {
		parent::setUp();

		$this->appConfig = $this->createMock(IAppConfig::class);
		$this->appConfig->method('getValueBool')
			->willReturnCallback(fn (string $app, string $key, bool $default = false) => (bool)($this->config[$key] ?? $default));
		$this->appConfig->method('getValueInt')
			->willReturnCallback(fn (string $app, string $key, int $default = 0) => (int)($this->config[$key] ?? $default));
		$this->appConfig->method('setValueInt')
			->willReturnCallback(function (string $app, string $key, int $value): bool {
				$this->config[$key] = $value;
				return true;
			});

		$this->taskProcessingManager = $this->createMock(IManager::class);
		$this->jobList = $this->createMock(IJobList::class);
		$this->userFolder = $this->createMock(IUserFolder::class);
		$this->metadataManager = $this->createMock(IFilesMetadataManager::class);
		$this->logger = $this->createMock(LoggerInterface::class);

		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->with('alice')->willReturn($this->userFolder);

		$l10nFactory = $this->createMock(IFactory::class);
		$l10nFactory->method('getUserLanguage')->willReturn('de');

		$timeFactory = $this->createMock(ITimeFactory::class);
		$timeFactory->method('getTime')->willReturn(self::NOW);

		$this->service = new CaptionService(
			$this->appConfig,
			$this->taskProcessingManager,
			$this->jobList,
			$rootFolder,
			$this->metadataManager,
			$this->createMock(IUserManager::class),
			$l10nFactory,
			$timeFactory,
			$this->logger,
		);
	}

	private function photo(?string $owner = 'alice', string $mimeType = 'image/jpeg'): File&MockObject {
		$file = $this->createMock(File::class);
		$file->method('getId')->willReturn(self::FILE_ID);
		$file->method('getMimeType')->willReturn($mimeType);

		$user = null;
		if ($owner !== null) {
			$user = $this->createMock(IUser::class);
			$user->method('getUID')->willReturn($owner);
		}
		$file->method('getOwner')->willReturn($user);

		return $file;
	}

	private function enable(bool $providerAvailable = true): void {
		$this->config['ai_captions'] = true;
		$this->taskProcessingManager->method('getAvailableTaskTypeIds')
			->willReturn($providerAvailable ? [AnalyzeImages::ID] : []);
	}

	public function testIsNotAvailableUntilTheAdminEnablesIt(): void {
		$this->taskProcessingManager->expects($this->never())->method('getAvailableTaskTypeIds');

		$this->assertFalse($this->service->isEnabled());
		$this->assertFalse($this->service->isAvailable());
	}

	public function testIsNotAvailableWithoutProvider(): void {
		$this->enable(false);

		$this->assertTrue($this->service->isEnabled());
		$this->assertFalse($this->service->isAvailable());
	}

	public function testIsAvailableWhenEnabledAndAProviderExists(): void {
		$this->enable();

		$this->assertTrue($this->service->isAvailable());
	}

	public function testQueueSchedulesTheTaskForTheOwner(): void {
		/** @var Task|null $scheduled */
		$scheduled = null;
		$this->taskProcessingManager->expects($this->once())
			->method('scheduleTask')
			->willReturnCallback(function (Task $task) use (&$scheduled): void {
				$scheduled = $task;
			});
		$this->jobList->expects($this->never())->method('scheduleAfter');

		$this->service->queue($this->photo());

		$this->assertInstanceOf(Task::class, $scheduled);
		$this->assertSame(AnalyzeImages::ID, $scheduled->getTaskTypeId());
		$this->assertSame('photos', $scheduled->getAppId());
		$this->assertSame('alice', $scheduled->getUserId());
		$this->assertSame('caption:42', $scheduled->getCustomId());
		$this->assertSame([self::FILE_ID], $scheduled->getInput()['images']);
		$this->assertStringContainsString('"de"', $scheduled->getInput()['input']);
	}

	public function testQueueDefersOnceTheHourlyLimitIsReached(): void {
		$this->config['ai_captions_per_hour'] = 60;

		$this->taskProcessingManager->expects($this->once())->method('scheduleTask');
		$this->jobList->expects($this->exactly(2))
			->method('scheduleAfter')
			->withConsecutive(
				[GenerateCaptionJob::class, self::NOW + 60, ['userId' => 'alice', 'fileId' => self::FILE_ID]],
				[GenerateCaptionJob::class, self::NOW + 120, ['userId' => 'alice', 'fileId' => self::FILE_ID]],
			);

		$this->service->queue($this->photo());
		$this->service->queue($this->photo());
		$this->service->queue($this->photo());
	}

	public function testQueueIgnoresFilesWithoutOwner(): void {
		$this->taskProcessingManager->expects($this->never())->method('scheduleTask');
		$this->jobList->expects($this->never())->method('scheduleAfter');

		$this->service->queue($this->photo(null));
	}

	public function testQueueLogsWhenTheTaskCannotBeScheduled(): void {
		$this->taskProcessingManager->method('scheduleTask')
			->willThrowException(new PreConditionNotMetException('No provider'));
		$this->logger->expects($this->once())->method('warning');

		$this->service->queue($this->photo());
	}

	public function testScheduleByIdSchedulesPhotosWithoutDescription(): void {
		$this->enable();
		$this->userFolder->method('getFirstNodeById')->with(self::FILE_ID)->willReturn($this->photo());
		$this->metadataManager->method('getMetadata')->willThrowException(new FilesMetadataNotFoundException());

		$this->taskProcessingManager->expects($this->once())->method('scheduleTask');

		$this->service->scheduleById('alice', self::FILE_ID);
	}

	public function testScheduleByIdSkipsPhotosDescribedInTheMeantime(): void {
		$this->enable();
		$this->userFolder->method('getFirstNodeById')->willReturn($this->photo());
		$metadata = $this->createMock(IFilesMetadata::class);
		$metadata->method('hasKey')->with('photos-caption')->willReturn(true);
		$this->metadataManager->method('getMetadata')->willReturn($metadata);

		$this->taskProcessingManager->expects($this->never())->method('scheduleTask');

		$this->service->scheduleById('alice', self::FILE_ID);
	}

	public function testScheduleByIdSkipsRemovedFilesAndOtherMedia(): void {
		$this->enable();
		$this->userFolder->method('getFirstNodeById')
			->willReturnOnConsecutiveCalls(null, $this->createMock(Folder::class), $this->photo('alice', 'video/mp4'));

		$this->taskProcessingManager->expects($this->never())->method('scheduleTask');

		$this->service->scheduleById('alice', self::FILE_ID);
		$this->service->scheduleById('alice', self::FILE_ID);
		$this->service->scheduleById('alice', self::FILE_ID);
	}

	public function testScheduleByIdDoesNothingOnceDisabled(): void {
		$this->userFolder->expects($this->never())->method('getFirstNodeById');
		$this->taskProcessingManager->expects($this->never())->method('scheduleTask');

		$this->service->scheduleById('alice', self::FILE_ID);
	}

	private function finishedTask(mixed $output, string $appId = 'photos', string $customId = 'caption:42'): Task {
		$task = new Task(AnalyzeImages::ID, ['images' => [self::FILE_ID], 'input' => 'Describe'], $appId, 'alice', $customId);
		$task->setOutput(['output' => $output]);
		return $task;
	}

	public function testSaveCaptionStoresTheDescriptionAsIndexedMetadata(): void {
		$this->userFolder->method('getFirstNodeById')->with(self::FILE_ID)->willReturn($this->photo());

		$metadata = $this->createMock(IFilesMetadata::class);
		$metadata->expects($this->once())->method('setString')->with('photos-caption', 'A dog on a beach', true);
		$this->metadataManager->method('getMetadata')->with(self::FILE_ID, true)->willReturn($metadata);
		$this->metadataManager->expects($this->once())->method('saveMetadata')->with($metadata);

		$this->service->saveCaption($this->finishedTask("  \"A dog\non a beach\"\n"));
	}

	public function testSaveCaptionIgnoresTasksOfOthers(): void {
		$this->metadataManager->expects($this->never())->method('saveMetadata');

		$this->service->saveCaption($this->finishedTask('A dog', 'assistant'));
		$this->service->saveCaption($this->finishedTask('A dog', 'photos', 'something-else'));
	}

	public function testSaveCaptionIgnoresEmptyAnswersAndInaccessibleFiles(): void {
		$this->userFolder->method('getFirstNodeById')->willReturn(null);
		$this->metadataManager->expects($this->never())->method('saveMetadata');

		$this->service->saveCaption($this->finishedTask('   '));
		$this->service->saveCaption($this->finishedTask(['not', 'text']));
		$this->service->saveCaption($this->finishedTask('A dog'));
	}

	public function testNormalizeCaptionCutsLongAnswersAtAWord(): void {
		$caption = CaptionService::normalizeCaption('A group of friends having a picnic on the grass next to a lake in the late afternoon sun');

		$this->assertLessThanOrEqual(CaptionService::MAX_LENGTH, mb_strlen($caption));
		$this->assertSame('A group of friends having a picnic on the grass next to a lake…', $caption);
	}

	public function testNormalizeCaptionCountsCharactersRatherThanBytes(): void {
		$caption = CaptionService::normalizeCaption(str_repeat('äöü ', 20));

		$this->assertLessThanOrEqual(CaptionService::MAX_LENGTH, mb_strlen($caption));
		$this->assertStringEndsWith('…', $caption);
	}

	public function testNormalizeCaptionRejectsAnythingButText(): void {
		$this->assertSame('', CaptionService::normalizeCaption(null));
		$this->assertSame('', CaptionService::normalizeCaption(['A dog']));
	}
}
