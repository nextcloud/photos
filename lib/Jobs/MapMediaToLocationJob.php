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

namespace OCA\Photos\Jobs;

use OCA\Photos\Service\MediaLocationManager;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\QueuedJob;

class MapMediaToLocationJob extends QueuedJob {
	private MediaLocationManager $mediaLocationManager;

	public function __construct(
		ITimeFactory $time,
		MediaLocationManager $mediaLocationManager
	) {
		parent::__construct($time);
		$this->mediaLocationManager = $mediaLocationManager;
	}

	protected function run($argument) {
		[$fileId] = $argument;

		$this->mediaLocationManager->setLocationForFile($fileId);
	}
}
