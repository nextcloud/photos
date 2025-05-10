<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Album;

use OC\Files\Search\SearchBinaryOperator;
use OC\Files\Search\SearchComparison;
use OC\Files\Search\SearchQuery;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCP\Files\IRootFolder;
use OCP\Files\Search\ISearchComparison;
use OCP\FilesMetadata\IMetadataQuery;

class SmartAlbumMapper {
	public function __construct(
		private IRootFolder $rootFolder,
	) {

	}

	/**
	 * @return AlbumFile[]
	 */
	public function getAlbumFiles(string $userId, array $filters): array {
		if (empty($filters)) {
			return [];
		}

		$filtersOperations = [];

		foreach ($filters as $filterId => $filterValue) {
			switch ($filterId) {
				case 'date-range':
					$filtersOperations[] = new SearchBinaryOperator(
						SearchBinaryOperator::OPERATOR_AND,
						[
							new SearchComparison(
								ISearchComparison::COMPARE_GREATER_THAN,
								OriginalDateTimeMetadataProvider::METADATA_KEY,
								$filterValue['start'] / 1000,
								IMetadataQuery::EXTRA,
							),
							new SearchComparison(
								ISearchComparison::COMPARE_LESS_THAN,
								OriginalDateTimeMetadataProvider::METADATA_KEY,
								$filterValue['end'] / 1000 + 24 * 60 * 60,
								IMetadataQuery::EXTRA,
							),
						]
					);
					break;
				case 'place':
					$filtersOperations[] = new SearchBinaryOperator(
						SearchBinaryOperator::OPERATOR_AND,
						array_map(
							function($place) {
								return new SearchComparison(
									ISearchComparison::COMPARE_EQUAL,
									PlaceMetadataProvider::METADATA_KEY,
									$place,
									IMetadataQuery::EXTRA,
								);
							},
							$filterValue
						),
					);
					break;
			}
		}

		$query = new SearchQuery(new SearchBinaryOperator(SearchBinaryOperator::OPERATOR_AND, $filtersOperations), 1000, 0, [],);
		$files = $this->rootFolder->getUserFolder($userId)->search($query);

		return array_map(
			function($file) use ($userId) {
				return new AlbumFile(
					$file->getId(),
					$file->getName(),
					$file->getMimetype(),
					$file->getSize(),
					$file->getMTime(),
					$file->getEtag(),
					0,
					$userId,
				);
				},
			$files
		);
	}
}
