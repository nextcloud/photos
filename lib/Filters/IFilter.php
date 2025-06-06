<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Filters;

use OCP\Files\Search\ISearchBinaryOperator;

interface IFilter {

	public function getId(): string;

	public function getSearchOperator(array $filterValue): ISearchBinaryOperator;
}
