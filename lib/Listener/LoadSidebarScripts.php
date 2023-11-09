<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2023, Louis Chmn <louis@chmn.me>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\Photos\Listener;

use OCA\Files\Event\LoadSidebar;
use OCA\Photos\AppInfo\Application;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\IRequest;
use OCP\Util;

/**
 * @template-implements IEventListener<LoadSidebar>
 */
class LoadSidebarScripts implements IEventListener {

	public function __construct(
		private IRequest $request,
	) {
	}

	public function handle(Event $event): void {
		if (!($event instanceof LoadSidebar)) {
			return;
		}

		// Only load sidebar tab in the photos app.
		if (!preg_match('/^photos\.page\..+/', $this->request->getParams()['_route'])) {
			return;
		}

		Util::addScript(Application::APP_ID, 'photos-sidebar');
	}
}
