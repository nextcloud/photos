<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\Timeline\TimelineMapper;
use OCA\Photos\Service\UserConfigService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCSController;
use OCP\Files\IMimeTypeLoader;
use OCP\Files\IRootFolder;
use OCP\IRequest;
use OCP\IUserSession;

class TimelineController extends OCSController {
	public function __construct(
		IRequest $request,
		private readonly IUserSession $userSession,
		private readonly IRootFolder $rootFolder,
		private readonly IMimeTypeLoader $mimeTypeLoader,
		private readonly UserConfigService $userConfigService,
		private readonly TimelineMapper $timelineMapper,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	/**
	 * Number of photos and videos per day in the photo source folders of the
	 * current user, newest day first.
	 *
	 * Days are calendar days in UTC of the capture time, or of the modification
	 * time for files without one. Only the files stored in the user's own
	 * storage are counted, not those in shares or other mounts.
	 *
	 * @param 'all'|'photos'|'videos' $mediaType Kind of media to count
	 * @return DataResponse<Http::STATUS_OK, list<array{day: string, count: int}>, array{}>
	 * @throws OCSBadRequestException Unknown media type
	 * @throws OCSForbiddenException No user is logged in
	 *
	 * 200: Days with at least one file, as YYYY-MM-DD in UTC
	 */
	#[NoAdminRequired]
	public function days(string $mediaType = 'all'): DataResponse {
		$mimetypes = match ($mediaType) {
			'all' => [...Application::IMAGE_MIMES, ...Application::VIDEO_MIMES],
			'photos' => Application::IMAGE_MIMES,
			'videos' => Application::VIDEO_MIMES,
			default => throw new OCSBadRequestException('Unknown media type'),
		};

		$user = $this->userSession->getUser();
		if ($user === null) {
			throw new OCSForbiddenException();
		}

		$storageId = $this->rootFolder
			->getUserFolder($user->getUID())
			->getMountPoint()
			->getNumericStorageId();
		if ($storageId === null) {
			return new DataResponse([]);
		}

		return new DataResponse($this->timelineMapper->countFilesPerDay(
			$storageId,
			$this->getSourceFolderPaths($user->getUID()),
			array_map($this->mimeTypeLoader->getId(...), $mimetypes),
		));
	}

	/**
	 * Paths of the photo source folders inside the user's home storage.
	 *
	 * @return list<string>
	 */
	private function getSourceFolderPaths(string $userId): array {
		$folders = json_decode($this->userConfigService->getConfigForUser($userId, 'photosSourceFolders'), true);
		if (!is_array($folders)) {
			return [];
		}

		$paths = [];
		foreach ($folders as $folder) {
			if (!is_string($folder) || !str_starts_with($folder, '/') || str_contains($folder, '..')) {
				continue;
			}
			$paths[] = rtrim('files' . $folder, '/');
		}

		return $paths;
	}
}
