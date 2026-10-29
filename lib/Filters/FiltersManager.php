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
use OCP\Files\Node;
use OCP\Files\Search\ISearchBinaryOperator;
use OCP\Files\Search\ISearchComparison;
use OCP\Files\Storage\ISharedStorage;

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
		$this->registerFilter(new NameFilter());
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
		$filtersOperations = [];

		foreach ($userFilters as $filterId => $filterValue) {
			// Ignore filters that are not known, they might come from another version of the app.
			if (is_array($filterValue) && count($filterValue) > 0 && isset($this->registeredFilters[$filterId])) {
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

		array_push($filtersOperations, ...$this->getPhotosDefaultSearchConditions($userId));

		$query = new SearchQuery(new SearchBinaryOperator(ISearchBinaryOperator::OPERATOR_AND, $filtersOperations), 1000, 0, []);

		$files = $this->rootFolder->getUserFolder($userId)->search($query);

		$files = array_values(array_filter($files, [$this, 'isDownloadAllowed']));

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

	/**
	 * A filter search spans the user's received-share mounts. A file reached
	 * through a share whose download permission is disabled must not be
	 * surfaced as an album entry: the album content and preview paths serve the
	 * file bytes without a per-share check, which would otherwise expose the
	 * file to the album owner and its collaborators in breach of the share.
	 */
	public function isDownloadAllowed(Node $file): bool {
		$storage = $file->getStorage();
		if (!$storage->instanceOfStorage(ISharedStorage::class)) {
			return true;
		}

		/** @var ISharedStorage $storage */
		return $storage->getShare()->canDownload();
	}

	private function getPhotosDefaultSearchConditions(string $userId): array {
		$folders = json_decode($this->userConfigService->getConfigForUser($userId, 'photosSourceFolders'));

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
