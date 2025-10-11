<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Sabre;

use OCA\DAV\Connector\Sabre\FilesPlugin;
use OCA\Photos\Album\AlbumFile;
use OCA\Photos\Sabre\Album\AlbumPhoto;
use OCA\Photos\Sabre\Album\AlbumRootBase;
use OCA\Photos\Sabre\Album\PublicAlbumPhoto;
use OCA\Photos\Sabre\Place\PlacePhoto;
use OCA\Photos\Sabre\Place\PlaceRoot;
use OCP\Files\DavUtil;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IPreview;
use OCP\IUserSession;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\ICollection;
use Sabre\DAV\INode;
use Sabre\DAV\PropFind;
use Sabre\DAV\PropPatch;
use Sabre\DAV\Server;
use Sabre\DAV\ServerPlugin;
use Sabre\DAV\Tree;
use Sabre\DAV\Xml\Property\Complex;

class PropFindPlugin extends ServerPlugin {
	public const ORIGINAL_NAME_PROPERTYNAME = '{http://nextcloud.org/ns}original-name';
	public const FILE_NAME_PROPERTYNAME = '{http://nextcloud.org/ns}file-name';
	public const FAVORITE_PROPERTYNAME = '{http://owncloud.org/ns}favorite';
	public const DATE_RANGE_PROPERTYNAME = '{http://nextcloud.org/ns}dateRange';
	public const LOCATION_PROPERTYNAME = '{http://nextcloud.org/ns}location';
	public const LAST_PHOTO_PROPERTYNAME = '{http://nextcloud.org/ns}last-photo';
	public const NBITEMS_PROPERTYNAME = '{http://nextcloud.org/ns}nbItems';
	public const COLLABORATORS_PROPERTYNAME = '{http://nextcloud.org/ns}collaborators';
	public const FILTERS_PROPERTYNAME = '{http://nextcloud.org/ns}filters';
	public const PERMISSIONS_PROPERTYNAME = '{http://owncloud.org/ns}permissions';
	public const PHOTOS_ALBUM_FILE_ORIGIN_PROPERTYNAME = '{http://nextcloud.org/ns}photos-album-file-origin';
	public const PHOTOS_COLLECTION_FILE_ORIGINAL_FILENAME_PROPERTYNAME = '{http://nextcloud.org/ns}photos-collection-file-original-filename';

	private ?Tree $tree = null;

	public function __construct(
		private readonly IPreview $previewManager,
		private readonly IFilesMetadataManager $filesMetadataManager,
		private readonly IUserSession $userSession,
		private readonly IRootFolder $rootFolder,
	) {
	}

	/**
	 * Returns a plugin name.
	 *
	 * Using this name other plugins will be able to access other plugins
	 * using DAV\Server::getPlugin
	 *
	 * @return string
	 */
	public function getPluginName() {
		return 'photosDavPlugin';
	}

	/**
	 * @return void
	 */
	public function initialize(Server $server) {
		$this->tree = $server->tree;
		$server->on('propFind', $this->propFind(...));
		$server->on('propPatch', $this->handleUpdateProperties(...));
	}

	public function propFind(PropFind $propFind, INode $node): void {
		if ($node instanceof AlbumPhoto || $node instanceof PlacePhoto) {
			// Checking if the node is truly available and ignoring if not
			// Should be pre-emptively handled by the NodeDeletedEvent
			try {
				$fileInfo = $node->getFileInfo();
			} catch (NotFoundException) {
				return;
			}

			$propFind->handle(FilesPlugin::INTERNAL_FILEID_PROPERTYNAME, fn (): int => $node->getFile()->getFileId());
			$propFind->handle(FilesPlugin::GETETAG_PROPERTYNAME, fn () => $node->getETag());
			$propFind->handle(self::FILE_NAME_PROPERTYNAME, fn (): string => $node->getFile()->getName());
			$propFind->handle(self::FAVORITE_PROPERTYNAME, fn (): int => $node->isFavorite() ? 1 : 0);
			$propFind->handle(FilesPlugin::HAS_PREVIEW_PROPERTYNAME, fn () => json_encode($this->previewManager->isAvailable($fileInfo)));
			$propFind->handle(FilesPlugin::PERMISSIONS_PROPERTYNAME, function () use ($node): string {
				$permissions = DavUtil::getDavPermissions($node->getFileInfo());
				$filteredPermissions = str_replace('R', '', $permissions);

				if ($node instanceof PublicAlbumPhoto) {
					$filteredPermissions = str_replace('D', '', $filteredPermissions);
					$filteredPermissions = str_replace('NV', '', $filteredPermissions);
					$filteredPermissions = str_replace('W', '', $filteredPermissions);
				}
				return $filteredPermissions;
			});

			foreach ($node->getFileInfo()->getMetadata() as $metadataKey => $metadataValue) {
				$propFind->handle(FilesPlugin::FILE_METADATA_PREFIX . $metadataKey, $metadataValue);
			}

			$propFind->handle(FilesPlugin::HIDDEN_PROPERTYNAME, function () use ($node) {
				$metadata = $this->filesMetadataManager->getMetadata((int)$node->getFileInfo()->getId(), true);
				return $metadata->hasKey('files-live-photo') && $node->getFileInfo()->getMimetype() === 'video/quicktime' ? 'true' : 'false';
			});

			$propFind->handle(self::PHOTOS_ALBUM_FILE_ORIGIN_PROPERTYNAME, function () use ($node) {
				$file = $node->getFile();
				if ($file instanceof AlbumFile) {
					return $file->origin;
				} else {
					return null;
				}
			});

			$propFind->handle(self::PHOTOS_COLLECTION_FILE_ORIGINAL_FILENAME_PROPERTYNAME, function () use ($node) {
				if (!($node instanceof AlbumPhoto)) {
					return;
				}

				$currentUser = $this->userSession->getUser();
				$fileOwner = $node->getFileInfo()->getOwner();
				if ($currentUser !== null && $currentUser === $fileOwner) {
					$userFolder = $this->rootFolder->getUserFolder($currentUser->getUID());
					return $userFolder->getRelativePath($node->getFileInfo()->getPath());
				}
			});
		}

		if ($node instanceof ICollection) {
			$propFind->handle(self::NBITEMS_PROPERTYNAME, fn (): int => count($node->getChildren()));
		}

		if ($node instanceof AlbumRootBase) {
			$propFind->handle(self::ORIGINAL_NAME_PROPERTYNAME, fn (): string => $node->getAlbum()->getAlbum()->getTitle());
			$propFind->handle(self::LAST_PHOTO_PROPERTYNAME, fn (): int => $node->getCover());
			$propFind->handle(self::LOCATION_PROPERTYNAME, fn (): string => $node->getAlbum()->getAlbum()->getLocation());
			$propFind->handle(self::DATE_RANGE_PROPERTYNAME, fn () => json_encode($node->getDateRange()));
			$propFind->handle(self::COLLABORATORS_PROPERTYNAME, fn (): array => $node->getCollaborators());
			$propFind->handle(self::FILTERS_PROPERTYNAME, fn (): ?string => $node->getFilters());
		}

		if ($node instanceof PlaceRoot) {
			$propFind->handle(self::LAST_PHOTO_PROPERTYNAME, fn (): int => $node->getFirstPhoto());
		}
	}

	public function handleUpdateProperties($path, PropPatch $propPatch): void {
		$node = $this->tree->getNodeForPath($path);
		if ($node instanceof AlbumRootBase) {
			$propPatch->handle(self::LOCATION_PROPERTYNAME, function ($location) use ($node) {
				if ($location instanceof Complex) {
					$location = $location->getXml();
				}
				$node->setLocation($location);
				return true;
			});
			$propPatch->handle(self::COLLABORATORS_PROPERTYNAME, function ($collaborators) use ($node) {
				$node->setCollaborators(json_decode($collaborators, true));
				return true;
			});
			$propPatch->handle(self::FILTERS_PROPERTYNAME, function ($filters) use ($node) {
				$node->setFilters($filters);
				return true;
			});
		}

		if ($node instanceof AlbumPhoto) {
			$propPatch->handle(self::FAVORITE_PROPERTYNAME, function ($favoriteState) use ($node) {
				if ($this->userSession->getUser() !== $node->getFileInfo()->getOwner()) {
					throw new Forbidden('Only the owner can favorite its photos');
				}

				$node->setFavoriteState($favoriteState);
				return true;
			});
		}
	}
}
