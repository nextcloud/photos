<?php

/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\Exception\GuestUploadException;
use OCA\Photos\Service\GuestUploadService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\BruteForceProtection;
use OCP\AppFramework\Http\Attribute\PublicPage;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\Template\PublicTemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\IL10N;
use OCP\IRequest;
use OCP\Security\RateLimiting\ILimiter;
use OCP\Security\RateLimiting\IRateLimitExceededException;
use OCP\Util;

class PublicAlbumController extends Controller {
	/** Guest uploads allowed per link and client address within GUEST_UPLOAD_PERIOD */
	public const GUEST_UPLOAD_LIMIT = 300;
	public const GUEST_UPLOAD_PERIOD = 900;

	private readonly IInitialState $initialState;

	public function __construct(
		IRequest $request,
		IInitialState $initialState,
		private readonly AlbumMapper $albumMapper,
		private readonly GuestUploadService $guestUploadService,
		private readonly ILimiter $limiter,
		private readonly IL10N $l,
	) {
		parent::__construct(Application::APP_ID, $request);

		$this->initialState = $initialState;
	}

	/**
	 * @PublicPage
	 * @NoCSRFRequired
	 */
	public function get(): PublicTemplateResponse {
		$this->initialState->provideInitialState('image-mimes', Application::IMAGE_MIMES);
		$this->initialState->provideInitialState('video-mimes', Application::VIDEO_MIMES);
		$this->initialState->provideInitialState('maps', false);
		$this->initialState->provideInitialState('recognize', false);
		$this->initialState->provideInitialState('systemtags', false);
		$this->initialState->provideInitialState('guest-upload-max-size', $this->guestUploadService->getMaxSize());

		Util::addScript(Application::APP_ID, 'photos-public');
		Util::addStyle(Application::APP_ID, 'photos-public');

		$response = new PublicTemplateResponse(Application::APP_ID, 'public');

		$policy = new ContentSecurityPolicy();
		$policy->addAllowedWorkerSrcDomain("'self'");
		$policy->addAllowedScriptDomain("'self'");
		$response->setContentSecurityPolicy($policy);

		return $response;
	}

	/**
	 * Add one photo or video, sent as the "file" form field, to the album
	 * shared by the link, if its owner allows guests to add photos.
	 */
	#[PublicPage]
	#[BruteForceProtection(action: 'photos_guest_upload')]
	public function upload(string $token, string $guestName = ''): DataResponse {
		try {
			$this->limiter->registerAnonRequest('photos-guest-upload-' . $token, self::GUEST_UPLOAD_LIMIT, self::GUEST_UPLOAD_PERIOD, $this->request->getRemoteAddress());
		} catch (IRateLimitExceededException) {
			return new DataResponse(['message' => $this->l->t('Too many uploads, please try again later.')], Http::STATUS_TOO_MANY_REQUESTS);
		}

		$albums = $token === '' ? [] : $this->albumMapper->getSharedAlbumsForCollaborator($token, AlbumMapper::TYPE_LINK);
		$album = count($albums) === 1 ? $this->albumMapper->get($albums[0]->getId()) : null;
		if ($album === null) {
			$response = new DataResponse(['message' => $this->l->t('This album does not exist.')], Http::STATUS_NOT_FOUND);
			$response->throttle(['token' => $token]);
			return $response;
		}

		if (!$this->albumMapper->isGuestUploadAllowed($album->getId())) {
			return new DataResponse(['message' => $this->l->t('This album does not accept photos.')], Http::STATUS_FORBIDDEN);
		}

		$upload = $this->request->getUploadedFile('file');
		if (!is_array($upload)) {
			return new DataResponse(['message' => $this->l->t('No file was uploaded.')], Http::STATUS_BAD_REQUEST);
		}

		try {
			$fileId = $this->guestUploadService->upload($album, $upload, $guestName);
		} catch (GuestUploadException $e) {
			return new DataResponse(['message' => $e->getMessage()], $e->status);
		}

		return new DataResponse(['fileId' => $fileId], Http::STATUS_CREATED);
	}
}
