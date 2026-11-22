<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Jobs;

use OCA\Photos\AppInfo\Application;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\QueuedJob;
use OCP\Files\File;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IAppConfig;
use OCP\IPreview;
use Override;
use Psr\Log\LoggerInterface;

/**
 * Generates the previews the timeline requests first for one file, so that its
 * tile does not wait for them to be generated on demand.
 *
 * Argument: ['userId' => string, 'fileId' => int]
 */
class PregeneratePreviewsJob extends QueuedJob {
	/** App config key, a boolean, that turns preview pregeneration on or off */
	public const CONFIG_KEY = 'pregenerate_previews';

	/** The small placeholder and the mobile and desktop tiles of FileComponent.vue */
	public const SPECIFICATIONS = [
		['width' => 64, 'height' => 64, 'crop' => false, 'mode' => IPreview::MODE_FILL],
		['width' => 256, 'height' => 256, 'crop' => false, 'mode' => IPreview::MODE_FILL],
		['width' => 1024, 'height' => 1024, 'crop' => false, 'mode' => IPreview::MODE_FILL],
	];

	public function __construct(
		ITimeFactory $time,
		private readonly IRootFolder $rootFolder,
		private readonly IPreview $preview,
		private readonly IAppConfig $appConfig,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct($time);
	}

	public static function isEnabled(IAppConfig $appConfig): bool {
		return $appConfig->getValueBool(Application::APP_ID, self::CONFIG_KEY, true);
	}

	#[Override]
	protected function run($argument): void {
		if (!\is_array($argument) || !\is_string($argument['userId'] ?? null) || !\is_int($argument['fileId'] ?? null)) {
			return;
		}

		if (!self::isEnabled($this->appConfig)) {
			return;
		}

		try {
			$node = $this->rootFolder->getUserFolder($argument['userId'])->getFirstNodeById($argument['fileId']);
			if (!$node instanceof File || !$this->preview->isAvailable($node)) {
				return;
			}

			$this->preview->generatePreviews($node, self::SPECIFICATIONS);
		} catch (NotFoundException|\InvalidArgumentException $e) {
			// The file is gone or its content cannot be previewed, which an on demand request would run into as well.
			$this->logger->debug('Skipped preview pregeneration of file {fileId}', ['fileId' => $argument['fileId'], 'exception' => $e]);
		} catch (\Throwable $e) {
			$this->logger->warning('Could not pregenerate previews of file {fileId}', ['fileId' => $argument['fileId'], 'exception' => $e]);
		}
	}
}
