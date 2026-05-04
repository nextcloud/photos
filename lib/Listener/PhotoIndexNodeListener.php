<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use OCA\Photos\DB\PhotoPreviewWarmupMapper;
use OCA\Photos\DB\PhotoTranscodeMapper;
use OCA\Photos\Service\PhotoIndexService;
use OCA\Photos\Service\PhotoTranscodeService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Config\IUserMountCache;
use OCP\Files\Events\Node\NodeCreatedEvent;
use OCP\Files\Events\Node\NodeDeletedEvent;
use OCP\Files\Events\Node\NodeRenamedEvent;
use OCP\Files\Events\Node\NodeWrittenEvent;
use OCP\Files\Node;
use Psr\Log\LoggerInterface;

/**
 * Keeps `oc_photos_index` in sync with the filesystem in real time.
 *
 * Why a single listener for several events:
 * - NodeCreated / NodeWritten   → upsert (covers upload + edit-in-place)
 * - NodeRenamed                 → upsert against the new path; mtime
 *                                 may have changed and the cached
 *                                 EXIF lookup needs to refresh.
 * - NodeDeleted                 → drop all rows for this fileId; we
 *                                 don't know which users still have
 *                                 the file mounted, but if any do
 *                                 (group folders, re-shared) the next
 *                                 backfill or live event will recreate
 *                                 the row.
 *
 * `getMountsForFileId` resolves "which users see this file?" — a
 * single upload to a group folder fans out to one row per recipient,
 * matching how the timeline query is per-user.
 *
 * @template-implements IEventListener<NodeCreatedEvent|NodeWrittenEvent|NodeDeletedEvent|NodeRenamedEvent>
 */
class PhotoIndexNodeListener implements IEventListener {
	public function __construct(
		private readonly PhotoIndexService $indexService,
		private readonly PhotoTranscodeService $transcodeService,
		private readonly PhotoTranscodeMapper $transcodeMapper,
		private readonly PhotoPreviewWarmupMapper $warmupMapper,
		private readonly IUserMountCache $userMountCache,
		private readonly ITimeFactory $time,
		private readonly LoggerInterface $logger,
	) {
	}

	public function handle(Event $event): void {
		try {
			if ($event instanceof NodeDeletedEvent) {
				$this->onDeleted($event->getNode());
				return;
			}
			if ($event instanceof NodeRenamedEvent) {
				$this->onWritten($event->getTarget());
				return;
			}
			if ($event instanceof NodeCreatedEvent || $event instanceof NodeWrittenEvent) {
				$this->onWritten($event->getNode());
				return;
			}
		} catch (\Throwable $e) {
			// Indexing must never break the file pipeline.
			$this->logger->warning('photos index: listener failure', [
				'event' => $event::class,
				'exception' => $e,
			]);
		}
	}

	private function onWritten(Node $node): void {
		if (!$this->indexService->isPhotoOrVideo($node)) {
			return;
		}

		// Fan out: one row per user that mounts this file. For a
		// user-owned upload this is just the owner; for group-folder
		// uploads it's every member.
		$mounts = $this->userMountCache->getMountsForFileId($node->getId());
		if ($mounts === []) {
			// Fallback: the file's owner. getMountsForFileId can be
			// empty when the cache hasn't propagated yet (e.g. the
			// user has just been provisioned).
			$owner = $node->getOwner();
			if ($owner !== null) {
				$this->indexService->indexNodeForUser($node, $owner->getUID());
			}
		} else {
			foreach ($mounts as $mount) {
				$this->indexService->indexNodeForUser($node, $mount->getUser()->getUID());
			}
		}

		// Queue HEVC / AVI / etc. for HLS transcoding so the hover
		// preview can autoplay them in browsers that don't support
		// the source codec. mp4/webm/ogg files skip — `shouldQueue`
		// already filters them out.
		if ($this->transcodeService->shouldQueue($node)) {
			$this->transcodeMapper->markPending($node->getId(), $this->time->getTime());
		}

		// Queue every photo/video for preview-cache warming so the
		// first scroll doesn't pay the on-demand `IPreview::getPreview`
		// cost. Idempotent — `markPending` is a no-op for files that
		// are already pending / warmed.
		$this->warmupMapper->markPending($node->getId(), $this->time->getTime());
	}

	private function onDeleted(Node $node): void {
		// We can't gate on isPhotoOrVideo here because the node may
		// already be partially detached. A no-op delete on a non-photo
		// is harmless (file_id won't exist in the index).
		$this->indexService->deleteFile($node->getId());
		// Wipe any cached transcode segments — drops the row + the
		// on-disk segments so the cache doesn't outlive the file.
		$this->transcodeService->deleteForFileId($node->getId());
		// Drop the warmup queue row. NC's preview cache itself is
		// cleaned by NC's own NodeDeleted hooks; this just clears
		// our bookkeeping.
		$this->warmupMapper->deleteByFileId($node->getId());
	}
}
