<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre\Album;

use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Album\AlbumWithFiles;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\IRootFolder;
use OCP\IUserManager;
use Psr\Log\LoggerInterface;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\ICollection;

class AlbumsHome implements ICollection {
	public const NAME = 'albums';

	/**
	 * @var AlbumRootBase[]|null
	 */
	protected ?array $children = null;

	public function __construct(
		protected array $principalInfo,
		protected AlbumMapper $albumMapper,
		protected string $userId,
		protected IRootFolder $rootFolder,
		protected UserConfigService $userConfigService,
		protected LoggerInterface $logger,
		protected IUserManager $userManager,
	) {
	}

	/**
	 * @return never
	 */
	public function delete(): never {
		throw new Forbidden();
	}

	public function getName(): string {
		return self::NAME;
	}

	/**
	 * @return never
	 */
	public function setName($name): never {
		throw new Forbidden('Permission denied to rename albums home');
	}

	public function createFile($name, $data = null): never {
		throw new Forbidden('Not allowed to create files in albums');
	}

	/**
	 * @return void
	 */
	public function createDirectory($name) {
		$this->albumMapper->create($this->userId, $name);
	}

	public function getChild($name) {
		foreach ($this->getChildren() as $child) {
			if ($child->getName() === $name) {
				return $child;
			}
		}

		throw new NotFound();
	}

	/**
	 * @return AlbumRootBase[]
	 */
	public function getChildren(): array {
		if ($this->children === null) {
			$albumInfos = $this->albumMapper->getForUser($this->userId);
			$this->children = array_map(fn (AlbumInfo $albumInfo): AlbumRoot => new AlbumRoot(
				$this->albumMapper,
				new AlbumWithFiles($albumInfo, $this->albumMapper),
				$this->rootFolder,
				$this->userId,
				$this->userConfigService,
				$this->logger,
				$this->userManager,
			), $albumInfos);
		}

		return $this->children;
	}

	public function childExists($name): bool {
		try {
			$this->getChild($name);
			return true;
		} catch (NotFound) {
			return false;
		}
	}

	public function getLastModified(): int {
		return 0;
	}
}
