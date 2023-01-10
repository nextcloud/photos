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

use OCP\Files\Node;
use OCP\Files\IFileDownloadProvider;
use OCA\Photos\Service\FileAccessManager;

class PublicAlbumsFileDownloadProvider implements IFileDownloadProvider {
	private FileAccessManager $fileAccessManager;

	public function __construct(
		FileAccessManager $fileAccessManager
	) {
		$this->fileAccessManager = $fileAccessManager;
	}

	public function getNode(string $davPath): ?Node {
		if (!str_starts_with($davPath, '/photospublic/')) {
			return null;
		}

		// $davPath ~= /photospublic/$token/albums/$albumName/$fileId-$fileName"
		$trimmedPath = \str_replace('/photospublic/', '', $davPath);
		[$token, $mediaName] = \Sabre\Uri\split($trimmedPath);
		[$fileId,] = explode('-', $mediaName);

		if (is_null($token) || is_null($fileId)) {
			return null;
		}

		return $this->fileAccessManager->getAccessibleNodeForPublicAlbum((int)$fileId, $token);
	}
}
