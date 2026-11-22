<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Filters;

use OCA\Photos\Filters\TagsFilter;
use OCP\Files\Search\ISearchBinaryOperator;
use OCP\Files\Search\ISearchComparison;
use Test\TestCase;

class TagsFilterTest extends TestCase {
	private TagsFilter $filter;

	protected function setUp(): void {
		parent::setUp();

		$this->filter = new TagsFilter();
	}

	public function testMatchesTheSystemTagName(): void {
		$operator = $this->filter->getSearchOperator(['dog']);

		$this->assertEquals(ISearchBinaryOperator::OPERATOR_OR, $operator->getType());

		$comparisons = $operator->getArguments();
		$this->assertCount(1, $comparisons);
		$this->assertEquals(ISearchComparison::COMPARE_LIKE, $comparisons[0]->getType());
		$this->assertEquals('systemtag', $comparisons[0]->getField());
		$this->assertEquals('dog', $comparisons[0]->getValue());
	}

	public function testMatchesAnyOfTheTags(): void {
		$operator = $this->filter->getSearchOperator(['dog', 'beach']);

		$this->assertEquals(ISearchBinaryOperator::OPERATOR_OR, $operator->getType());
		$this->assertEquals(
			['dog', 'beach'],
			array_map(fn ($comparison) => $comparison->getValue(), $operator->getArguments()),
		);
	}

	public function testEscapesTheLikeWildcards(): void {
		$operator = $this->filter->getSearchOperator(['100%_of\\it']);

		$this->assertEquals('100\\%\\_of\\\\it', $operator->getArguments()[0]->getValue());
	}

	public function testIgnoresValuesWhichAreNotTagNames(): void {
		$operator = $this->filter->getSearchOperator(['', 42, null, ['dog'], 'beach']);

		$this->assertEquals(
			['beach'],
			array_map(fn ($comparison) => $comparison->getValue(), $operator->getArguments()),
		);
	}
}
