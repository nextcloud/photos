<?php

namespace OCA\Photos\Event;

use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Events\Node\NodeDeletedEvent;
use OCA\Photos\Album\AlbumMapper;

class MoveToTrashListener implements IEventListener {
	private AlbumMapper $albumMapper;

	public function __construct(AlbumMapper $albumMapper) {
		$this->albumMapper = $albumMapper;
	}

	public function handle(Event $event): void {
		if (!($event instanceOf NodeDeletedEvent)) {
			return;
		}

		// Remove node from all albums containing it.
		$albums = $this->albumMapper->getForFile($event->getNode()->getId());
		foreach ($albums as $album) {
			$this->albumMapper->removeFile($album->getId(), $event->getNode()->getId());
		}
	}
}