<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Filters;

use OC\Files\Search\SearchBinaryOperator;
use OC\Files\Search\SearchComparison;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCP\Files\Search\ISearchBinaryOperator;
use OCP\Files\Search\ISearchComparison;
use OCP\FilesMetadata\IMetadataQuery;

class PlacesFilter implements IFilter {
	public const ID = 'places';

	public function getId(): string {
		return self::ID;
	}

	public function getSearchOperator(array $filterValues): ISearchBinaryOperator {
		$palces = array_map(fn ($place) => is_string($place) ? $place : null, $filterValues);
		$places = array_filter($palces, fn ($place) => $place !== null);

		return new SearchBinaryOperator(
			ISearchBinaryOperator::OPERATOR_OR,
			array_map(
				function ($place) {
					return new SearchComparison(
						ISearchComparison::COMPARE_EQUAL,
						PlaceMetadataProvider::METADATA_KEY,
						$place,
						IMetadataQuery::EXTRA,
					);
				},
				$places
			),
		);

	}
}
