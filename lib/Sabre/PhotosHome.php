<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\DB\Place\PlaceMapper;
use OCA\Photos\Sabre\Album\AlbumsHome;
use OCA\Photos\Sabre\Album\SharedAlbumsHome;
use OCA\Photos\Sabre\Place\PlacesHome;
use OCA\Photos\Service\ReverseGeoCoderService;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\IRootFolder;
use OCP\IGroupManager;
use OCP\IUserManager;
use Psr\Log\LoggerInterface;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\ICollection;

class PhotosHome implements ICollection {
	public function __construct(
		private array $principalInfo,
		private readonly AlbumMapper $albumMapper,
		private readonly PlaceMapper $placeMapper,
		private readonly ReverseGeoCoderService $reverseGeoCoderService,
		private readonly string $userId,
		private readonly IRootFolder $rootFolder,
		private readonly IUserManager $userManager,
		private readonly IGroupManager $groupManager,
		private readonly UserConfigService $userConfigService,
		private readonly LoggerInterface $logger,
	) {
	}

	/**
	 * @return never
	 */
	public function delete(): never {
		throw new Forbidden();
	}

	public function getName(): string {
		[, $name] = \Sabre\Uri\split($this->principalInfo['uri']);

		return $name;
	}

	/**
	 * @return never
	 */
	public function setName($name): never {
		throw new Forbidden('Permission denied to rename this folder');
	}

	public function createFile($name, $data = null): never {
		throw new Forbidden('Not allowed to create files in this folder');
	}

	/**
	 * @return never
	 */
	public function createDirectory($name): never {
		throw new Forbidden('Permission denied to create folders in this folder');
	}

	public function getChild($name) {
		return match ($name) {
			AlbumsHome::NAME => new AlbumsHome($this->principalInfo, $this->albumMapper, $this->userId, $this->rootFolder, $this->userConfigService, $this->logger, $this->userManager),
			SharedAlbumsHome::NAME => new SharedAlbumsHome($this->principalInfo, $this->albumMapper, $this->userId, $this->rootFolder, $this->userManager, $this->groupManager, $this->userConfigService, $this->logger),
			PlacesHome::NAME => new PlacesHome($this->userId, $this->rootFolder, $this->reverseGeoCoderService, $this->placeMapper),
			default => throw new NotFound(),
		};
	}

	/**
	 * @return (AlbumsHome|SharedAlbumsHome|PlacesHome)[]
	 */
	public function getChildren(): array {
		return [
			new AlbumsHome($this->principalInfo, $this->albumMapper, $this->userId, $this->rootFolder, $this->userConfigService, $this->logger, $this->userManager),
			new SharedAlbumsHome($this->principalInfo, $this->albumMapper, $this->userId, $this->rootFolder, $this->userManager, $this->groupManager, $this->userConfigService, $this->logger),
			new PlacesHome($this->userId, $this->rootFolder, $this->reverseGeoCoderService, $this->placeMapper),
		];
	}

	public function childExists($name): bool {
		return $name === AlbumsHome::NAME || $name === SharedAlbumsHome::NAME || $name === PlacesHome::NAME;
	}

	public function getLastModified(): int {
		return 0;
	}
}
