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
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\IMetadataQuery;
use OCP\FilesMetadata\Model\IFilesMetadata;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class NameFilterTest extends TestCase {
	private IFilesMetadata&MockObject $knownMetadata;
	private NameFilter $filter;

	protected function setUp(): void {
		parent::setUp();

		$this->knownMetadata = $this->createMock(IFilesMetadata::class);
		$metadataManager = $this->createMock(IFilesMetadataManager::class);
		$metadataManager->method('getKnownMetadata')->willReturn($this->knownMetadata);

		$this->filter = new NameFilter($metadataManager);
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

	public function testRequiresEveryWordToMatchInAnyOrder(): void {
		$this->knownMetadata->method('isIndex')->with('photos-caption')->willReturn(true);

		$operator = $this->filter->getSearchOperator(['beach  dog']);

		$this->assertEquals(ISearchBinaryOperator::OPERATOR_AND, $operator->getType());
		$this->assertCount(2, $operator->getArguments());
		foreach ($operator->getArguments() as $index => $either) {
			$this->assertInstanceOf(ISearchBinaryOperator::class, $either);
			$this->assertEquals(ISearchBinaryOperator::OPERATOR_OR, $either->getType());
			$this->assertEquals(
				[['name', ['%beach%', '%dog%'][$index]], ['photos-caption', ['%beach%', '%dog%'][$index]]],
				array_map(fn ($comparison) => [$comparison->getField(), $comparison->getValue()], $either->getArguments()),
			);
		}
	}

	public function testSplitsOnAnyWhitespaceAndIgnoresRepeatedWords(): void {
		$operator = $this->filter->getSearchOperator(["dog\ton the\nbeach Dög DOG", 'the']);

		$this->assertEquals(
			['%dog%', '%on%', '%the%', '%beach%', '%Dög%'],
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

	public function testAlsoMatchesTheDescriptionOnceItIsIndexed(): void {
		$this->knownMetadata->method('isIndex')->with('photos-caption')->willReturn(true);

		$operator = $this->filter->getSearchOperator(['beach']);

		$this->assertCount(1, $operator->getArguments());
		$either = $operator->getArguments()[0];
		$this->assertInstanceOf(ISearchBinaryOperator::class, $either);
		$this->assertEquals(ISearchBinaryOperator::OPERATOR_OR, $either->getType());

		[$name, $caption] = $either->getArguments();
		$this->assertInstanceOf(ISearchComparison::class, $name);
		$this->assertInstanceOf(ISearchComparison::class, $caption);
		$this->assertEquals('name', $name->getField());
		$this->assertEquals('photos-caption', $caption->getField());
		$this->assertEquals(ISearchComparison::COMPARE_LIKE, $caption->getType());
		$this->assertEquals(IMetadataQuery::EXTRA, $caption->getExtra());
		$this->assertEquals('%beach%', $caption->getValue());
	}
}
