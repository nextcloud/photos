<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\DB\Place\PlaceMapper;
use OCA\Photos\Service\ReverseGeoCoderService;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\IRootFolder;
use OCP\IGroupManager;
use OCP\IUserManager;
use OCP\IUserSession;
use Psr\Log\LoggerInterface;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAVACL\AbstractPrincipalCollection;
use Sabre\DAVACL\PrincipalBackend\BackendInterface;

class RootCollection extends AbstractPrincipalCollection {
	public function __construct(
		private readonly AlbumMapper $albumMapper,
		private readonly PlaceMapper $placeMapper,
		private readonly ReverseGeoCoderService $reverseGeoCoderService,
		private readonly IUserSession $userSession,
		private readonly IRootFolder $rootFolder,
		BackendInterface $principalBackend,
		private readonly IUserManager $userManager,
		private readonly IGroupManager $groupManager,
		private readonly UserConfigService $userConfigService,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct($principalBackend, 'principals/users');
	}

	/**
	 * This method returns a node for a principal.
	 *
	 * The passed array contains principal information, and is guaranteed to
	 * at least contain a uri item. Other properties may or may not be
	 * supplied by the authentication backend.
	 *
	 * @param array $principalInfo
	 */
	public function getChildForPrincipal(array $principalInfo): PhotosHome {
		[, $name] = \Sabre\Uri\split($principalInfo['uri']);
		$user = $this->userSession->getUser();
		if (is_null($user) || $name !== $user->getUID()) {
			throw new Forbidden();
		}
		return new PhotosHome($principalInfo, $this->albumMapper, $this->placeMapper, $this->reverseGeoCoderService, $name, $this->rootFolder, $this->userManager, $this->groupManager, $this->userConfigService, $this->logger);
	}

	public function getName(): string {
		return 'photos';
	}
}
