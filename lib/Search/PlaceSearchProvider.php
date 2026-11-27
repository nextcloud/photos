<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Search;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\Place\PlaceInfo;
use OCA\Photos\DB\Place\PlaceMapper;
use OCP\App\IAppManager;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\IUser;
use OCP\Search\IProvider;
use OCP\Search\ISearchQuery;
use OCP\Search\SearchResult;
use OCP\Search\SearchResultEntry;

/**
 * Finds the places of a user's photos by name.
 */
final class PlaceSearchProvider implements IProvider {
	public function __construct(
		private readonly PlaceMapper $placeMapper,
		private readonly IAppManager $appManager,
		private readonly IURLGenerator $urlGenerator,
		private readonly IL10N $l10n,
	) {
	}

	#[\Override]
	public function getId(): string {
		return 'photos_places';
	}

	#[\Override]
	public function getName(): string {
		return $this->l10n->t('Places');
	}

	#[\Override]
	public function getOrder(string $route, array $routeParameters): int {
		return str_starts_with($route, Application::APP_ID . '.') ? 0 : 21;
	}

	#[\Override]
	public function search(IUser $user, ISearchQuery $query): SearchResult {
		$term = trim($query->getTerm());
		if ($term === '' || !$this->appManager->isEnabledForUser(Application::APP_ID, $user)) {
			return SearchResult::complete($this->getName(), []);
		}

		$places = array_map(
			static fn (PlaceInfo $place): string => $place->getPlace(),
			$this->placeMapper->findPlacesForUser($user->getUID()),
		);
		$places = array_filter($places, static fn (string $place): bool => mb_stripos($place, $term) !== false);
		usort($places, strnatcasecmp(...));

		$offset = (int)$query->getCursor();
		return SearchResult::paginated(
			$this->getName(),
			array_map(
				fn (string $place): SearchResultEntry => new SearchResultEntry(
					'',
					$place,
					'',
					$this->urlGenerator->linkToRouteAbsolute('photos.page.indexplaces', ['path' => $place]),
					$this->urlGenerator->imagePath('core', 'actions/address.svg'),
				),
				array_slice($places, $offset, $query->getLimit()),
			),
			$offset + $query->getLimit(),
		);
	}
}
