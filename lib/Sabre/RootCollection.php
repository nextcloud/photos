<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022 Robin Appelman <robin@icewind.nl>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\Photos\Sabre;

use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\IRootFolder;
use OCP\IUserSession;
use Sabre\DAVACL\AbstractPrincipalCollection;
use Sabre\DAVACL\PrincipalBackend;
use OCP\IUserManager;
use OCP\IGroupManager;

class RootCollection extends AbstractPrincipalCollection {
	private AlbumMapper $folderMapper;
	private IUserSession $userSession;
	private IRootFolder $rootFolder;
	private IUserManager $userManager;
	private IGroupManager $groupManager;
	private UserConfigService $userConfigService;

	public function __construct(
		AlbumMapper $folderMapper,
		IUserSession $userSession,
		IRootFolder $rootFolder,
		PrincipalBackend\BackendInterface $principalBackend,
		IUserManager $userManager,
		IGroupManager $groupManager,
		UserConfigService $userConfigService
	) {
		parent::__construct($principalBackend, 'principals/users');

		$this->folderMapper = $folderMapper;
		$this->userSession = $userSession;
		$this->rootFolder = $rootFolder;
		$this->userManager = $userManager;
		$this->groupManager = $groupManager;
		$this->userConfigService = $userConfigService;
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
			throw new \Sabre\DAV\Exception\Forbidden();
		}
		return new PhotosHome($principalInfo, $this->folderMapper, $name, $this->rootFolder, $this->userManager, $this->groupManager, $this->userConfigService);
	}

	public function getName(): string {
		return 'photos';
	}
}
