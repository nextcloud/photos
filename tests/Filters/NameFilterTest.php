<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Filters;

use OCA\Photos\Filters\NameFilter;
use OCP\Files\Search\ISearchBinaryOperator;
use OCP\Files\Search\ISearchComparison;
use Test\TestCase;

class NameFilterTest extends TestCase {
	private NameFilter $filter;

	protected function setUp(): void {
		parent::setUp();

		$this->filter = new NameFilter();
	}

	public function testMatchesTheNameAsSubstring(): void {
		$operator = $this->filter->getSearchOperator(['holidays']);

		$this->assertEquals(ISearchBinaryOperator::OPERATOR_AND, $operator->getType());

		$comparisons = $operator->getArguments();
		$this->assertCount(1, $comparisons);
		$this->assertEquals(ISearchComparison::COMPARE_LIKE, $comparisons[0]->getType());
		$this->assertEquals('name', $comparisons[0]->getField());
		$this->assertEquals('%holidays%', $comparisons[0]->getValue());
	}

	public function testRequiresAllSearchTermsToMatch(): void {
		$operator = $this->filter->getSearchOperator([' holidays ', 'rome']);

		$this->assertEquals(
			['%holidays%', '%rome%'],
			array_map(fn ($comparison) => $comparison->getValue(), $operator->getArguments()),
		);
	}

	public function testEscapesTheLikeWildcards(): void {
		$operator = $this->filter->getSearchOperator(['100%_of\\it']);

		$this->assertEquals('%100\\%\\_of\\\\it%', $operator->getArguments()[0]->getValue());
	}

	public function testIgnoresValuesWhichAreNotSearchTerms(): void {
		$operator = $this->filter->getSearchOperator(['', '   ', 42, null, 'rome']);

		$this->assertEquals(
			['%rome%'],
			array_map(fn ($comparison) => $comparison->getValue(), $operator->getArguments()),
		);
	}
}
