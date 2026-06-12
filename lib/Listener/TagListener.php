<?php

/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Photos\Listener;

use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Config\IUserMountCache;
use OCP\Files\IRootFolder;
use OCP\ICache;
use OCP\ICacheFactory;
use OCP\SystemTag\TagAssignedEvent;
use OCP\SystemTag\TagUnassignedEvent;
use Override;

/**
 * @template-implements IEventListener<TagAssignedEvent|TagUnassignedEvent>
 */
class TagListener implements IEventListener {
	private readonly ICache $tagCountsCache;

	public function __construct(
		ICacheFactory $cacheFactory,
		private readonly IRootFolder $rootFolder,
		private readonly IUserMountCache $userMountCache,
	) {
		$this->tagCountsCache = $cacheFactory->createLocal('photos:tag-counts');
	}

	#[Override]
	public function handle(Event $event): void {
		if (!$event instanceof TagAssignedEvent && !$event instanceof TagUnassignedEvent) {
			return;
		}

		if ($event->getObjectType() !== 'files') {
			return;
		}

		foreach ($event->getObjectIds() as $objectId) {
			$node = $this->rootFolder->getFirstNodeById((int)$objectId);
			if (!$node) {
				continue;
			}

			$mounts = $this->userMountCache->getMountsForRootId($node->getMountPoint()->getStorageRootId());
			foreach ($mounts as $mount) {
				$this->tagCountsCache->remove($mount->getUser()->getUID());
			}
		}
	}
}
