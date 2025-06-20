<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Filters;

use OC\Files\Search\SearchBinaryOperator;
use OC\Files\Search\SearchComparison;
use OC\Files\Search\SearchQuery;
use OCA\Photos\Album\AlbumFile;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\IMimeTypeLoader;
use OCP\Files\IRootFolder;
use OCP\Files\Search\ISearchBinaryOperator;
use OCP\Files\Search\ISearchComparison;

class FiltersManager {
	/**
	 * @var array<string, IFilter>
	 */
	private array $registeredFilters = [];

	public function __construct(
		private IRootFolder $rootFolder,
		private readonly IMimeTypeLoader $mimeTypeLoader,
		private readonly UserConfigService $userConfigService,
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
	public function getFilesBasedOnFilters(string $userId, array $userFilters, ?int $fileId = null): array {
		foreach ($userFilters as $filterId => $filterValue) {
			if (is_array($filterValue) && count($filterValue) > 0) {
				$filtersOperations[] = $this->registeredFilters[$filterId]->getSearchOperator($filterValue);
			}
		}

		if (empty($filtersOperations)) {
			return [];
		}

		if ($fileId !== null) {
			$filtersOperations[] = new SearchComparison(
				ISearchComparison::COMPARE_EQUAL,
				'fileid',
				$fileId,
			);
		}

		$filtersOperations += $this->getPhotosDefaultSearchConditions();

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
					'filters',
				);
			},
			$files
		);
	}

	private function getPhotosDefaultSearchConditions(): array {
		$folders = json_decode($this->userConfigService->getUserConfig('photosSourceFolders'));

		return [
			new SearchBinaryOperator(
				ISearchBinaryOperator::OPERATOR_OR,
				array_map(fn ($folder) => new SearchComparison(
					ISearchComparison::COMPARE_LIKE_CASE_SENSITIVE,
					'path',
					'files' . $folder . '/%',
				), $folders)
			),

			new SearchBinaryOperator(
				ISearchBinaryOperator::OPERATOR_OR,
				array_map(fn ($mimetype) => new SearchComparison(
					ISearchComparison::COMPARE_EQUAL,
					'mimetype',
					$mimetype,
				), [...Application::IMAGE_MIMES, ...Application::VIDEO_MIMES])
			),
		];
	}
}
