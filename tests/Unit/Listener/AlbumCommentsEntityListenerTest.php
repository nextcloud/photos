<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Listener;

use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Filters\FiltersManager;
use OCA\Photos\Listener\AlbumCommentsEntityListener;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\Comments\CommentsEntityEvent;
use OCP\Comments\ICommentsManager;
use OCP\Files\IMimeTypeLoader;
use OCP\IDBConnection;
use OCP\IGroup;
use OCP\IGroupManager;
use OCP\IL10N;
use OCP\IUser;
use OCP\IUserManager;
use OCP\IUserSession;
use OCP\Security\ISecureRandom;
use OCP\Server;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

/**
 * @group DB
 */
class AlbumCommentsEntityListenerTest extends TestCase {
	private AlbumMapper $albumMapper;
	private IUserSession&MockObject $userSession;
	private ICommentsManager&MockObject $commentsManager;
	private AlbumCommentsEntityListener $listener;
	private AlbumInfo $album;
	/** @var int[] */
	private array $createdAlbums = [];

	protected function setUp(): void {
		parent::setUp();

		$userManager = $this->createMock(IUserManager::class);
		$userManager->method('get')->willReturn($this->createMock(IUser::class));

		$groupManager = $this->createMock(IGroupManager::class);
		$groupManager->method('get')->willReturn($this->createMock(IGroup::class));
		$groupManager->method('isInGroup')->willReturnCallback(
			fn (string $userId, string $groupId): bool => $userId === 'group-member' && $groupId === 'family',
		);

		$random = $this->createMock(ISecureRandom::class);
		$random->method('generate')->willReturn('linktoken');

		$this->commentsManager = $this->createMock(ICommentsManager::class);

		$this->albumMapper = new AlbumMapper(
			Server::get(IDBConnection::class),
			Server::get(IMimeTypeLoader::class),
			$this->createMock(ITimeFactory::class),
			$userManager,
			$groupManager,
			$this->createMock(IL10N::class),
			$random,
			$this->createMock(FiltersManager::class),
			$this->commentsManager,
		);

		$this->userSession = $this->createMock(IUserSession::class);
		$this->listener = new AlbumCommentsEntityListener($this->albumMapper, $this->userSession);

		$this->album = $this->createAlbum('owner', [
			['id' => 'collaborator', 'type' => AlbumMapper::TYPE_USER],
			['id' => 'family', 'type' => AlbumMapper::TYPE_GROUP],
			['id' => '', 'type' => AlbumMapper::TYPE_LINK],
		]);
	}

	protected function tearDown(): void {
		foreach ($this->createdAlbums as $albumId) {
			$this->albumMapper->delete($albumId);
		}

		parent::tearDown();
	}

	/**
	 * @param list<array{'id': string, 'type': int}> $collaborators
	 */
	private function createAlbum(string $owner, array $collaborators): AlbumInfo {
		$album = $this->albumMapper->create($owner, 'album');
		$this->createdAlbums[] = $album->getId();
		$this->albumMapper->setCollaborators($album->getId(), $collaborators);
		return $album;
	}

	private function loginAs(?string $userId): void {
		if ($userId === null) {
			$this->userSession->method('getUser')->willReturn(null);
			return;
		}

		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn($userId);
		$this->userSession->method('getUser')->willReturn($user);
	}

	public static function accessProvider(): array {
		return [
			'owner' => ['owner', true],
			'user collaborator' => ['collaborator', true],
			'group collaborator' => ['group-member', true],
			'stranger' => ['stranger', false],
			'public link visitor' => [null, false],
		];
	}

	/**
	 * @dataProvider accessProvider
	 */
	public function testAccess(?string $userId, bool $expected): void {
		$this->loginAs($userId);

		$this->assertSame($expected, $this->listener->canAccessComments((string)$this->album->getId()));
	}

	public function testLinkOnlyAlbumIsNotAccessibleToOthers(): void {
		$linkOnlyAlbum = $this->createAlbum('owner', [
			['id' => '', 'type' => AlbumMapper::TYPE_LINK],
		]);

		$this->loginAs('linktoken');
		$this->assertFalse($this->listener->canAccessComments((string)$linkOnlyAlbum->getId()));
	}

	public function testUnknownOrInvalidAlbumId(): void {
		$this->loginAs('owner');

		$this->assertFalse($this->listener->canAccessComments((string)($this->album->getId() + 1000)));
		$this->assertFalse($this->listener->canAccessComments($this->album->getId() . ' OR 1=1'));
		$this->assertFalse($this->listener->canAccessComments(''));
	}

	public function testRegistersEntityCollection(): void {
		$this->loginAs('stranger');
		$event = new CommentsEntityEvent();

		$this->listener->handle($event);

		$collections = $event->getEntityCollections();
		$this->assertArrayHasKey(AlbumMapper::COMMENTS_OBJECT_TYPE, $collections);
		$this->assertFalse($collections[AlbumMapper::COMMENTS_OBJECT_TYPE]((string)$this->album->getId()));
	}

	public function testDeletingAlbumDeletesItsComments(): void {
		$album = $this->albumMapper->create('owner', 'to delete');

		$deleted = [];
		$this->commentsManager->method('deleteCommentsAtObject')
			->willReturnCallback(function (string $objectType, string $objectId) use (&$deleted): bool {
				$deleted[] = [$objectType, $objectId];
				return true;
			});

		$this->albumMapper->delete($album->getId());

		$this->assertSame([[AlbumMapper::COMMENTS_OBJECT_TYPE, (string)$album->getId()]], $deleted);
	}
}
