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

class TagsFilter implements IFilter {
	public const string ID = 'tags';

	#[\Override]
	public function getId(): string {
		return self::ID;
	}

	/**
	 * Match the files carrying any of the system tags, by tag name.
	 *
	 * The file search only joins the tags the user is allowed to see.
	 * Each name is compared with an escaped `LIKE`, as the search optimizer
	 * merges several `EQUAL` comparisons into an `IN`, which the search does
	 * not support for system tags.
	 */
	#[\Override]
	public function getSearchOperator(array $filterValues): ISearchBinaryOperator {
		$tagNames = array_filter($filterValues, fn ($tagName) => is_string($tagName) && $tagName !== '');

		return new SearchBinaryOperator(
			ISearchBinaryOperator::OPERATOR_OR,
			array_map(
				fn (string $tagName) => new SearchComparison(
					ISearchComparison::COMPARE_LIKE,
					'systemtag',
					SearchComparison::escapeLikeParameter($tagName),
				),
				array_values($tagNames),
			),
		);
	}
}
