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

use OC\Security\Bruteforce\Throttler;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Sabre\Album\PublicAlbumRoot;
use OCA\Photos\Service\UserConfigService;
use OCP\IRequest;
use OCP\Files\IRootFolder;
use Sabre\DAVACL\AbstractPrincipalCollection;
use Sabre\DAVACL\PrincipalBackend;
use Sabre\DAV\Exception\NotFound;

class PublicRootCollection extends AbstractPrincipalCollection {
	private const BRUTEFORCE_ACTION = 'publicphotos_webdav_auth';
	private AlbumMapper $albumMapper;
	private IRootFolder $rootFolder;
	private UserConfigService $userConfigService;
	private IRequest $request;
	private Throttler $throttler;

	public function __construct(
		AlbumMapper $albumMapper,
		IRootFolder $rootFolder,
		PrincipalBackend\BackendInterface $principalBackend,
		UserConfigService $userConfigService,
		IRequest $request,
		Throttler $throttler
	) {
		parent::__construct($principalBackend, 'principals/token');

		$this->albumMapper = $albumMapper;
		$this->rootFolder = $rootFolder;
		$this->userConfigService = $userConfigService;
		$this->request = $request;
		$this->throttler = $throttler;
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
		throw new \Sabre\DAV\Exception\Forbidden();
	}

	/**
	 * Returns a child object, by its token.
	 *
	 * @param string $token
	 *
	 * @throws NotFound
	 *
	 * @return DAV\INode
	 */
	public function getChild($token) {
		$this->throttler->sleepDelayOrThrowOnMax($this->request->getRemoteAddress(), self::BRUTEFORCE_ACTION);

		if (is_null($token)) {
			throw new \Sabre\DAV\Exception\Forbidden();
		}

		$albums = $this->albumMapper->getSharedAlbumsForCollaboratorWithFiles($token, AlbumMapper::TYPE_LINK);

		if (count($albums) !== 1) {
			$this->throttler->registerAttempt(self::BRUTEFORCE_ACTION, $this->request->getRemoteAddress());
			throw new NotFound("Unable to find public album");
		}

		return new PublicAlbumRoot($this->albumMapper, $albums[0], $this->rootFolder, $albums[0]->getAlbum()->getUserId(), $this->userConfigService);
	}
}
