<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use OCA\Photos\Album\AlbumMapper;
use OCP\Comments\CommentsEntityEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\IUserSession;

/**
 * Registers albums as a comments entity, available at /remote.php/dav/comments/photos_album/<album id>.
 *
 * @template-implements IEventListener<CommentsEntityEvent>
 */
class AlbumCommentsEntityListener implements IEventListener {
	public function __construct(
		private readonly AlbumMapper $albumMapper,
		private readonly IUserSession $userSession,
	) {
	}

	#[\Override]
	public function handle(Event $event): void {
		if (!($event instanceof CommentsEntityEvent)) {
			return;
		}

		$event->addEntityCollection(AlbumMapper::COMMENTS_OBJECT_TYPE, fn (string $albumId): bool => $this->canAccessComments($albumId));
	}

	/**
	 * Only the album owner and its user or group collaborators may read and write comments.
	 * Public link visitors have no user session and are always rejected.
	 */
	public function canAccessComments(string $albumId): bool {
		$user = $this->userSession->getUser();
		if ($user === null || !ctype_digit($albumId)) {
			return false;
		}

		$album = $this->albumMapper->get((int)$albumId);
		if ($album === null) {
			return false;
		}

		return $album->getUserId() === $user->getUID()
			|| $this->albumMapper->isCollaborator($album->getId(), $user->getUID());
	}
}
