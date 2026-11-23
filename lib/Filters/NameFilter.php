<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Filters;

use OC\Files\Search\SearchBinaryOperator;
use OC\Files\Search\SearchComparison;
use OCA\Photos\Listener\CaptionMetadataProvider;
use OCP\Files\Search\ISearchBinaryOperator;
use OCP\Files\Search\ISearchComparison;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\IMetadataQuery;

class NameFilter implements IFilter {
	public const string ID = 'name';

	public function __construct(
		private readonly IFilesMetadataManager $metadataManager,
	) {
	}

	#[\Override]
	public function getId(): string {
		return self::ID;
	}

	/**
	 * Match the file name, or the description of the photo, against the search
	 * terms, all of them have to match.
	 */
	#[\Override]
	public function getSearchOperator(array $filterValues): ISearchBinaryOperator {
		$searchTerms = array_map(fn ($searchTerm) => is_string($searchTerm) ? trim($searchTerm) : '', $filterValues);
		$searchTerms = array_values(array_filter($searchTerms, fn (string $searchTerm) => $searchTerm !== ''));

		// Only indexed metadata can be searched, the key is indexed once the first description is stored.
		$matchCaptions = $this->metadataManager->getKnownMetadata()->isIndex(CaptionMetadataProvider::METADATA_KEY);

		return new SearchBinaryOperator(
			ISearchBinaryOperator::OPERATOR_AND,
			array_map(
				fn (string $searchTerm) => $this->getTermOperator('%' . SearchComparison::escapeLikeParameter($searchTerm) . '%', $matchCaptions),
				$searchTerms
			),
		);
	}

	private function getTermOperator(string $pattern, bool $matchCaptions): SearchBinaryOperator|SearchComparison {
		$nameComparison = new SearchComparison(ISearchComparison::COMPARE_LIKE, 'name', $pattern);
		if (!$matchCaptions) {
			return $nameComparison;
		}

		return new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_OR, [
			$nameComparison,
			new SearchComparison(ISearchComparison::COMPARE_LIKE, CaptionMetadataProvider::METADATA_KEY, $pattern, IMetadataQuery::EXTRA),
		]);
	}
}
