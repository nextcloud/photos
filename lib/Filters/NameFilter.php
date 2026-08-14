<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Filters;

use OC\Files\Search\SearchBinaryOperator;
use OC\Files\Search\SearchComparison;
use OCP\Files\Search\ISearchBinaryOperator;
use OCP\Files\Search\ISearchComparison;

class NameFilter implements IFilter {
	public const string ID = 'name';

	#[\Override]
	public function getId(): string {
		return self::ID;
	}

	/**
	 * Match the file name against the search terms, all of them have to match.
	 */
	#[\Override]
	public function getSearchOperator(array $filterValues): ISearchBinaryOperator {
		$searchTerms = array_map(fn ($searchTerm) => is_string($searchTerm) ? trim($searchTerm) : '', $filterValues);
		$searchTerms = array_values(array_filter($searchTerms, fn (string $searchTerm) => $searchTerm !== ''));

		return new SearchBinaryOperator(
			ISearchBinaryOperator::OPERATOR_AND,
			array_map(
				fn (string $searchTerm) => new SearchComparison(
					ISearchComparison::COMPARE_LIKE,
					'name',
					'%' . SearchComparison::escapeLikeParameter($searchTerm) . '%',
				),
				$searchTerms
			),
		);
	}
}
