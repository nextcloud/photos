<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Album;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Album\AlbumWithFiles;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\IRootFolder;
use OCP\IGroupManager;
use OCP\IUserManager;
use Psr\Log\LoggerInterface;
use Sabre\DAV\Exception\Forbidden;

class SharedAlbumsHome extends AlbumsHome {
	public const NAME = 'sharedalbums';

	public function __construct(
		array $principalInfo,
		AlbumMapper $albumMapper,
		string $userId,
		IRootFolder $rootFolder,
		IUserManager $userManager,
		private readonly IGroupManager $groupManager,
		UserConfigService $userConfigService,
		LoggerInterface $logger,
	) {
		parent::__construct(
			$principalInfo,
			$albumMapper,
			$userId,
			$rootFolder,
			$userConfigService,
			$logger,
			$userManager,
		);
	}

	/**
	 * @return never
	 */
	public function createDirectory($name): never {
		throw new Forbidden('Not allowed to create folders in shared albums home');
	}

	/**
	 * @return AlbumRootBase[]
	 */
	public function getChildren(): array {
		if ($this->children === null) {
			$albums = $this->albumMapper->getSharedAlbumsForCollaboratorWithFiles($this->userId, AlbumMapper::TYPE_USER);

			$user = $this->userManager->get($this->userId);
			$userGroups = $this->groupManager->getUserGroupIds($user);
			foreach ($userGroups as $groupId) {
				$albumsForGroup = $this->albumMapper->getSharedAlbumsForCollaboratorWithFiles($groupId, AlbumMapper::TYPE_GROUP);
				$albumsForGroup = array_udiff($albumsForGroup, $albums, fn ($a, $b): int => $a->getAlbum()->getId() - $b->getAlbum()->getId());
				$albums = array_merge($albums, $albumsForGroup);
			}

			$this->children = array_map(fn (AlbumWithFiles $album): SharedAlbumRoot => new SharedAlbumRoot(
				$this->albumMapper,
				$album,
				$this->rootFolder,
				$this->userId,
				$this->userConfigService,
				$this->logger,
				$this->userManager,
			), $albums);
		}

		return $this->children;
	}
}
