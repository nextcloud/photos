<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Search;

use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\AppInfo\Application;
use OCP\App\IAppManager;
use OCP\IGroupManager;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\IUser;
use OCP\Search\IProvider;
use OCP\Search\ISearchQuery;
use OCP\Search\SearchResult;
use OCP\Search\SearchResultEntry;

/**
 * Finds the albums of a user and the albums shared with them by name.
 */
final class AlbumSearchProvider implements IProvider {
	public function __construct(
		private readonly AlbumMapper $albumMapper,
		private readonly IGroupManager $groupManager,
		private readonly IAppManager $appManager,
		private readonly IURLGenerator $urlGenerator,
		private readonly IL10N $l10n,
	) {
	}

	#[\Override]
	public function getId(): string {
		return 'photos_albums';
	}

	#[\Override]
	public function getName(): string {
		return $this->l10n->t('Albums');
	}

	#[\Override]
	public function getOrder(string $route, array $routeParameters): int {
		return str_starts_with($route, Application::APP_ID . '.') ? -1 : 20;
	}

	#[\Override]
	public function search(IUser $user, ISearchQuery $query): SearchResult {
		$term = trim($query->getTerm());
		if ($term === '' || !$this->appManager->isEnabledForUser(Application::APP_ID, $user)) {
			return SearchResult::complete($this->getName(), []);
		}

		$matches = static fn (AlbumInfo $album): bool => mb_stripos($album->getTitle(), $term) !== false;

		/** @var list<array{AlbumInfo, bool}> $albums pairs of album and whether it is shared with the user */
		$albums = [];
		foreach (array_filter($this->albumMapper->getForUser($user->getUID()), $matches) as $album) {
			$albums[] = [$album, false];
		}
		foreach (array_filter($this->getSharedAlbums($user), $matches) as $album) {
			$albums[] = [$album, true];
		}
		usort($albums, static fn (array $a, array $b): int => strnatcasecmp($a[0]->getTitle(), $b[0]->getTitle()));

		$offset = (int)$query->getCursor();
		return SearchResult::paginated(
			$this->getName(),
			array_map(
				fn (array $album): SearchResultEntry => $this->toEntry(...$album),
				array_slice($albums, $offset, $query->getLimit()),
			),
			$offset + $query->getLimit(),
		);
	}

	/**
	 * Albums shared with the user directly or through one of their groups.
	 *
	 * @return array<int, AlbumInfo> indexed by album id
	 */
	private function getSharedAlbums(IUser $user): array {
		$albums = [];
		foreach ($this->albumMapper->getSharedAlbumsForCollaborator($user->getUID(), AlbumMapper::TYPE_USER) as $album) {
			$albums[$album->getId()] = $album;
		}
		foreach ($this->groupManager->getUserGroupIds($user) as $groupId) {
			foreach ($this->albumMapper->getSharedAlbumsForCollaborator($groupId, AlbumMapper::TYPE_GROUP) as $album) {
				$albums[$album->getId()] ??= $album;
			}
		}
		return $albums;
	}

	private function toEntry(AlbumInfo $album, bool $shared): SearchResultEntry {
		$cover = $album->getLastAddedPhoto();
		$thumbnailUrl = $cover === -1
			? ''
			: $this->urlGenerator->linkToRouteAbsolute('photos.preview.index', ['fileId' => $cover, 'x' => 64, 'y' => 64]);

		$entry = new SearchResultEntry(
			$thumbnailUrl,
			$album->getTitle(),
			$shared ? $this->l10n->t('Shared album') : $album->getLocation(),
			$this->urlGenerator->linkToRouteAbsolute(
				$shared ? 'photos.page.indexsharedalbums' : 'photos.page.indexalbums',
				['path' => $album->getTitle()],
			),
			$this->urlGenerator->imagePath('core', 'places/picture.svg'),
		);
		$entry->addAttribute('albumId', (string)$album->getId());
		return $entry;
	}
}
