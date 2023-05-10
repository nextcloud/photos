<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2022, Louis Chmn <louis@chmn.me>
 *
 * @author Louis Chmn <louis@chmn.me>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\Photos\Listener;

use OCA\DAV\Events\SabrePluginAuthInitEvent;
use OCA\Photos\Sabre\PublicAlbumAuthBackend;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;

class SabrePluginAuthInitListener implements IEventListener {
	private PublicAlbumAuthBackend $publicAlbumAuthBackend;

	public function __construct(PublicAlbumAuthBackend $publicAlbumAuthBackend) {
		$this->publicAlbumAuthBackend = $publicAlbumAuthBackend;
	}

	public function handle(Event $event): void {
		if (!($event instanceof SabrePluginAuthInitEvent)) {
			return;
		}

		$server = $event->getServer();

		if (!str_starts_with($server->getRequestUri(), 'photospublic/')) {
			return;
		}

		$authPlugin = $server->getPlugin('auth');
		$authPlugin->addBackend($this->publicAlbumAuthBackend);
	}
}
