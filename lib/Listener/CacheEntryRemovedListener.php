<?php

namespace OCA\Photos\Listener;

use OCA\Photos\Album\AlbumMapper;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Cache\CacheEntryRemovedEvent;

class CacheEntryRemovedListener implements IEventListener {
	private AlbumMapper $albumMapper;

	public function __construct(AlbumMapper $albumMapper) {
		$this->albumMapper = $albumMapper;
	}

	public function handle(Event $event): void {
		if (!($event instanceof CacheEntryRemovedEvent)) {
			return;
		}

		// Remove node from all albums containing it.
		$albums = $this->albumMapper->getForFile($event->getFileId());
		foreach ($albums as $album) {
			$this->albumMapper->removeFile($album->getId(), $event->getFileId());
		}
	}
}
