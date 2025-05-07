<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Album;

class AlbumInfo {

	public function __construct(
		private int $id,
		private string $userId,
		private string $title,
		private string $location,
		private int $created,
		private int $lastAdded,
		private ?int $receivedFrom = null,
		private ?array $filters = null,
	) {
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

	public function getFilters(): ?array {
		return $this->filters;
	}
}
