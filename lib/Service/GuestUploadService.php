<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\Exception\GuestUploadException;
use OCP\AppFramework\Http;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IFilenameValidator;
use OCP\Files\IHomeStorage;
use OCP\Files\IMimeTypeDetector;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IAppConfig;
use OCP\IL10N;
use OCP\IUserManager;
use OCP\L10N\IFactory;
use OCP\Lock\ILockingProvider;
use OCP\Lock\LockedException;
use Psr\Log\LoggerInterface;

/**
 * Stores photos sent by visitors of a public album link in the album owner's
 * storage and adds them to the album.
 */
class GuestUploadService {
	public const CONFIG_MAX_SIZE = 'guest_upload_max_size';
	public const DEFAULT_MAX_SIZE = 50 * 1024 * 1024;
	private const MAX_GUEST_NAME_LENGTH = 64;
	private const MAX_FILE_NAME_BYTES = 200;

	public function __construct(
		private readonly AlbumMapper $albumMapper,
		private readonly IRootFolder $rootFolder,
		private readonly IUserManager $userManager,
		private readonly UserConfigService $userConfigService,
		private readonly IMimeTypeDetector $mimeTypeDetector,
		private readonly IFilenameValidator $filenameValidator,
		private readonly ILockingProvider $lockingProvider,
		private readonly IAppConfig $appConfig,
		private readonly IFactory $l10nFactory,
		private readonly IL10N $l,
		private readonly LoggerInterface $logger,
	) {
	}

	public function getMaxSize(): int {
		return $this->appConfig->getValueInt(Application::APP_ID, self::CONFIG_MAX_SIZE, self::DEFAULT_MAX_SIZE);
	}

	/**
	 * @param array $upload The entry of the uploaded file in $_FILES
	 * @return int The id of the stored file
	 * @throws GuestUploadException
	 */
	public function upload(AlbumInfo $album, array $upload, string $guestName): int {
		$error = $upload['error'] ?? UPLOAD_ERR_NO_FILE;
		if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE) {
			throw new GuestUploadException($this->l->t('The file is too large.'), Http::STATUS_REQUEST_ENTITY_TOO_LARGE);
		}
		if ($error !== UPLOAD_ERR_OK || !is_string($upload['tmp_name'] ?? null) || !is_string($upload['name'] ?? null)) {
			throw new GuestUploadException($this->l->t('No file was uploaded.'), Http::STATUS_BAD_REQUEST);
		}

		$tmpPath = $upload['tmp_name'];
		$size = @filesize($tmpPath);
		if ($size === false || $size === 0) {
			throw new GuestUploadException($this->l->t('No file was uploaded.'), Http::STATUS_BAD_REQUEST);
		}
		if ($size > $this->getMaxSize()) {
			throw new GuestUploadException($this->l->t('The file is too large.'), Http::STATUS_REQUEST_ENTITY_TOO_LARGE);
		}

		$allowedMimes = [...Application::IMAGE_MIMES, ...Application::VIDEO_MIMES];
		$name = $this->buildFileName($upload['name'], $guestName);
		if (!in_array($this->mimeTypeDetector->detectPath($name), $allowedMimes, true)
			|| !in_array($this->mimeTypeDetector->detectContent($tmpPath), $allowedMimes, true)) {
			throw new GuestUploadException($this->l->t('Only photos and videos can be added.'), Http::STATUS_UNSUPPORTED_MEDIA_TYPE);
		}

		$owner = $this->userManager->get($album->getUserId());
		if ($owner === null || !$owner->isEnabled()) {
			throw new GuestUploadException($this->l->t('This album does not accept photos.'), Http::STATUS_FORBIDDEN);
		}

		$file = $this->reserveFile($album, $name, $size);
		try {
			$stream = fopen($tmpPath, 'rb');
			if ($stream === false) {
				throw new \RuntimeException('Could not read the uploaded file');
			}
			$file->putContent($stream);
			$this->albumMapper->addFile($album->getId(), $file->getId(), $album->getUserId());
		} catch (\Throwable $e) {
			$this->logger->error('Could not store a guest upload', ['exception' => $e]);
			try {
				$file->delete();
			} catch (\Throwable) {
			}
			throw new GuestUploadException($this->l->t('The file could not be saved.'), Http::STATUS_INTERNAL_SERVER_ERROR);
		}

		return $file->getId();
	}

	/**
	 * The client side name without any path, prefixed with the guest's name.
	 */
	private function buildFileName(string $originalName, string $guestName): string {
		$stripControl = static fn (string $value): string => trim((string)preg_replace('/[\x00-\x1F\x7F]/u', '', $value));

		$originalName = $stripControl(basename(str_replace('\\', '/', $originalName)));
		$guestName = mb_substr($stripControl($guestName), 0, self::MAX_GUEST_NAME_LENGTH);
		$name = $guestName === '' ? $originalName : $guestName . ' – ' . $originalName;
		$name = ltrim($this->filenameValidator->sanitizeFilename($name), '.');

		if (strlen($name) > self::MAX_FILE_NAME_BYTES) {
			$extension = pathinfo($name, PATHINFO_EXTENSION);
			$name = mb_strcut($name, 0, self::MAX_FILE_NAME_BYTES - strlen($extension) - 1) . '.' . $extension;
		}

		return $name;
	}

	/**
	 * Create an empty file under a name not taken yet in the album's guest
	 * upload folder. The lock keeps concurrent uploads from picking the same name.
	 *
	 * @throws GuestUploadException
	 */
	private function reserveFile(AlbumInfo $album, string $name, int $size): File {
		$lockKey = 'photos/guest-upload/' . $album->getId();
		$this->acquireLock($lockKey);
		try {
			$folder = $this->getUploadFolder($album);

			$free = $folder->getFreeSpace();
			if ($free >= 0 && $free < $size) {
				throw new GuestUploadException($this->l->t('There is not enough space left for this file.'), Http::STATUS_INSUFFICIENT_STORAGE);
			}

			return $folder->newFile($folder->getNonExistingName($name));
		} catch (GuestUploadException $e) {
			throw $e;
		} catch (\Throwable $e) {
			$this->logger->error('Could not prepare a guest upload', ['exception' => $e]);
			throw new GuestUploadException($this->l->t('The file could not be saved.'), Http::STATUS_INTERNAL_SERVER_ERROR);
		} finally {
			$this->lockingProvider->releaseLock($lockKey, ILockingProvider::LOCK_EXCLUSIVE);
		}
	}

	/**
	 * Wait briefly for concurrent uploads to the same album to pick their names.
	 *
	 * @throws GuestUploadException
	 */
	private function acquireLock(string $lockKey): void {
		for ($attempt = 0; ; $attempt++) {
			try {
				$this->lockingProvider->acquireLock($lockKey, ILockingProvider::LOCK_EXCLUSIVE);
				return;
			} catch (LockedException $e) {
				if ($attempt >= 50) {
					throw new GuestUploadException($this->l->t('The album is busy, please try again.'), Http::STATUS_SERVICE_UNAVAILABLE);
				}
				usleep(100000);
			}
		}
	}

	/**
	 * "<photos folder>/<album> – guest uploads" in the owner's home storage,
	 * named in the owner's language.
	 */
	private function getUploadFolder(AlbumInfo $album): Folder {
		$ownerId = $album->getUserId();
		$userFolder = $this->rootFolder->getUserFolder($ownerId);
		$l = $this->l10nFactory->get(Application::APP_ID, $this->l10nFactory->getUserLanguage($this->userManager->get($ownerId)));
		$folderName = ltrim($this->filenameValidator->sanitizeFilename($l->t('%s – guest uploads', [$album->getTitle()])), '.');

		$folder = $userFolder;
		foreach ([$this->userConfigService->getConfigForUser($ownerId, 'photosLocation'), $folderName] as $path) {
			try {
				$folder = $folder->get($path);
			} catch (NotFoundException) {
				$folder = $folder->newFolder($path);
			}

			if (!$folder instanceof Folder || $folder->isShared() || !$folder->getStorage()->instanceOfStorage(IHomeStorage::class)) {
				throw new GuestUploadException($this->l->t('This album does not accept photos.'), Http::STATUS_FORBIDDEN);
			}
		}

		return $folder;
	}
}
