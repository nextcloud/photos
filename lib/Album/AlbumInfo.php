<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Album;

class AlbumInfo {
	private int $id;
	private string $userId;
	private string $title;
	private string $location;
	private int $created;
	private int $lastAdded;
	private ?int $receivedFrom;

	public function __construct(
		int $id,
		string $userId,
		string $title,
		string $location,
		int $created,
		int $lastAdded,
		?int $receivedFrom = null,
	) {
		$this->id = $id;
		$this->userId = $userId;
		$this->title = $title;
		$this->location = $location;
		$this->created = $created;
		$this->lastAdded = $lastAdded;
		$this->receivedFrom = $receivedFrom;
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

	public function getReceivedFrom(): ?int {
		return $this->receivedFrom;
	}
}
