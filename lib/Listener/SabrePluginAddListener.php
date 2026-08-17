<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Listener;

use OCA\DAV\Events\SabrePluginAddEvent;
use OCA\Photos\Sabre\MetadataPropPatchPlugin;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use Psr\Container\ContainerInterface;

/**
 * @template-implements IEventListener<SabrePluginAddEvent>
 */
class SabrePluginAddListener implements IEventListener {
	public function __construct(
		private readonly ContainerInterface $container,
	) {
	}

	#[\Override]
	public function handle(Event $event): void {
		if (!($event instanceof SabrePluginAddEvent)) {
			return;
		}

		$event->getServer()->addPlugin($this->container->get(MetadataPropPatchPlugin::class));
	}
}
