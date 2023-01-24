<?php

namespace OCA\Photos\Listener;

use OCA\Photos\Album\AlbumMapper;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Group\Events\UserRemovedEvent;

class GroupUserRemovedListener implements IEventListener {
	private AlbumMapper $albumMapper;

	public function __construct(AlbumMapper $albumMapper) {
		$this->albumMapper = $albumMapper;
	}

	public function handle(Event $event): void {
		if (!($event instanceof UserRemovedEvent)) {
			return;
		}

		// Get all shared albums for this group:
		$albums_group = $this->albumMapper->getSharedAlbumsForCollaboratorWithFiles($event->getGroup()->getGID(), AlbumMapper::TYPE_GROUP);
		// Get all albums shared with this specific user:
		$albums_user = $this->albumMapper->getSharedAlbumsForCollaboratorWithFiles($event->getUser()->getUID(), AlbumMapper::TYPE_USER);
		// Get all group-shared albums that are not directly shared with the removed user in addition
		$albums = array_udiff($albums_group, $albums_user, fn ($a, $b) => ($a->getAlbum()->getId() - $b->getAlbum()->getId()));

		// Remove their photos from theses albums:
		foreach ($albums as $album) {
		    $this->albumMapper->removeFilesForUser($album->getAlbum()->getId(), $event->getUser()->getUID());
		}
	}
}
