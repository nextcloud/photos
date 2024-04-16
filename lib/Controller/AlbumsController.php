<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2019, Roeland Jago Douma <roeland@famdouma.nl>
 *
 * @author Roeland Jago Douma <roeland@famdouma.nl>
 *
 * @license AGPL-3.0-or-later
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

namespace OCA\Photos\Controller;

use OCA\Files_Sharing\SharedStorage;
use OCA\Photos\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\Constants;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\Files\StorageNotAvailableException;
use OCP\IPreview;
use OCP\IRequest;

class AlbumsController extends Controller {
	private string $userId;
	private IRootFolder $rootFolder;
	private IPreview $previewManager;

	public function __construct(
		string $userId,
		IRequest $request,
		IRootFolder $rootFolder,
		IPreview $previewManager
	) {
		parent::__construct(Application::APP_ID, $request);

		$this->userId = $userId;
		$this->rootFolder = $rootFolder;
		$this->previewManager = $previewManager;
	}

	/**
	 * @NoAdminRequired
	 */
	public function myAlbums(string $path = ''): JSONResponse {
		return $this->generate($path, false);
	}

	/**
	 * @NoAdminRequired
	 */
	public function sharedAlbums(string $path = ''): JSONResponse {
		return $this->generate($path, true);
	}

	private function generate(string $path, bool $shared): JSONResponse {
		$userFolder = $this->rootFolder->getUserFolder($this->userId);

		$folder = $userFolder;
		if ($path !== '') {
			try {
				$folder = $userFolder->get($path);
			} catch (NotFoundException $e) {
				return new JSONResponse([], Http::STATUS_NOT_FOUND);
			}
		}

		$data = $this->scanCurrentFolder($folder, $shared);
		$result = $this->formatData($data);

		return new JSONResponse($result, Http::STATUS_OK);
	}

	private function formatData(iterable $nodes): array {
		$userFolder = $this->rootFolder->getUserFolder($this->userId);

		$result = [];
		/** @var Node $node */
		foreach ($nodes as $node) {
			// properly format full path and make sure
			// we're relative to the user home folder
			$isRoot = $node === $userFolder;
			$path = $userFolder->getRelativePath($node->getPath());

			$result[] = [
				'basename' => $isRoot ? '' : $node->getName(),
				'etag' => $node->getEtag(),
				'fileid' => $node->getId(),
				'filename' => $path,
				'lastmod' => $node->getMTime(),
				'mime' => $node->getMimetype(),
				'size' => $node->getSize(),
				'type' => $node->getType(),
				'permissions' => $this->formatPermissions($node->getPermissions()),
				'hasPreview' => $this->previewManager->isAvailable($node),
			];
		}

		return $result;
	}

	private function formatPermissions(int $permissions): string {
		$strPermissions = '';
		if ($permissions) {
			if ($permissions & Constants::PERMISSION_CREATE) {
				$strPermissions .= 'CK';
			}
			if ($permissions & Constants::PERMISSION_READ) {
				$strPermissions .= 'G';
			}
			if ($permissions & Constants::PERMISSION_UPDATE) {
				$strPermissions .= 'W';
			}
			if ($permissions & Constants::PERMISSION_DELETE) {
				$strPermissions .= 'D';
			}
			if ($permissions & Constants::PERMISSION_SHARE) {
				$strPermissions .= 'R';
			}
		}
		return $strPermissions;
	}

	private function scanCurrentFolder(Folder $folder, bool $shared): iterable {
		$nodes = $folder->getDirectoryListing();

		// add current folder to iterable set
		yield $folder;

		foreach ($nodes as $node) {
			if ($node instanceof Folder && $this->scanFolder($node, 0, $shared)) {
				yield $node;
			} elseif ($node instanceof File) {
				if ($this->validFile($node, $shared)) {
					yield $node;
				}
			}
		}
	}

	private function validFile(File $file, bool $shared): bool {
		$allowed_mimes = array_merge(Application::IMAGE_MIMES, Application::VIDEO_MIMES);
		if (in_array($file->getMimeType(), $allowed_mimes) && $this->isShared($file) === $shared) {
			return true;
		}

		return false;
	}

	private function isShared(Node $node): bool {
		return $node->getStorage()->instanceOfStorage(SharedStorage::class) ||
			$node->getStorage()->instanceOfStorage(\OCA\GroupFolders\Mount\GroupFolderStorage::class);
	}

	private function scanFolder(Folder $folder, int $depth, bool $shared): bool {
		if ($depth > 4) {
			return false;
		}

		try {
			// Ignore folder with a .noimage or .nomedia node
			if ($folder->nodeExists('.noimage') || $folder->nodeExists('.nomedia')) {
				return false;
			}

			$nodes = $folder->getDirectoryListing();
		} catch (StorageNotAvailableException $e) {
			return false;
		}

		foreach ($nodes as $node) {
			if ($node instanceof File) {
				if ($this->validFile($node, $shared)) {
					return true;
				}
			}
		}

		foreach ($nodes as $node) {
			if ($node instanceof Folder && $this->isShared($node) === $shared) {
				if ($this->scanFolder($node, $depth + 1, $shared)) {
					return true;
				}
			}
		}

		return false;
	}
}
