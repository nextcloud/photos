<?php

namespace OCA\Photos\Listener;

use OCA\Photos\Album\AlbumMapper;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Events\Node\NodeDeletedEvent;
use OCP\Group\Events\GroupDeletedEvent;
use OCP\Group\Events\UserRemovedEvent;
use OCP\Share\Events\ShareDeletedEvent;
use OCP\User\Events\UserDeletedEvent;
use Psr\Log\LoggerInterface;

class AlbumsManagementEventListener implements IEventListener {
	private AlbumMapper $albumMapper;
	private LoggerInterface $logger;

	public function __construct(
		AlbumMapper $albumMapper,
		LoggerInterface $logger,
	) {
		$this->albumMapper = $albumMapper;
		$this->logger = $logger;
	}

	public function handle(Event $event): void {
		if ($event instanceof NodeDeletedEvent) {
			try {
				// Remove node from all albums containing it.
				$albums = $this->albumMapper->getForFile($event->getNode()->getId());

				foreach ($albums as $album) {
					$this->albumMapper->removeFile($album->getId(), $event->getNode()->getId());
				}
			} catch(\Throwable $ex) {
				// If an error occur, return silently as we don't want to block the rest of the deletion process.
				// It happened already during migrations when the albums table is not yet created, but a folder is deleted by the theming app.
				$this->logger->error($ex->getMessage(), ['exception' => $ex]);
			}
		} elseif ($event instanceof UserDeletedEvent) {
			// Delete all user's albums.
			$albums = $this->albumMapper->getForUser($event->getUser()->getUID());
			foreach ($albums as $album) {
				$this->albumMapper->delete($album->getId());
			}
		} elseif ($event instanceof ShareDeletedEvent) {
			$receiverId = $event->getShare()->getSharedWith();
			if ($receiverId !== null) { // null for public link shares
				$this->forEachSubNode(
					$event->getShare()->getNode(),
					// Remove node from any album when the owner is $receiverId.
					fn ($node) => $this->albumMapper->removeFileWithOwner($node->getId(), $receiverId),
				);
			}
		} elseif ($event instanceof UserRemovedEvent) {
			// Get all shared albums for this group:
			$albums_group = $this->albumMapper->getSharedAlbumsForCollaborator($event->getGroup()->getGID(), AlbumMapper::TYPE_GROUP);
			// Get all albums shared with this specific user:
			$albums_user = $this->albumMapper->getSharedAlbumsForCollaborator($event->getUser()->getUID(), AlbumMapper::TYPE_USER);
			// Get all group-shared albums that are not directly shared with the removed user in addition
			$albums = array_udiff($albums_group, $albums_user, fn ($a, $b) => ($a->getId() - $b->getId()));

			// Remove their photos from theses albums:
			foreach ($albums as $album) {
				$this->albumMapper->removeFilesForUser($album->getId(), $event->getUser()->getUID());
			}
		} elseif ($event instanceof GroupDeletedEvent) {
			// Get all shared albums for this group:
			$albums_group = $this->albumMapper->getSharedAlbumsForCollaborator($event->getGroup()->getGID(), AlbumMapper::TYPE_GROUP);

			// Get all users of this group:
			$users = $event->getGroup()->getUsers();

			foreach ($users as $user) {
				// Get all albums shared with this specific user:
				$albums_user = $this->albumMapper->getSharedAlbumsForCollaborator($user->getUID(), AlbumMapper::TYPE_USER);

				// Get all group-shared albums that are not directly shared with the removed user in addition
				$albums = array_udiff($albums_group, $albums_user, fn ($a, $b) => ($a->getId() - $b->getId()));

				// Remove their photos from theses albums:
				foreach ($albums as $album) {
					$this->albumMapper->removeFilesForUser($album->getId(), $user->getUID());
				}
			}

			foreach ($albums_group as $album) {
				$this->albumMapper->deleteGroupFromAlbumCollaboratorsList($event->getGroup()->getGID(), $album->getId());
			}
		}
	}

	private function forEachSubNode(Node $node, callable $callback): void {
		if ($node instanceof Folder) {
			foreach ($node->getDirectoryListing() as $subNode) {
				$this->forEachSubNode($subNode, $callback);
			}
		} elseif ($node instanceof File) {
			if (!str_starts_with($node->getMimeType(), 'image')) {
				return;
			}

			$callback($node);
		}
	}
}
