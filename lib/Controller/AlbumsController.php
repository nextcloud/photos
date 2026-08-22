<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\Files\DavUtil;
use OCP\Files\File;
use OCP\Files\FileInfo;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\Files\Storage\ISharedStorage;
use OCP\Files\StorageNotAvailableException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IFilesMetadata;
use OCP\IPreview;
use OCP\IRequest;
use OCP\ITagManager;

class AlbumsController extends Controller {
	public function __construct(
		private readonly string $userId,
		IRequest $request,
		private readonly IRootFolder $rootFolder,
		private readonly IPreview $previewManager,
		private readonly ITagManager $tagManager,
		private readonly IFilesMetadataManager $filesMetadataManager,
	) {
		parent::__construct(Application::APP_ID, $request);
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
			} catch (NotFoundException) {
				return new JSONResponse([], Http::STATUS_NOT_FOUND);
			}
		}

		$data = $this->scanCurrentFolder($folder, $shared);
		$result = $this->formatData($folder, $data);

		return new JSONResponse($result, Http::STATUS_OK);
	}

	/**
	 * Describe the given nodes the way the files DAV endpoint describes them, so
	 * that a listing of this endpoint is read like a DAV one.
	 *
	 * @param Folder $folder the folder being listed, which is the parent of every
	 *                       node of the listing but itself
	 * @param iterable<Node> $nodes
	 */
	private function formatData(Folder $folder, iterable $nodes): array {
		$userFolder = $this->rootFolder->getUserFolder($this->userId);
		$nodes = is_array($nodes) ? $nodes : iterator_to_array($nodes, false);
		$favorites = $this->favoriteFileIds();
		$metadata = $this->metadataOfNodes($nodes);

		$result = [];
		foreach ($nodes as $node) {
			// properly format full path and make sure
			// we're relative to the user home folder
			$path = $userFolder->getRelativePath($node->getPath());
			$parent = $node->getId() === $folder->getId() ? $this->parentOf($folder) : $folder;

			$result[] = [
				'id' => (string)$node->getId(),
				'filename' => $path,
				'mtime' => $node->getMTime(),
				'mime' => $node->getMimetype(),
				'size' => $node->getSize(),
				'type' => $node->getType(),
				'permissions' => DavUtil::getDavPermissions($node, $parent),
				'owner' => $node->getOwner()?->getUID(),
				'attributes' => [
					'etag' => $node->getEtag(),
					'hasPreview' => $this->previewManager->isAvailable($node),
					'favorite' => isset($favorites[$node->getId()]) ? 1 : 0,
					...$this->formatMetadata($metadata[$node->getId()] ?? null),
				],
			];
		}

		return $result;
	}

	/**
	 * The folder holding the given one, to describe its permissions against.
	 *
	 * The root of the account has none that it can reach, and is the one folder
	 * that cannot be renamed anyway — so it stands in for its own parent.
	 */
	private function parentOf(Folder $folder): FileInfo {
		try {
			return $folder->getParent();
		} catch (NotFoundException|NotPermittedException) {
			return $folder;
		}
	}

	/**
	 * Ids of the files the account marked as a favorite, as a set.
	 *
	 * @return array<int, true>
	 */
	private function favoriteFileIds(): array {
		$favorites = $this->tagManager->load('files', [], false, $this->userId)->getFavorites();

		return array_fill_keys($favorites ?: [], true);
	}

	/**
	 * Stored metadata of the given nodes, by file id.
	 *
	 * Read for all of them at once: a listing holds as many photos as the folder
	 * does, and one query per photo would be one too many.
	 *
	 * @param list<Node> $nodes
	 * @return array<int, IFilesMetadata>
	 */
	private function metadataOfNodes(array $nodes): array {
		$fileIds = array_values(array_filter(array_map(
			static fn (Node $node): int => $node->getId(),
			$nodes,
		), static fn (int $fileId): bool => $fileId > 0));

		if ($fileIds === []) {
			return [];
		}

		return $this->filesMetadataManager->getMetadataForFiles($fileIds);
	}

	/**
	 * The metadata of a node under the names the files DAV endpoint gives them,
	 * which prefixes every one of them with `metadata-`.
	 */
	private function formatMetadata(?IFilesMetadata $metadata): array {
		$attributes = [];
		foreach ($metadata?->asArray() ?? [] as $key => $value) {
			$attributes['metadata-' . $key] = $value;
		}

		return $attributes;
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
		/**
		 * @psalm-suppress UndefinedClass
		 * Adding the GroupFolderStorage class to the stubs would mean adding a lot of other classes.
		 * This is enough for the current usage.
		 */
		return $node->getStorage()->instanceOfStorage(ISharedStorage::class)
			|| $node->getStorage()->instanceOfStorage(\OCA\GroupFolders\Mount\GroupFolderStorage::class);
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
		} catch (StorageNotAvailableException) {
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
