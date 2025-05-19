<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Photos\Listener;

use OCA\DAV\Events\SabrePluginAuthInitEvent;
use OCA\Photos\Sabre\PublicAlbumAuthBackend;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;

/**
 * @template-implements IEventListener<SabrePluginAuthInitEvent>
 */
class SabrePluginAuthInitListener implements IEventListener {
	public function __construct(
		private readonly PublicAlbumAuthBackend $publicAlbumAuthBackend,
	) {
	}

	public function handle(Event $event): void {
		if (!($event instanceof SabrePluginAuthInitEvent)) {
			return;
		}

		$server = $event->getServer();

		if (!str_starts_with((string)$server->getRequestUri(), 'photospublic/')) {
			return;
		}

		/** @var \Sabre\DAV\Auth\Plugin */
		$authPlugin = $server->getPlugin('auth');
		$authPlugin->addBackend($this->publicAlbumAuthBackend);
	}
}
