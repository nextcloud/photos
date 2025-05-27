<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Album;

class AlbumInfo {
	public function __construct(
		private readonly int $id,
		private readonly string $userId,
		private readonly string $title,
		private readonly string $location,
		private readonly int $created,
		private readonly int $lastAdded,
		private readonly ?string $filters = null,
		private readonly ?int $receivedFrom = null,
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

	public function getFilters(): ?string {
		return $this->filters;
	}

	public function getDecodedFilters(): array {
		return json_decode($this->filters ?? '{}', true);
	}
}
