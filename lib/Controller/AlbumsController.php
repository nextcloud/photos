<?php
declare(strict_types=1);
/**
 * @copyright Copyright (c) 2019, Roeland Jago Douma <roeland@famdouma.nl>
 *
 * @author Roeland Jago Douma <roeland@famdouma.nl>
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

namespace OCA\Photos\Controller;

use OCA\Files_Sharing\SharedStorage;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\FIles\Node;
use OCP\Files\NotFoundException;
use OCP\IRequest;

class AlbumsController extends Controller {

	/** @var string */
	private $userId;
	/** @var IRootFolder */
	private $rootFolder;

	public function __construct($appName, IRequest $request, string $userId, IRootFolder $rootFolder) {
		parent::__construct($appName, $request);
		$this->userId = $userId;
		$this->rootFolder = $rootFolder;
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
		$result = [];
		/** @var Node $node */
		foreach ($nodes as $node) {
			$result[] = [
				'id' => $node->getName(),
				'basename' => $node->getName(),
				'id' => $node->getName(),
				'id' => $node->getName(),
				'id' => $node->getName(),
				'id' => $node->getName(),
			]
		}

		return $result;
	}

	private function scanCurrentFolder(Folder $folder, bool $shared): iterable  {
		$nodes = $folder->getDirectoryListing();

		foreach ($nodes as $node) {
			if ($node instanceof Folder) {
				yield from $this->scanFolder($node, 0, $shared);
			} elseif ($node instanceof File) {
				if ($this->validFile($node, $shared)) {
					yield $node;
				}
			}
		}
	}

	private function validFile(File $file, bool $shared): bool {
		if ($file->getMimePart() === 'image' && $this->isShared($file) === $shared) {
			return true;
		}

		return false;
	}

	private function isShared(Node $node): bool {
		return $node->getStorage()->instanceOfStorage(SharedStorage::class);
	}

	private function scanFolder(Folder $folder, int $depth, bool $shared): iterable {
		if ($depth > 4) {
			return [];
		}

		$nodes = $folder->getDirectoryListing();

		foreach ($nodes as $node) {
			if ($node instanceof File) {
				if ($this->validFile($node, $shared)) {
					yield $folder;
					return [];
				}
			}
		}

		foreach ($nodes as $node) {
			if ($node instanceof Folder && $this->isShared($node) === $shared) {
				yield from $this->scanFolder($node, $depth + 1, $shared);
			}
		}
	}
}
