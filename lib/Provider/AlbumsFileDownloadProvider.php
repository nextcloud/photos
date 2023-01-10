<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2022 Louis Chmn <louis@chmn.me>
 *
 * @author Louis Chmn <louis@chmn.me>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\Photos\Provider;

use OCA\Photos\Sabre\Album\AlbumsHome;
use OCA\Photos\Sabre\Album\SharedAlbumsHome;
use OCP\IUser;
use OCP\Files\Node;
use OCP\Files\IFileDownloadProvider;
use OCA\Photos\Service\FileAccessManager;
use OCP\IUserSession;

class AlbumsFileDownloadProvider implements IFileDownloadProvider {
	private FileAccessManager $fileAccessManager;
	private ?IUser $user;

	public function __construct(
		FileAccessManager $fileAccessManager,
		?IUserSession $userSession
	) {
		$this->fileAccessManager = $fileAccessManager;
		$this->user = $userSession->getUser() ?? null;
	}

	public function getNode(string $davPath): ?Node {
		if ($this->user === null) {
			return null;
		}

		$userId = $this->user->getUID();

		if (!str_starts_with($davPath, "/photos/$userId/".AlbumsHome::NAME.'/')
		 && !str_starts_with($davPath, "/photos/$userId/".SharedAlbumsHome::NAME.'/')) {
			return null;
		}

		// $davPath ~= /photos/$userId/albums/$albumName/$fileId-$fileName"
		[, $mediaName] = \Sabre\Uri\split($davPath);
		[$fileId,] = explode('-', $mediaName);

		if (is_null($fileId)) {
			return null;
		}

		return $this->fileAccessManager->getAccessibleNodeForUser((int)$fileId, $this->user);
	}
}
