<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Service;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Service\PrivacyOverviewService;
use OCA\Photos\Service\ReverseGeoCoderService;
use OCP\App\IAppManager;
use OCP\IUser;
use OCP\TaskProcessing\EShapeType;
use OCP\TaskProcessing\Exception\Exception as TaskProcessingException;
use OCP\TaskProcessing\IManager as ITaskProcessingManager;
use OCP\TaskProcessing\IProvider;
use OCP\TaskProcessing\ShapeDescriptor;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class PrivacyOverviewServiceTest extends TestCase {
	private IAppManager&MockObject $appManager;
	private ReverseGeoCoderService&MockObject $reverseGeoCoder;
	private AlbumMapper&MockObject $albumMapper;
	private ITaskProcessingManager&MockObject $taskProcessingManager;
	private IUser&MockObject $user;
	private PrivacyOverviewService $service;

	protected function setUp(): void {
		parent::setUp();

		$this->appManager = $this->createMock(IAppManager::class);
		$this->reverseGeoCoder = $this->createMock(ReverseGeoCoderService::class);
		$this->albumMapper = $this->createMock(AlbumMapper::class);
		$this->taskProcessingManager = $this->createMock(ITaskProcessingManager::class);
		$this->user = $this->createMock(IUser::class);
		$this->user->method('getUID')->willReturn('alice');

		$this->service = new PrivacyOverviewService(
			$this->appManager,
			$this->reverseGeoCoder,
			$this->albumMapper,
			$this->taskProcessingManager,
			$this->createMock(LoggerInterface::class),
		);
	}

	/**
	 * @param ShapeDescriptor[] $inputShape
	 * @param ShapeDescriptor[] $optionalInputShape
	 */
	private function taskType(string $name, array $inputShape, array $optionalInputShape = []): array {
		return [
			'name' => $name,
			'description' => '',
			'inputShape' => $inputShape,
			'optionalInputShape' => $optionalInputShape,
			'isInternal' => false,
		];
	}

	private function provider(string $name): IProvider&MockObject {
		$provider = $this->createMock(IProvider::class);
		$provider->method('getName')->willReturn($name);
		return $provider;
	}

	public function testReportsPlacesRecognizeAndPublicLinks(): void {
		$this->reverseGeoCoder->method('arePlacesEnabled')->willReturn(true);
		$this->appManager->expects($this->once())
			->method('isEnabledForUser')
			->with('recognize', $this->user)
			->willReturn(true);
		$this->albumMapper->expects($this->once())
			->method('countPublicLinkAlbumsForUser')
			->with('alice')
			->willReturn(2);
		$this->taskProcessingManager->method('getAvailableTaskTypes')->willReturn([]);

		$overview = $this->service->getOverview($this->user);

		$this->assertSame(['enabled' => true, 'source' => 'download.nextcloud.com'], $overview['places']);
		$this->assertTrue($overview['recognize']);
		$this->assertSame(2, $overview['publicLinkAlbums']);
		$this->assertSame(['known' => true, 'tasks' => []], $overview['ai']);
	}

	public function testReportsDisabledFeatures(): void {
		$this->reverseGeoCoder->method('arePlacesEnabled')->willReturn(false);
		$this->appManager->method('isEnabledForUser')->willReturn(false);
		$this->albumMapper->method('countPublicLinkAlbumsForUser')->willReturn(0);
		$this->taskProcessingManager->method('getAvailableTaskTypes')->willReturn([]);

		$overview = $this->service->getOverview($this->user);

		$this->assertFalse($overview['places']['enabled']);
		$this->assertFalse($overview['recognize']);
		$this->assertSame(0, $overview['publicLinkAlbums']);
	}

	public function testListsOnlyTasksThatTakePhotosOrVideos(): void {
		$this->taskProcessingManager->expects($this->once())
			->method('getAvailableTaskTypes')
			->with(false, 'alice')
			->willReturn([
				'core:text2text' => $this->taskType('Free text to text prompt', [
					'input' => new ShapeDescriptor('Prompt', '', EShapeType::Text),
				]),
				'core:analyze-images' => $this->taskType('Analyze images', [
					'images' => new ShapeDescriptor('Images', '', EShapeType::ListOfImages),
					'input' => new ShapeDescriptor('Question', '', EShapeType::Text),
				]),
				'vendor:summarize' => $this->taskType('Summarize', [
					'input' => new ShapeDescriptor('Text', '', EShapeType::Text),
				], [
					'video' => new ShapeDescriptor('Video', '', EShapeType::Video),
				]),
				'vendor:describe' => $this->taskType('Describe', [
					'image' => new ShapeDescriptor('Image', '', EShapeType::Image),
				]),
			]);
		$this->taskProcessingManager->method('getPreferredProvider')
			->willReturnCallback(function (string $taskTypeId): IProvider {
				return match ($taskTypeId) {
					'core:analyze-images' => $this->provider('Local vision'),
					'vendor:summarize' => $this->provider('Hosted AI'),
					default => throw new TaskProcessingException('No provider'),
				};
			});

		$overview = $this->service->getOverview($this->user);

		$this->assertSame([
			'known' => true,
			'tasks' => [
				['name' => 'Analyze images', 'provider' => 'Local vision'],
				['name' => 'Summarize', 'provider' => 'Hosted AI'],
				['name' => 'Describe', 'provider' => null],
			],
		], $overview['ai']);
	}

	public function testAiIsUnknownWhenTaskTypesCannotBeListed(): void {
		$this->taskProcessingManager->method('getAvailableTaskTypes')
			->willThrowException(new \RuntimeException('broken provider'));

		$overview = $this->service->getOverview($this->user);

		$this->assertSame(['known' => false, 'tasks' => []], $overview['ai']);
	}
}
