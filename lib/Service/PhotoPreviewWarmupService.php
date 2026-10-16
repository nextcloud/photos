<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\PhotoPreviewWarmupMapper;
use OCP\Files\File;
use OCP\Files\IRootFolder;
use OCP\IConfig;
use OCP\IPreview;
use Psr\Log\LoggerInterface;

/**
 * Pre-generates preview thumbnails for indexed photos so the user
 * doesn't pay the on-demand cost on first scroll. Each photo gets
 * pushed through `IPreview::getPreview` at the two sizes the photos
 * UI requests:
 *
 *   - 64×64  (small layer in FileComponent)
 *   - 1024×1024 (large layer on desktop; mobile's 256 derives from
 *                this on-the-fly which is fast)
 *
 * The work is *idempotent* — `getPreview` is a cache-fill operation
 * (NC's preview cache lives under `appdata_<id>/preview/`) so a
 * call on an already-warm file is a quick stat-and-return. That's
 * what makes batched processing safe.
 *
 * Disabled by default through `enable_preview_warmup` AppValue —
 * admins on tight quotas can leave it off; the trade is faster
 * first-scroll vs. ~3-5 GB extra under appdata for a 100k-photo
 * library.
 */
class PhotoPreviewWarmupService {
	/** Sizes mirror FileComponent's `srcSmall` and `srcLarge` —
	 * prime exactly what the UI asks for so cache hits land. */
	public const PREVIEW_SIZES = [
		[64, 64],
		[1024, 1024],
	];

	public function __construct(
		private readonly PhotoPreviewWarmupMapper $mapper,
		private readonly IRootFolder $rootFolder,
		private readonly IPreview $preview,
		private readonly IConfig $config,
		private readonly LoggerInterface $logger,
	) {
	}

	/**
	 * True when the admin hasn't disabled warmup. Default `true`
	 * for fresh installs because the perf win is the whole point;
	 * existing instances are unaffected until the migration runs.
	 */
	public function isEnabled(): bool {
		return $this->config->getAppValue(
			Application::APP_ID,
			'enable_preview_warmup',
			'true',
		) === 'true';
	}

	/**
	 * Warm the previews for one file. Returns true on success
	 * (every requested size produced a usable preview), false if
	 * any size failed — the caller flips the row to `failed` so
	 * the worker doesn't keep retrying a corrupt image forever.
	 */
	public function warmFile(int $fileId): bool {
		$node = $this->resolveNode($fileId);
		if (!$node instanceof File) {
			// File vanished or got moved out of any user's reach.
			// Marking failed (rather than warmed) so the listener
			// can recreate it cleanly on the next NodeWritten if
			// the file resurfaces.
			return false;
		}

		if (!$this->preview->isAvailable($node)) {
			// Mimetype with no preview provider (rare given we
			// only index photos+videos, but defensive). Treat as
			// "done" so we don't retry — `markWarmed` is a fine
			// no-op for these.
			return true;
		}

		try {
			foreach (self::PREVIEW_SIZES as [$x, $y]) {
				// `crop = false` so the preview keeps its aspect
				// ratio — matches what `srcSmall` / `srcLarge`
				// generate today (the photos preview controller
				// passes the same flags).
				$this->preview->getPreview($node, $x, $y);
			}
		} catch (\Throwable $e) {
			$this->logger->debug('photos warmup: getPreview failed for {fileId}', [
				'fileId' => $fileId,
				'exception' => $e,
			]);
			return false;
		}

		return true;
	}

	private function resolveNode(int $fileId): ?File {
		try {
			$nodes = $this->rootFolder->getById($fileId);
		} catch (\Throwable) {
			return null;
		}
		foreach ($nodes as $node) {
			if ($node instanceof File) {
				return $node;
			}
		}
		return null;
	}
}
