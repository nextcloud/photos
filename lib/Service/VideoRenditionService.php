<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Jobs\ConvertVideoJob;
use OCP\BackgroundJob\IJobList;
use OCP\Files\File;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;
use OCP\IAppConfig;
use OCP\IBinaryFinder;
use OCP\IConfig;

/**
 * Browser-playable H.264/AAC copies of videos, stored in the app data of
 * Photos as `video-renditions/<file id>/<etag>.mp4`. A version of a video that
 * cannot or need not be converted gets an empty `<etag>.none` marker instead,
 * so that it is not queued again.
 */
class VideoRenditionService {
	/** Admin switch for the conversion, off by default. */
	public const CONFIG_ENABLED = 'video_renditions_enabled';
	/** Largest original that is converted, in MiB. */
	public const CONFIG_MAX_SOURCE_SIZE = 'video_renditions_max_source_size';
	public const DEFAULT_MAX_SOURCE_SIZE = 2048;

	private const FOLDER = 'video-renditions';

	public function __construct(
		private readonly IAppConfig $appConfig,
		private readonly IConfig $config,
		private readonly IBinaryFinder $binaryFinder,
		private readonly IAppData $appData,
		private readonly IJobList $jobList,
	) {
	}

	/**
	 * The ffmpeg binary, found the same way as the one of the video previews.
	 */
	public function getFfmpegPath(): ?string {
		$path = $this->config->getSystemValue('preview_ffmpeg_path', null);
		if (!\is_string($path)) {
			$path = $this->binaryFinder->findBinaryPath('ffmpeg');
		}

		return \is_string($path) && $path !== '' ? $path : null;
	}

	public function getFfprobePath(string $ffmpegPath): string {
		$path = $this->config->getSystemValue('preview_ffprobe_path', null);
		return \is_string($path) && $path !== '' ? $path : \dirname($ffmpegPath) . '/ffprobe';
	}

	public function isEnabled(): bool {
		return $this->appConfig->getValueBool(Application::APP_ID, self::CONFIG_ENABLED)
			&& $this->getFfmpegPath() !== null;
	}

	/**
	 * @return int Largest original that is converted, in bytes
	 */
	public function getMaxSourceSize(): int {
		return $this->appConfig->getValueInt(Application::APP_ID, self::CONFIG_MAX_SOURCE_SIZE, self::DEFAULT_MAX_SOURCE_SIZE) * 1024 * 1024;
	}

	/**
	 * The rendition of the current version of $file, if there is one.
	 */
	public function getRendition(File $file): ?ISimpleFile {
		return $this->getVersionFile($file, 'mp4');
	}

	/**
	 * Whether the current version of $file was found to have no rendition to make.
	 */
	public function isUnconvertible(File $file): bool {
		return $this->getVersionFile($file, 'none') !== null;
	}

	/**
	 * Queues the conversion of $file, read through the files of $userId.
	 * A conversion already queued for the same file and user is not added twice.
	 */
	public function queue(string $userId, File $file): void {
		$this->jobList->add(ConvertVideoJob::class, ['userId' => $userId, 'fileId' => $file->getId()]);
	}

	/**
	 * Stores $content as the rendition of the current version of $file,
	 * replacing whatever was stored for an earlier one.
	 *
	 * @param resource $content
	 */
	public function saveRendition(File $file, $content): void {
		$this->getCleanFolder($file)->newFile($this->getVersionName($file, 'mp4'), $content);
	}

	public function markUnconvertible(File $file): void {
		$this->getCleanFolder($file)->newFile($this->getVersionName($file, 'none'), '');
	}

	public function deleteRenditions(int $fileId): void {
		try {
			$this->getRoot()->getFolder((string)$fileId)->delete();
		} catch (NotFoundException) {
		}
	}

	private function getVersionFile(File $file, string $extension): ?ISimpleFile {
		try {
			return $this->getRoot()
				->getFolder((string)$file->getId())
				->getFile($this->getVersionName($file, $extension));
		} catch (NotFoundException) {
			return null;
		}
	}

	private function getVersionName(File $file, string $extension): string {
		return preg_replace('/[^A-Za-z0-9]/', '', $file->getEtag()) . '.' . $extension;
	}

	private function getCleanFolder(File $file): ISimpleFolder {
		$this->deleteRenditions($file->getId());
		return $this->getRoot()->newFolder((string)$file->getId());
	}

	private function getRoot(): ISimpleFolder {
		try {
			return $this->appData->getFolder(self::FOLDER);
		} catch (NotFoundException) {
			return $this->appData->newFolder(self::FOLDER);
		}
	}
}
