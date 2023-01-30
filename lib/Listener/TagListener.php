<?php

namespace OCA\Photos\Listener;

use OCP\EventDispatcher\Event;
use OCP\Files\Config\ICachedMountInfo;
use OCP\Files\Config\IUserMountCache;
use OCP\Files\IRootFolder;
use OCP\ICacheFactory;
use OCP\SystemTag\MapperEvent;

class TagListener implements \OCP\EventDispatcher\IEventListener {
	private \OCP\ICache $tagCountsCache;
	private IRootFolder $rootFolder;
	private IUserMountCache $userMountCache;

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
			$userIds = array_map(static function (ICachedMountInfo $mount) {
				return $mount->getUser()->getUID();
			}, $mounts);
			foreach ($userIds as $userId) {
				$this->tagCountsCache->remove($userId);
			}
		}
	}
}
