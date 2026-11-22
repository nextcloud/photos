<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use OCA\Photos\Album\AlbumMapper;
use OCP\App\IAppManager;
use OCP\IUser;
use OCP\TaskProcessing\EShapeType;
use OCP\TaskProcessing\IManager as ITaskProcessingManager;
use OCP\TaskProcessing\ShapeDescriptor;
use Psr\Log\LoggerInterface;

/**
 * Collects where the photos and metadata of a user are processed.
 *
 * @psalm-type PhotosPrivacyOverview = array{
 *     places: array{enabled: bool, source: string},
 *     recognize: bool,
 *     ai: array{known: bool, tasks: list<array{name: string, provider: ?string}>},
 *     publicLinkAlbums: int,
 * }
 */
class PrivacyOverviewService {
	/** Task input types that can carry a photo or a video. */
	private const MEDIA_SHAPE_TYPES = [
		EShapeType::Image,
		EShapeType::ListOfImages,
		EShapeType::Video,
		EShapeType::ListOfVideos,
	];

	public function __construct(
		private readonly IAppManager $appManager,
		private readonly ReverseGeoCoderService $reverseGeoCoder,
		private readonly AlbumMapper $albumMapper,
		private readonly ITaskProcessingManager $taskProcessingManager,
		private readonly LoggerInterface $logger,
	) {
	}

	/**
	 * @return PhotosPrivacyOverview
	 */
	public function getOverview(IUser $user): array {
		return [
			'places' => [
				'enabled' => $this->reverseGeoCoder->arePlacesEnabled(),
				'source' => (string)parse_url(ReverseGeoCoderService::CITIES_DOWNLOAD_URL, PHP_URL_HOST),
			],
			'recognize' => $this->appManager->isEnabledForUser('recognize', $user),
			'ai' => $this->getMediaTasks($user),
			'publicLinkAlbums' => $this->albumMapper->countPublicLinkAlbumsForUser($user->getUID()),
		];
	}

	/**
	 * The AI tasks available to the user that take photos or videos as input,
	 * with the name of the provider that runs each of them.
	 *
	 * @return array{known: bool, tasks: list<array{name: string, provider: ?string}>}
	 */
	private function getMediaTasks(IUser $user): array {
		try {
			$taskTypes = $this->taskProcessingManager->getAvailableTaskTypes(false, $user->getUID());
		} catch (\Throwable $e) {
			$this->logger->warning('Could not list the available AI task types', ['exception' => $e]);
			return ['known' => false, 'tasks' => []];
		}

		$tasks = [];
		foreach ($taskTypes as $taskTypeId => $taskType) {
			$shapes = array_merge($taskType['inputShape'], $taskType['optionalInputShape']);
			$takesMedia = array_filter($shapes, fn (ShapeDescriptor $shape): bool => in_array($shape->getShapeType(), self::MEDIA_SHAPE_TYPES, true));
			if ($takesMedia === []) {
				continue;
			}

			try {
				$provider = $this->taskProcessingManager->getPreferredProvider((string)$taskTypeId)->getName();
			} catch (\Throwable) {
				$provider = null;
			}
			$tasks[] = ['name' => $taskType['name'], 'provider' => $provider];
		}

		return ['known' => true, 'tasks' => $tasks];
	}
}
