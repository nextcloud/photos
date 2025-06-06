<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB\Place;

class PlaceInfo {
	public function __construct(
		private readonly string $userId,
		private readonly string $place,
	) {
	}

	public function getUserId(): string {
		return $this->userId;
	}

	public function getPlace(): string {
		return $this->place;
	}
}
