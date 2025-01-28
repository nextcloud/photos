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
use Psr\Log\LoggerInterface;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\ICollection;

class AlbumsHome implements ICollection {
	public const NAME = 'albums';

	/**
	 * @var AlbumRoot[]
	 */
	protected ?array $children = null;

	public function __construct(
		protected array $principalInfo,
		protected AlbumMapper $albumMapper,
		protected string $userId,
		protected IRootFolder $rootFolder,
		protected UserConfigService $userConfigService,
		protected LoggerInterface $logger,
	) {
	}

	/**
	 * @return never
	 */
	public function delete() {
		throw new Forbidden();
	}

	public function getName(): string {
		return self::NAME;
	}

	/**
	 * @return never
	 */
	public function setName($name) {
		throw new Forbidden('Permission denied to rename this folder');
	}

	public function createFile($name, $data = null) {
		throw new Forbidden('Not allowed to create files in this folder');
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
	 * @return AlbumRoot[]
	 */
	public function getChildren(): array {
		if ($this->children === null) {
			$albumInfos = $this->albumMapper->getForUser($this->userId);
			$this->children = array_map(function (AlbumInfo $albumInfo) {
				return new AlbumRoot(
					$this->albumMapper,
					new AlbumWithFiles($albumInfo, $this->albumMapper),
					$this->rootFolder,
					$this->userId,
					$this->userConfigService,
					$this->logger,
				);
			}, $albumInfos);
		}

		return $this->children;
	}

	public function childExists($name): bool {
		try {
			$this->getChild($name);
			return true;
		} catch (NotFound $e) {
			return false;
		}
	}

	public function getLastModified(): int {
		return 0;
	}
}
