<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Search;

use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Search\AlbumSearchProvider;
use OCP\App\IAppManager;
use OCP\IGroupManager;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\IUser;
use OCP\Search\ISearchQuery;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class AlbumSearchProviderTest extends TestCase {
	private AlbumMapper&MockObject $albumMapper;
	private IGroupManager&MockObject $groupManager;
	private IAppManager&MockObject $appManager;
	private IURLGenerator&MockObject $urlGenerator;
	private IUser&MockObject $user;
	private AlbumSearchProvider $provider;

	protected function setUp(): void {
		parent::setUp();

		$this->albumMapper = $this->createMock(AlbumMapper::class);
		$this->groupManager = $this->createMock(IGroupManager::class);
		$this->appManager = $this->createMock(IAppManager::class);
		$this->urlGenerator = $this->createMock(IURLGenerator::class);
		$l10n = $this->createMock(IL10N::class);
		$l10n->method('t')->willReturnArgument(0);

		$this->urlGenerator->method('linkToRouteAbsolute')
			->willReturnCallback(fn (string $route, array $params): string => $route . '?' . http_build_query($params));
		$this->urlGenerator->method('imagePath')->willReturn('/icon.svg');

		$this->user = $this->createMock(IUser::class);
		$this->user->method('getUID')->willReturn('alice');
		$this->appManager->method('isEnabledForUser')->willReturn(true);

		$this->provider = new AlbumSearchProvider(
			$this->albumMapper,
			$this->groupManager,
			$this->appManager,
			$this->urlGenerator,
			$l10n,
		);
	}

	private function album(int $id, string $owner, string $title, int $lastAdded = -1, string $location = ''): AlbumInfo {
		return new AlbumInfo($id, $owner, $title, $location, 0, $lastAdded);
	}

	private function query(string $term, int $limit = 5, int|string|null $cursor = null): ISearchQuery&MockObject {
		$query = $this->createMock(ISearchQuery::class);
		$query->method('getTerm')->willReturn($term);
		$query->method('getLimit')->willReturn($limit);
		$query->method('getCursor')->willReturn($cursor);
		return $query;
	}

	private function search(ISearchQuery $query): array {
		return $this->provider->search($this->user, $query)->jsonSerialize();
	}

	public function testFindsOwnAndSharedAlbumsCaseInsensitively(): void {
		$this->albumMapper->method('getForUser')->with('alice')->willReturn([
			$this->album(1, 'alice', 'Summer in Rome', 42, 'Rome'),
			$this->album(2, 'alice', 'Winter'),
		]);
		$this->albumMapper->method('getSharedAlbumsForCollaborator')->willReturnMap([
			['alice', AlbumMapper::TYPE_USER, [$this->album(3, 'bob', 'summer camp (bob)')]],
			['family', AlbumMapper::TYPE_GROUP, [$this->album(4, 'carol', 'Beach (carol)')]],
		]);
		$this->groupManager->method('getUserGroupIds')->with($this->user)->willReturn(['family']);

		$result = $this->search($this->query('SUMMER'));

		$this->assertTrue($result['isPaginated']);
		$this->assertSame(5, $result['cursor']);
		$entries = array_map(fn ($entry) => $entry->jsonSerialize(), $result['entries']);
		$this->assertSame(['summer camp (bob)', 'Summer in Rome'], array_column($entries, 'title'));

		$this->assertSame('photos.page.indexsharedalbums?path=summer+camp+%28bob%29', $entries[0]['resourceUrl']);
		$this->assertSame('', $entries[0]['thumbnailUrl']);
		$this->assertSame('Shared album', $entries[0]['subline']);
		$this->assertSame('/icon.svg', $entries[0]['icon']);

		$this->assertSame('photos.page.indexalbums?path=Summer+in+Rome', $entries[1]['resourceUrl']);
		$this->assertSame('photos.preview.index?fileId=42&x=64&y=64', $entries[1]['thumbnailUrl']);
		$this->assertSame('Rome', $entries[1]['subline']);
		$this->assertSame(['albumId' => '1'], $entries[1]['attributes']);
	}

	public function testAlbumSharedThroughUserAndGroupIsListedOnce(): void {
		$this->albumMapper->method('getForUser')->willReturn([]);
		$this->albumMapper->method('getSharedAlbumsForCollaborator')->willReturnMap([
			['alice', AlbumMapper::TYPE_USER, [$this->album(3, 'bob', 'Trip (bob)')]],
			['family', AlbumMapper::TYPE_GROUP, [$this->album(3, 'bob', 'Trip (bob)')]],
			['friends', AlbumMapper::TYPE_GROUP, [$this->album(3, 'bob', 'Trip (bob)')]],
		]);
		$this->groupManager->method('getUserGroupIds')->willReturn(['family', 'friends']);

		$result = $this->search($this->query('trip'));

		$this->assertCount(1, $result['entries']);
	}

	public function testPaginatesWithCursor(): void {
		$this->albumMapper->method('getForUser')->willReturn([
			$this->album(1, 'alice', 'Album 3'),
			$this->album(2, 'alice', 'Album 1'),
			$this->album(3, 'alice', 'Album 2'),
			$this->album(4, 'alice', 'Album 10'),
		]);
		$this->albumMapper->method('getSharedAlbumsForCollaborator')->willReturn([]);
		$this->groupManager->method('getUserGroupIds')->willReturn([]);

		$first = $this->search($this->query('album', 2));
		$second = $this->search($this->query('album', 2, $first['cursor']));

		$titles = fn (array $result): array => array_map(fn ($entry) => $entry->jsonSerialize()['title'], $result['entries']);
		$this->assertSame(['Album 1', 'Album 2'], $titles($first));
		$this->assertSame(['Album 3', 'Album 10'], $titles($second));
		$this->assertSame(4, $second['cursor']);
	}

	public function testEmptyTermReturnsNothing(): void {
		$this->albumMapper->expects($this->never())->method('getForUser');

		$result = $this->search($this->query('  '));

		$this->assertSame([], $result['entries']);
	}

	public function testReturnsNothingWhenAppIsDisabledForUser(): void {
		$appManager = $this->createMock(IAppManager::class);
		$appManager->method('isEnabledForUser')->with('photos', $this->user)->willReturn(false);
		$l10n = $this->createMock(IL10N::class);
		$l10n->method('t')->willReturnArgument(0);
		$provider = new AlbumSearchProvider($this->albumMapper, $this->groupManager, $appManager, $this->urlGenerator, $l10n);
		$this->albumMapper->expects($this->never())->method('getForUser');
		$this->albumMapper->expects($this->never())->method('getSharedAlbumsForCollaborator');

		$result = $provider->search($this->user, $this->query('summer'))->jsonSerialize();

		$this->assertSame([], $result['entries']);
	}

	public function testOrderPrefersPhotosApp(): void {
		$this->assertSame(-1, $this->provider->getOrder('photos.page.index', []));
		$this->assertSame(20, $this->provider->getOrder('files.view.index', []));
	}
}
