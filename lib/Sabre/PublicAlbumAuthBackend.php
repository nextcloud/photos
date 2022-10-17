<?php
/**
 * @copyright Copyright (c) 2022 Louis Chmn <louis@chmn.me>
 *
 * @author Louis Chmn <louis@chmn.me>
 *
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program. If not, see <http://www.gnu.org/licenses/>
 *
 */
namespace OCA\Photos\Sabre;

use OC\Security\Bruteforce\Throttler;
use OCA\Photos\Album\AlbumMapper;
use OCP\IRequest;
use Sabre\DAV\Auth\Backend\AbstractBasic;

class PublicAlbumAuthBackend extends AbstractBasic {
	private const BRUTEFORCE_ACTION = 'publicphotos_webdav_auth';
	private IRequest $request;
	private AlbumMapper $albumMapper;
	private Throttler $throttler;

	public function __construct(
		IRequest $request,
		AlbumMapper $albumMapper,
		Throttler $throttler
	) {
		$this->request = $request;
		$this->albumMapper = $albumMapper;
		$this->throttler = $throttler;
	}

	/**
	 * Validates the token.
	 *
	 * @param string $username
	 * @return bool
	 * @throws \Sabre\DAV\Exception\NotAuthenticated
	 */
	protected function validateUserPass($username, $password) {
		$this->throttler->sleepDelayOrThrowOnMax($this->request->getRemoteAddress(), self::BRUTEFORCE_ACTION);

		$albums = $this->albumMapper->getSharedAlbumsForCollaboratorWithFiles($username, AlbumMapper::TYPE_LINK);

		if (count($albums) !== 1) {
			$this->throttler->registerAttempt(self::BRUTEFORCE_ACTION, $this->request->getRemoteAddress());
			return false;
		}

		\OC_User::setIncognitoMode(true);

		return true;
	}
}
