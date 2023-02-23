<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
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

use OCA\Photos\Jobs\MapMediaToPlaceJob;
use OCA\Photos\Service\MediaPlaceManager;
use OCP\BackgroundJob\IJobList;
use OCP\IConfig;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Files\Events\Node\NodeWrittenEvent;

/**
 * Listener to add place info from the database.
 */
class PlaceManagerEventListener implements IEventListener {
	public function __construct(
		private MediaPlaceManager $mediaPlaceManager,
		private IConfig $config,
		private IJobList $jobList,
	) {
	}

	public function handle(Event $event): void {
		if (!$this->config->getSystemValueBool('enable_file_metadata', true)) {
			return;
		}

		if ($event instanceof NodeWrittenEvent) {
			if (!$this->isCorrectPath($event->getNode()->getPath())) {
				return;
			}

			if (!str_starts_with($event->getNode()->getMimeType(), 'image')) {
				return;
			}

			$fileId = $event->getNode()->getId();

			$this->jobList->add(MapMediaToPlaceJob::class, [$fileId]);
		}
	}

	private function isCorrectPath(string $path): bool {
		// TODO make this more dynamic, we have the same issue in other places
		return !str_starts_with($path, 'appdata_') && !str_starts_with($path, 'files_versions/');
	}
}
