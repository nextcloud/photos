<?php

namespace OCA\Photos\Listener;

use OCA\Photos\Album\AlbumMapper;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Cache\CacheEntryRemovedEvent;
use OCP\Share\Events\ShareDeletedEvent;
use OCP\User\Events\UserDeletedEvent;

class AlbumsManagementEventListener implements IEventListener {
	private AlbumMapper $albumMapper;

	public function __construct(AlbumMapper $albumMapper) {
		$this->albumMapper = $albumMapper;
	}

	public function handle(Event $event): void {
		if ($event instanceof CacheEntryRemovedEvent) {
			// Remove node from all albums containing it.
			$albums = $this->albumMapper->getForFile($event->getFileId());
			foreach ($albums as $album) {
				$this->albumMapper->removeFile($album->getId(), $event->getFileId());
			}
		}

		if ($event instanceof UserDeletedEvent) {
			// Delete all user's albums.
			$albums = $this->albumMapper->getForUser($event->getUser()->getUID());
			foreach ($albums as $album) {
				$this->albumMapper->delete($album->getId());
			}
		}

		if ($event instanceof ShareDeletedEvent) {
			$receiverId = $event->getShare()->getSharedWith();
			$this->forEachSubNode(
				$event->getShare()->getNode(),
				// Remove node from any album when the owner is $receiverId.
				fn ($node) => $this->albumMapper->removeFileWithOwner($node->getId(), $receiverId),
			);
		}
	}

	private function forEachSubNode(Node $node, callable $callback): void {
		if ($node instanceof Folder) {
			foreach ($node->getDirectoryListing() as $subNode) {
				$this->forEachSubNode($subNode, $callback);
			}
		}

		if ($node instanceof File) {
			if (!str_starts_with($node->getMimeType(), 'image')) {
				return;
			}

			$callback($node);
		}
	}
}
