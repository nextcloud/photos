<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Sabre\Album\PublicAlbumRoot;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\IRootFolder;
use OCP\IRequest;
use OCP\IUserManager;
use OCP\Security\Bruteforce\IThrottler;
use Psr\Log\LoggerInterface;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAVACL\AbstractPrincipalCollection;
use Sabre\DAVACL\PrincipalBackend\BackendInterface;

class PublicRootCollection extends AbstractPrincipalCollection {
	private const BRUTEFORCE_ACTION = 'publicphotos_webdav_auth';

	public function __construct(
		private readonly AlbumMapper $albumMapper,
		private readonly IRootFolder $rootFolder,
		BackendInterface $principalBackend,
		private readonly UserConfigService $userConfigService,
		private readonly IRequest $request,
		private readonly IThrottler $throttler,
		private readonly LoggerInterface $logger,
		protected readonly IUserManager $userManager,
	) {
		parent::__construct($principalBackend, 'principals/token');
	}

	public function getName(): string {
		return 'photospublic';
	}

	/**
	 * Child are retrieved directly by getChild.
	 * This should never be called.
	 * @param array $principalInfo
	 */
	public function getChildForPrincipal(array $principalInfo): PublicAlbumRoot {
		throw new Forbidden();
	}

	/**
	 * Returns a child object, by its token.
	 *
	 * @param string $name
	 *
	 * @throws NotFound
	 *
	 * @return \Sabre\DAV\INode
	 */
	public function getChild($name) {
		$this->throttler->sleepDelayOrThrowOnMax($this->request->getRemoteAddress(), self::BRUTEFORCE_ACTION);

		if (is_null($name)) {
			throw new Forbidden();
		}

		$albums = $this->albumMapper->getSharedAlbumsForCollaboratorWithFiles($name, AlbumMapper::TYPE_LINK);

		if (count($albums) !== 1) {
			$this->throttler->registerAttempt(self::BRUTEFORCE_ACTION, $this->request->getRemoteAddress());
			throw new NotFound('Unable to find public album');
		}

		return new PublicAlbumRoot(
			$this->albumMapper,
			$albums[0],
			$this->rootFolder,
			$albums[0]->getAlbum()->getUserId(),
			$this->userConfigService,
			$this->logger,
			$this->userManager,
		);
	}
}
