<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\ConfigLexicon;
use OCA\Photos\Jobs\GenerateCaptionJob;
use OCA\Photos\Listener\CaptionMetadataProvider;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\IJobList;
use OCP\Files\File;
use OCP\Files\IRootFolder;
use OCP\FilesMetadata\Exceptions\FilesMetadataNotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IAppConfig;
use OCP\IUserManager;
use OCP\L10N\IFactory;
use OCP\TaskProcessing\Exception\Exception as TaskProcessingException;
use OCP\TaskProcessing\IManager;
use OCP\TaskProcessing\Task;
use OCP\TaskProcessing\TaskTypes\AnalyzeImages;
use Psr\Log\LoggerInterface;

/**
 * Generates one-line descriptions of photos with the "Analyze images" task
 * processing provider and stores them in the files metadata.
 */
class CaptionService {
	/** Moment from which the next description may be requested, shared by all processes. */
	private const string CONFIG_NEXT_SLOT = 'ai_captions_next_slot';
	private const string CUSTOM_ID_PREFIX = 'caption:';
	/** Length of the string column of the files metadata index, longer values cannot be indexed. */
	public const int MAX_LENGTH = 63;

	public function __construct(
		private readonly IAppConfig $appConfig,
		private readonly IManager $taskProcessingManager,
		private readonly IJobList $jobList,
		private readonly IRootFolder $rootFolder,
		private readonly IFilesMetadataManager $metadataManager,
		private readonly IUserManager $userManager,
		private readonly IFactory $l10nFactory,
		private readonly ITimeFactory $timeFactory,
		private readonly LoggerInterface $logger,
	) {
	}

	public function isEnabled(): bool {
		return $this->appConfig->getValueBool(Application::APP_ID, ConfigLexicon::AI_CAPTIONS);
	}

	/**
	 * Whether descriptions are enabled and a provider can generate them.
	 */
	public function isAvailable(): bool {
		return $this->isEnabled()
			&& in_array(AnalyzeImages::ID, $this->taskProcessingManager->getAvailableTaskTypeIds(), true);
	}

	/**
	 * Request the description of a photo now, or in a background job once the
	 * hourly limit leaves room for it.
	 */
	public function queue(File $file): void {
		$userId = $file->getOwner()?->getUID();
		if ($userId === null) {
			return;
		}

		$slot = $this->reserveSlot();
		if ($slot <= $this->timeFactory->getTime()) {
			$this->schedule($userId, $file);
		} else {
			$this->jobList->scheduleAfter(GenerateCaptionJob::class, $slot, ['userId' => $userId, 'fileId' => $file->getId()]);
		}
	}

	/**
	 * Request the description of a photo, unless it was removed or described
	 * in the meantime.
	 */
	public function scheduleById(string $userId, int $fileId): void {
		if (!$this->isAvailable()) {
			return;
		}

		$file = $this->getUserFile($userId, $fileId);
		if ($file === null || !in_array($file->getMimeType(), Application::IMAGE_MIMES, true)) {
			return;
		}

		try {
			if ($this->metadataManager->getMetadata($fileId)->hasKey(CaptionMetadataProvider::METADATA_KEY)) {
				return;
			}
		} catch (FilesMetadataNotFoundException) {
		}

		$this->schedule($userId, $file);
	}

	/**
	 * Store the description returned by a task this service scheduled.
	 */
	public function saveCaption(Task $task): void {
		$customId = $task->getCustomId() ?? '';
		$userId = $task->getUserId();
		if ($task->getAppId() !== Application::APP_ID
			|| $task->getTaskTypeId() !== AnalyzeImages::ID
			|| !str_starts_with($customId, self::CUSTOM_ID_PREFIX)
			|| $userId === null) {
			return;
		}

		$caption = self::normalizeCaption($task->getOutput()['output'] ?? null);
		$fileId = (int)substr($customId, strlen(self::CUSTOM_ID_PREFIX));
		if ($caption === '' || $this->getUserFile($userId, $fileId) === null) {
			return;
		}

		$metadata = $this->metadataManager->getMetadata($fileId, true);
		$metadata->setString(CaptionMetadataProvider::METADATA_KEY, $caption, true);
		$this->metadataManager->saveMetadata($metadata);
	}

	/**
	 * Reduce the answer of the provider to a single line short enough to be
	 * indexed, cut at a word boundary when it is too long.
	 */
	public static function normalizeCaption(mixed $output): string {
		if (!is_string($output)) {
			return '';
		}

		$caption = trim(preg_replace('/\s+/u', ' ', $output) ?? '', " \"'“”„«»");
		if (mb_strlen($caption) <= self::MAX_LENGTH) {
			return $caption;
		}

		// One character is left for the ellipsis, a space right after the kept part still counts as a word boundary.
		$lastSpace = mb_strrpos(mb_substr($caption, 0, self::MAX_LENGTH), ' ');
		$caption = mb_substr($caption, 0, $lastSpace !== false && $lastSpace > self::MAX_LENGTH / 2 ? $lastSpace : self::MAX_LENGTH - 1);

		return rtrim($caption, ' ,;:.') . '…';
	}

	private function schedule(string $userId, File $file): void {
		$task = new Task(
			AnalyzeImages::ID,
			['images' => [$file->getId()], 'input' => $this->getPrompt($userId)],
			Application::APP_ID,
			$userId,
			self::CUSTOM_ID_PREFIX . $file->getId(),
		);

		try {
			$this->taskProcessingManager->scheduleTask($task);
		} catch (TaskProcessingException $e) {
			$this->logger->warning('Could not request the description of a photo', ['exception' => $e, 'fileId' => $file->getId()]);
		}
	}

	private function getPrompt(string $userId): string {
		$language = $this->l10nFactory->getUserLanguage($this->userManager->get($userId));

		return 'Describe this photo in one short sentence of at most ' . (self::MAX_LENGTH - 3) . ' characters, to be used as its alternative text. '
			. 'Write it in the language with the code "' . $language . '". Reply with the sentence only.';
	}

	/**
	 * Hand out the next free moment to request a description at, spacing them
	 * evenly to stay within the hourly limit.
	 */
	private function reserveSlot(): int {
		$now = $this->timeFactory->getTime();
		$perHour = max(1, $this->appConfig->getValueInt(Application::APP_ID, ConfigLexicon::AI_CAPTIONS_PER_HOUR, 60));
		$slot = max($now, $this->appConfig->getValueInt(Application::APP_ID, self::CONFIG_NEXT_SLOT, 0, true));
		$this->appConfig->setValueInt(Application::APP_ID, self::CONFIG_NEXT_SLOT, $slot + intdiv(3600, $perHour), true);

		return $slot;
	}

	private function getUserFile(string $userId, int $fileId): ?File {
		try {
			$node = $this->rootFolder->getUserFolder($userId)->getFirstNodeById($fileId);
		} catch (\Exception $e) {
			$this->logger->debug('Could not access the photo to describe', ['exception' => $e, 'fileId' => $fileId]);
			return null;
		}

		return $node instanceof File ? $node : null;
	}
}
