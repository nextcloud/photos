<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
		private readonly IRequest $request,
	) {
	}

	public function handle(Event $event): void {
		if (!($event instanceof LoadSidebar)) {
			return;
		}

		// Only load sidebar tab in the photos app.
		if (!preg_match('/^photos\.page\..+/', (string)$this->request->getParams()['_route'])) {
			return;
		}

		Util::addScript(Application::APP_ID, 'photos-sidebar');
		Util::addStyle(Application::APP_ID, 'photos-sidebar');
	}
}
