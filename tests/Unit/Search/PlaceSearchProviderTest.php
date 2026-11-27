<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Search;

use OCA\Photos\DB\Place\PlaceInfo;
use OCA\Photos\DB\Place\PlaceMapper;
use OCA\Photos\Search\PlaceSearchProvider;
use OCP\App\IAppManager;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\IUser;
use OCP\Search\ISearchQuery;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class PlaceSearchProviderTest extends TestCase {
	private PlaceMapper&MockObject $placeMapper;
	private IAppManager&MockObject $appManager;
	private IUser&MockObject $user;
	private PlaceSearchProvider $provider;

	protected function setUp(): void {
		parent::setUp();

		$this->placeMapper = $this->createMock(PlaceMapper::class);
		$this->appManager = $this->createMock(IAppManager::class);
		$urlGenerator = $this->createMock(IURLGenerator::class);
		$urlGenerator->method('linkToRouteAbsolute')
			->willReturnCallback(fn (string $route, array $params): string => $route . '?' . http_build_query($params));
		$urlGenerator->method('imagePath')->willReturn('/address.svg');
		$l10n = $this->createMock(IL10N::class);
		$l10n->method('t')->willReturnArgument(0);

		$this->user = $this->createMock(IUser::class);
		$this->user->method('getUID')->willReturn('alice');

		$this->provider = new PlaceSearchProvider($this->placeMapper, $this->appManager, $urlGenerator, $l10n);
	}

	private function query(string $term, int $limit = 5, int|string|null $cursor = null): ISearchQuery&MockObject {
		$query = $this->createMock(ISearchQuery::class);
		$query->method('getTerm')->willReturn($term);
		$query->method('getLimit')->willReturn($limit);
		$query->method('getCursor')->willReturn($cursor);
		return $query;
	}

	private function titles(array $result): array {
		return array_map(fn ($entry) => $entry->jsonSerialize()['title'], $result['entries']);
	}

	public function testFindsMatchingPlacesOfTheUser(): void {
		$this->appManager->method('isEnabledForUser')->willReturn(true);
		$this->placeMapper->expects($this->once())->method('findPlacesForUser')->with('alice')->willReturn([
			new PlaceInfo('alice', 'Berlin'),
			new PlaceInfo('alice', 'Zürich'),
			new PlaceInfo('alice', 'Bern'),
		]);

		$result = $this->provider->search($this->user, $this->query('ber'))->jsonSerialize();

		$this->assertSame(['Berlin', 'Bern'], $this->titles($result));
		$entry = $result['entries'][0]->jsonSerialize();
		$this->assertSame('photos.page.indexplaces?path=Berlin', $entry['resourceUrl']);
		$this->assertSame('', $entry['thumbnailUrl']);
		$this->assertSame('/address.svg', $entry['icon']);
	}

	public function testMatchesMultibyteNamesCaseInsensitively(): void {
		$this->appManager->method('isEnabledForUser')->willReturn(true);
		$this->placeMapper->method('findPlacesForUser')->willReturn([
			new PlaceInfo('alice', 'Zürich'),
			new PlaceInfo('alice', 'Ürümqi'),
		]);

		$result = $this->provider->search($this->user, $this->query('ÜR'))->jsonSerialize();

		$this->assertEqualsCanonicalizing(['Ürümqi', 'Zürich'], $this->titles($result));
	}

	public function testPaginatesWithCursor(): void {
		$this->appManager->method('isEnabledForUser')->willReturn(true);
		$this->placeMapper->method('findPlacesForUser')->willReturn([
			new PlaceInfo('alice', 'Newport'),
			new PlaceInfo('alice', 'New York'),
			new PlaceInfo('alice', 'Newcastle'),
		]);

		$result = $this->provider->search($this->user, $this->query('new', 2, 2))->jsonSerialize();

		$this->assertSame(['New York'], $this->titles($result));
		$this->assertSame(4, $result['cursor']);
	}

	public function testReturnsNothingForEmptyTermOrDisabledApp(): void {
		$this->appManager->method('isEnabledForUser')->with('photos', $this->user)->willReturn(false);
		$this->placeMapper->expects($this->never())->method('findPlacesForUser');

		$this->assertSame([], $this->provider->search($this->user, $this->query(''))->jsonSerialize()['entries']);
		$this->assertSame([], $this->provider->search($this->user, $this->query('berlin'))->jsonSerialize()['entries']);
	}
}
