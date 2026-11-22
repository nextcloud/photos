<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Import;

/**
 * Counts of the outcomes of an import, by outcome key.
 */
class ImportReport {
	/** @var array<string, int> */
	private array $counts = [];

	/**
	 * @param ?\Closure(string, ?string): void $onAdd Called with the outcome and the item, such as a file path, of each outcome added
	 */
	public function __construct(
		private readonly ?\Closure $onAdd = null,
	) {
	}

	public function add(string $outcome, ?string $item = null): void {
		$this->counts[$outcome] = ($this->counts[$outcome] ?? 0) + 1;
		if ($this->onAdd !== null) {
			($this->onAdd)($outcome, $item);
		}
	}

	/**
	 * Set a total, such as the number of files found.
	 */
	public function set(string $outcome, int $count): void {
		$this->counts[$outcome] = $count;
	}

	public function get(string $outcome): int {
		return $this->counts[$outcome] ?? 0;
	}

	/**
	 * @return array<string, int>
	 */
	public function getCounts(): array {
		return $this->counts;
	}
}
