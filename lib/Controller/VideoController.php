<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Service\VideoRenditionService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\Response;
use OCP\AppFramework\Http\StreamResponse;
use OCP\Files\File;
use OCP\Files\IRootFolder;
use OCP\Files\Storage\ISharedStorage;
use OCP\IRequest;
use OCP\IUserSession;

class VideoController extends Controller {
	public function __construct(
		IRequest $request,
		private readonly IUserSession $userSession,
		private readonly IRootFolder $rootFolder,
		private readonly VideoRenditionService $renditionService,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	/**
	 * Streams the browser-playable rendition of a video of the user. A video
	 * without one yet is queued for conversion and answered with 404.
	 */
	#[NoAdminRequired]
	#[NoCSRFRequired]
	public function rendition(int $fileId): Response {
		$user = $this->userSession->getUser();
		if ($user === null || !$this->renditionService->isEnabled()) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$file = $this->rootFolder->getUserFolder($user->getUID())->getFirstNodeById($fileId);
		if (!($file instanceof File)
			|| !str_starts_with($file->getMimetype(), 'video/')
			|| !$file->isReadable()
			|| !$this->isDownloadable($file)) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$rendition = $this->renditionService->getRendition($file);
		if ($rendition === null) {
			if (!$this->renditionService->isUnconvertible($file)) {
				$this->renditionService->queue($user->getUID(), $file);
			}
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$content = $rendition->read();
		if ($content === false) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$response = new StreamResponse($content, Http::STATUS_OK, [
			'Content-Type' => 'video/mp4',
			'Content-Length' => (string)$rendition->getSize(),
			'Accept-Ranges' => 'none',
		]);
		$response->cacheFor(3600 * 24, false, true);
		return $response;
	}

	/**
	 * Whether the file may leave the server, which a share can forbid while
	 * still letting it be viewed.
	 */
	private function isDownloadable(File $file): bool {
		$storage = $file->getStorage();
		if (!$storage->instanceOfStorage(ISharedStorage::class)) {
			return true;
		}

		/** @var ISharedStorage $storage */
		$attributes = $storage->getShare()->getAttributes();
		return $attributes === null || $attributes->getAttribute('permissions', 'download') !== false;
	}
}
