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
	 * Split the search terms into words and match each word, in any order,
	 * against the file name or the description of the photo: all words have to match.
	 */
	#[\Override]
	public function getSearchOperator(array $filterValues): ISearchBinaryOperator {
		$words = [];
		foreach ($filterValues as $searchTerm) {
			if (!is_string($searchTerm)) {
				continue;
			}

			foreach (preg_split('/\s+/u', $searchTerm, -1, PREG_SPLIT_NO_EMPTY) ?: [] as $word) {
				$words[mb_strtolower($word)] ??= $word;
			}
		}

		// Only indexed metadata can be searched, the key is indexed once the first description is stored.
		$matchCaptions = $this->metadataManager->getKnownMetadata()->isIndex(CaptionMetadataProvider::METADATA_KEY);

		return new SearchBinaryOperator(
			ISearchBinaryOperator::OPERATOR_AND,
			array_map(
				fn (string $word) => $this->getTermOperator('%' . SearchComparison::escapeLikeParameter($word) . '%', $matchCaptions),
				array_values($words)
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
