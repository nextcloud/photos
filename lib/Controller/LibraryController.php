<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\Library\LibraryStatusMapper;
use OCA\Photos\Service\UserConfigService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSForbiddenException;
use OCP\AppFramework\OCSController;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\Files\IMimeTypeLoader;
use OCP\Files\IRootFolder;
use OCP\IRequest;
use OCP\IUserSession;

class LibraryController extends OCSController {
	/**
	 * Default auto upload folders of the Nextcloud Android app and of other
	 * common camera upload clients.
	 */
	public const CAMERA_UPLOAD_FOLDERS = ['/InstantUpload', '/Photos/Camera', '/Camera Uploads'];

	/** Camera upload folders are listed when they received an upload within this period. */
	public const RECENT_UPLOAD_PERIOD = 30 * 24 * 3600;

	public function __construct(
		IRequest $request,
		private readonly IUserSession $userSession,
		private readonly IRootFolder $rootFolder,
		private readonly IMimeTypeLoader $mimeTypeLoader,
		private readonly UserConfigService $userConfigService,
		private readonly LibraryStatusMapper $libraryStatusMapper,
		private readonly ITimeFactory $timeFactory,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	/**
	 * Number and size of the photos and videos of the current user.
	 *
	 * The totals cover the photo source folders, the camera upload folders are
	 * the default auto upload folders of the mobile apps that received an
	 * upload recently. Only files stored in the user's own storage are counted,
	 * not those in shares or other mounts.
	 *
	 * @return DataResponse<Http::STATUS_OK, array{photos: int, videos: int, size: int, lastUpload: ?int, cameraFolders: list<array{path: string, photos: int, videos: int, size: int, lastUpload: ?int}>}, array{}>
	 * @throws OCSForbiddenException No user is logged in
	 *
	 * 200: Totals of the source folders and recently used camera upload folders, times as Unix timestamps
	 */
	#[NoAdminRequired]
	public function status(): DataResponse {
		$user = $this->userSession->getUser();
		if ($user === null) {
			throw new OCSForbiddenException();
		}

		$userFolder = $this->rootFolder->getUserFolder($user->getUID());
		$storageId = $userFolder->getMountPoint()->getNumericStorageId();
		$photoMimetypeIds = array_map($this->mimeTypeLoader->getId(...), Application::IMAGE_MIMES);
		$videoMimetypeIds = array_map($this->mimeTypeLoader->getId(...), Application::VIDEO_MIMES);

		$status = ['photos' => 0, 'videos' => 0, 'size' => 0, 'lastUpload' => null];
		$cameraFolders = [];
		if ($storageId !== null) {
			$status = $this->libraryStatusMapper->getStatus(
				$storageId,
				$this->getSourceFolderPaths($user->getUID()),
				$photoMimetypeIds,
				$videoMimetypeIds,
			);

			$recentSince = $this->timeFactory->getTime() - self::RECENT_UPLOAD_PERIOD;
			foreach (self::CAMERA_UPLOAD_FOLDERS as $folder) {
				if (!$userFolder->nodeExists($folder)) {
					continue;
				}
				$folderStatus = $this->libraryStatusMapper->getStatus($storageId, ['files' . $folder], $photoMimetypeIds, $videoMimetypeIds);
				if ($folderStatus['lastUpload'] !== null && $folderStatus['lastUpload'] >= $recentSince) {
					$cameraFolders[] = ['path' => $folder, ...$folderStatus];
				}
			}
		}

		return new DataResponse([...$status, 'cameraFolders' => $cameraFolders]);
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
