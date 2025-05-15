<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Filters;

use OC\Files\Search\SearchBinaryOperator;
use OC\Files\Search\SearchQuery;
use OCA\Photos\Album\AlbumFile;
use OCP\Files\IRootFolder;
use OCP\Files\Search\ISearchBinaryOperator;

class FiltersManager {
	/**
	 * @var array<string, IFilter>
	 */
	private array $registeredFilters = [];

	public function __construct(
		private IRootFolder $rootFolder,
	) {
		$this->registerFilter(new DateRangeFilter());
		$this->registerFilter(new PlacesFilter());
	}

	public function registerFilter(IFilter $filter): void {
		$this->registeredFilters[$filter->getId()] = $filter;
	}

	/**
	 * @param array<string, mixed> $userFilters
	 * @return AlbumFile[]
	 */
	public function getFilesBasedOnFilters(string $userId, array $userFilters): array {
		if (empty($userFilters)) {
			return [];
		}

		$filtersOperations = [];

		foreach ($userFilters as $filterId => $filterValue) {
			if (is_array($filterValue)) {
				$filtersOperations[] = $this->registeredFilters[$filterId]->getSearchOperator($filterValue);
			}
		}

		$query = new SearchQuery(new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_AND, $filtersOperations), 1000, 0, []);

		$files = $this->rootFolder->getUserFolder($userId)->search($query);

		return array_map(
			function ($file) use ($userId) {
				return new AlbumFile(
					$file->getId(),
					$file->getName(),
					$file->getMimetype(),
					(int)$file->getSize(),
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
