<?php

/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Photos\Listener;

use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Config\ICachedMountInfo;
use OCP\Files\Config\IUserMountCache;
use OCP\Files\IRootFolder;
use OCP\ICache;
use OCP\ICacheFactory;
use OCP\SystemTag\MapperEvent;

/**
 * @template-implements IEventListener<MapperEvent>
 */
class TagListener implements IEventListener {
	private readonly ICache $tagCountsCache;
	private readonly IRootFolder $rootFolder;
	private readonly IUserMountCache $userMountCache;

	public function __construct(ICacheFactory $cacheFactory, IRootFolder $rootFolder, IUserMountCache $userMountCache) {
		$this->tagCountsCache = $cacheFactory->createLocal('photos:tag-counts');
		$this->rootFolder = $rootFolder;
		$this->userMountCache = $userMountCache;
	}

	/**
	 * @inheritDoc
	 */
	public function handle(Event $event): void {
		if ($event instanceof MapperEvent) {
			if ($event->getObjectType() !== 'files') {
				return;
			}
			$node = current($this->rootFolder->getById((int)$event->getObjectId()));
			if (!$node) {
				return;
			}
			$mounts = $this->userMountCache->getMountsForRootId($node->getMountPoint()->getStorageRootId());
			$userIds = array_map(static fn (ICachedMountInfo $mount) => $mount->getUser()->getUID(), $mounts);
			foreach ($userIds as $userId) {
				$this->tagCountsCache->remove($userId);
			}
		}
	}
}
