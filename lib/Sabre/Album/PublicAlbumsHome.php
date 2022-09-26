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

namespace OCA\Photos\Sabre\Album;

use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\Server;
use OCP\Files\IRootFolder;
use OCP\IUser;
use OCA\Photos\Service\UserConfigService;
use OCA\Photos\Album\AlbumMapper;

class PublicAlbumsHome extends AlbumsHome {
	private Server $server;

	public function __construct(
		array $principalInfo,
		AlbumMapper $albumMapper,
		IUser $user,
		IRootFolder $rootFolder,
		UserConfigService $userConfigService,
		Server $server
	) {
		parent::__construct(
			$principalInfo,
			$albumMapper,
			$user,
			$rootFolder,
			$userConfigService,
		);

		$this->server = $server;
	}

	public function getName(): string {
		return 'public';
	}

	/**
	 * @return never
	 */
	public function createDirectory($name) {
		throw new Forbidden('Not allowed to create folders in this folder');
	}

	public function getChild($name) {
		$basicAuth = $this->server->httpRequest->getHeader('Authorization') ?? 'Basic ';
		[, $base64Token] = explode('Basic ', $basicAuth);
		$token = \base64_decode($base64Token);
		$albums = $this->albumMapper->getSharedAlbumsForCollaboratorWithFiles($token, AlbumMapper::TYPE_LINK);

		$albums = array_filter($albums, fn ($album) => $album->getAlbum()->getUserId() === $this->user->getUid());

		if (count($albums) !== 1) {
			throw new NotFound();
		}

		return new PublicAlbumRoot($this->albumMapper, $albums[0], $this->rootFolder, $this->userFolder, $this->user, $this->userConfigService);
	}
}
