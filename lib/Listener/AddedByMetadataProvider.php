<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use OCA\Photos\AppInfo\Application;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\File;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use OCP\IUserSession;

/**
 * Records who added a photo or video, which tells the people sharing a
 * library apart: the owner of a file in a shared folder or a group folder is
 * not the person who put it there.
 *
 * @template-implements IEventListener<MetadataLiveEvent>
 */
class AddedByMetadataProvider implements IEventListener {
	public const string METADATA_KEY = 'photos-added-by';

	public function __construct(
		private readonly IUserSession $userSession,
	) {
	}

	#[\Override]
	public function handle(Event $event): void {
		if (!($event instanceof MetadataLiveEvent)) {
			return;
		}

		$node = $event->getNode();
		if (!$node instanceof File || !in_array($node->getMimeType(), [...Application::IMAGE_MIMES, ...Application::VIDEO_MIMES], true)) {
			return;
		}

		// Metadata left by an earlier write means the file existed before: the
		// user writing it now edits it rather than adds it. This relies on the
		// listener running before the other metadata providers.
		$metadata = $event->getMetadata();
		if ($metadata->getKeys() !== []) {
			return;
		}

		$user = $this->userSession->getUser();
		if ($user === null) {
			return;
		}

		$metadata->setString(self::METADATA_KEY, $user->getUID());
	}
}
