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
use OCP\IUserManager;
use Psr\Log\LoggerInterface;
use Sabre\DAV\Exception\Conflict;
use Sabre\DAV\Exception\Forbidden;

class SharedAlbumRoot extends AlbumRoot {
	public function __construct(
		AlbumMapper $albumMapper,
		AlbumWithFiles $album,
		IRootFolder $rootFolder,
		string $userId,
		UserConfigService $userConfigService,
		LoggerInterface $logger,
		private IUserManager $userManager,
	) {
		parent::__construct(
			$albumMapper,
			$album,
			$rootFolder,
			$userId,
			$userConfigService,
			$logger,
		);
	}

	/**
	 * @return void
	 */
	public function delete() {
		$this->albumMapper->deleteUserFromAlbumCollaboratorsList($this->userId, $this->album->getAlbum()->getId());
	}

	/**
	 * @return void
	 */
	public function setName($name) {
		throw new Forbidden('Not allowed to rename a shared album');
	}

	protected function addFile(int $sourceId, string $ownerUID): bool {
		if (in_array($sourceId, $this->album->getFileIds())) {
			throw new Conflict("File $sourceId is already in the folder");
		}

		if (!$this->albumMapper->isCollaborator($this->album->getAlbum()->getId(), $this->userId)) {
			return false;
		}

		$this->albumMapper->addFile($this->album->getAlbum()->getId(), $sourceId, $ownerUID);
		return true;
	}

	/**
	 * Return only the owner, and do not reveal other collaborators.
	 */
	public function getCollaborators(): array {
		return [[
			'nc:collaborator' => [
				'id' => $this->album->getAlbum()->getUserId(),
				'label' => $this->userManager->get($this->album->getAlbum()->getUserId())->getDisplayName(),
				'type' => $this->album->getAlbum()->getReceivedFrom(),
			],
		]];
	}

	public function setCollaborators($collaborators): array {
		throw new Forbidden('Not allowed to collaborators to a public album');
	}
}
