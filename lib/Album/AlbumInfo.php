<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022 Robin Appelman <robin@icewind.nl>
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

namespace OCA\Photos\Album;

class AlbumInfo {
	private int $id;
	private string $userId;
	private string $title;
	private string $location;
	private int $created;
	private int $lastAdded;

	public function __construct(
		int $id,
		string $userId,
		string $title,
		string $location,
		int $created,
		int $lastAdded
	) {
		$this->id = $id;
		$this->userId = $userId;
		$this->title = $title;
		$this->location = $location;
		$this->created = $created;
		$this->lastAdded = $lastAdded;
	}

	public function getId(): int {
		return $this->id;
	}

	public function getUserId(): string {
		return $this->userId;
	}

	public function getTitle(): string {
		return $this->title;
	}

	public function getLocation(): string {
		return $this->location;
	}

	public function getCreated(): int {
		return $this->created;
	}

	public function getLastAddedPhoto(): int {
		return $this->lastAdded;
	}
}
