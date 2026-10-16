<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Service\PhotoTranscodeService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\StreamResponse;
use OCP\Files\IRootFolder;
use OCP\IRequest;

/**
 * HLS stream for a video. Serves both the manifest and the
 * individual `.ts` segments. Authorisation is enforced by checking
 * that the file id is reachable in the user's home — an attacker
 * can't probe arbitrary file ids belonging to other users.
 *
 * Endpoints:
 *   GET /apps/photos/api/v1/transcode/{fileId}/master.m3u8
 *   GET /apps/photos/api/v1/transcode/{fileId}/{segment}
 *
 * 404 when the file isn't transcoded yet (or the codec wasn't
 * supported); the client falls back to the still thumbnail for
 * the hover preview, or to opening the original in the viewer.
 */
class TranscodeController extends Controller {
	public function __construct(
		IRequest $request,
		private readonly PhotoTranscodeService $transcodeService,
		private readonly IRootFolder $rootFolder,
		private readonly string $userId,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	#[NoAdminRequired]
	public function manifest(int $fileId): mixed {
		if (!$this->userCanAccess($fileId)) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$path = $this->transcodeService->getManifestPath($fileId);
		if ($path === null) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$response = new StreamResponse($path);
		$response->addHeader('Content-Type', 'application/vnd.apple.mpegurl');
		// Manifests change rarely once a file is transcoded; cache
		// them at the browser for an hour to spare round trips.
		$response->cacheFor(3600, false, true);
		return $response;
	}

	#[NoAdminRequired]
	public function segment(int $fileId, string $segment): mixed {
		if (!$this->userCanAccess($fileId)) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$path = $this->transcodeService->getSegmentPath($fileId, $segment);
		if ($path === null) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$response = new StreamResponse($path);
		$response->addHeader('Content-Type', 'video/mp2t');
		// Segments are content-addressed by name (segment N never
		// gets rewritten in place — it'd be invalid for the manifest
		// to reference a different file with the same name), so we
		// can cache aggressively.
		$response->cacheFor(86400, false, true);
		return $response;
	}

	/**
	 * Authorisation gate. Resolves the fileId in the *user's* root
	 * folder; getById returns nodes the user can access (their own
	 * home, group folders, accepted shares). An empty array means
	 * the file isn't reachable and the request is denied.
	 */
	private function userCanAccess(int $fileId): bool {
		try {
			$userFolder = $this->rootFolder->getUserFolder($this->userId);
			$nodes = $userFolder->getById($fileId);
			return !empty($nodes);
		} catch (\Throwable) {
			return false;
		}
	}
}
