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

use OCA\DAV\Connector\Sabre\FilesPlugin;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Sabre\Album\AlbumPhoto;
use OCA\Photos\Sabre\Album\AlbumRoot;
use OCA\Photos\Sabre\Album\PublicAlbumPhoto;
use OCA\Photos\Sabre\Place\PlacePhoto;
use OCA\Photos\Sabre\Place\PlaceRoot;
use OCP\Files\DavUtil;
use OCP\Files\NotFoundException;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IPreview;
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
	public const PERMISSIONS_PROPERTYNAME = '{http://owncloud.org/ns}permissions';

	private IPreview $previewManager;
	private ?Tree $tree;
	private AlbumMapper $albumMapper;

	public function __construct(
		IPreview $previewManager,
		AlbumMapper $albumMapper,
		private IFilesMetadataManager $filesMetadataManager,
	) {
		$this->previewManager = $previewManager;
		$this->albumMapper = $albumMapper;
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
		$server->on('propFind', [$this, 'propFind']);
		$server->on('propPatch', [$this, 'handleUpdateProperties']);
	}

	public function propFind(PropFind $propFind, INode $node): void {
		if ($node instanceof AlbumPhoto || $node instanceof PlacePhoto) {
			// Checking if the node is truly available and ignoring if not
			// Should be pre-emptively handled by the NodeDeletedEvent
			try {
				$fileInfo = $node->getFileInfo();
			} catch (NotFoundException $e) {
				return;
			}

			$propFind->handle(FilesPlugin::INTERNAL_FILEID_PROPERTYNAME, fn () => $node->getFile()->getFileId());
			$propFind->handle(FilesPlugin::GETETAG_PROPERTYNAME, fn () => $node->getETag());
			$propFind->handle(self::FILE_NAME_PROPERTYNAME, fn () => $node->getFile()->getName());
			$propFind->handle(self::FAVORITE_PROPERTYNAME, fn () => $node->isFavorite() ? 1 : 0);
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
				$propFind->handle(FilesPlugin::FILE_METADATA_PREFIX.$metadataKey, $metadataValue);
			}


			$propFind->handle(FilesPlugin::HIDDEN_PROPERTYNAME, function () use ($node) {
				$metadata = $this->filesMetadataManager->getMetadata((int)$node->getFileInfo()->getId(), true);
				return $metadata->hasKey('files-live-photo') && $node->getFileInfo()->getMimetype() === 'video/quicktime' ? 'true' : 'false';
			});

		}

		if ($node instanceof AlbumRoot) {
			$propFind->handle(self::ORIGINAL_NAME_PROPERTYNAME, fn () => $node->getAlbum()->getAlbum()->getTitle());
			$propFind->handle(self::LAST_PHOTO_PROPERTYNAME, fn () => $node->getAlbum()->getAlbum()->getLastAddedPhoto());
			$propFind->handle(self::NBITEMS_PROPERTYNAME, fn () => count($node->getChildren()));
			$propFind->handle(self::LOCATION_PROPERTYNAME, fn () => $node->getAlbum()->getAlbum()->getLocation());
			$propFind->handle(self::DATE_RANGE_PROPERTYNAME, fn () => json_encode($node->getDateRange()));
			$propFind->handle(self::COLLABORATORS_PROPERTYNAME, fn () => $node->getCollaborators());
		}

		if ($node instanceof PlaceRoot) {
			$propFind->handle(self::LAST_PHOTO_PROPERTYNAME, fn () => $node->getFirstPhoto());
			$propFind->handle(self::NBITEMS_PROPERTYNAME, fn () => count($node->getChildren()));
		}
	}

	public function handleUpdateProperties($path, PropPatch $propPatch): void {
		$node = $this->tree->getNodeForPath($path);
		if ($node instanceof AlbumRoot) {
			$propPatch->handle(self::LOCATION_PROPERTYNAME, function ($location) use ($node) {
				if ($location instanceof Complex) {
					$location = $location->getXml();
				}

				$this->albumMapper->setLocation($node->getAlbum()->getAlbum()->getId(), $location);
				return true;
			});
			$propPatch->handle(self::COLLABORATORS_PROPERTYNAME, function ($collaborators) use ($node) {
				$collaborators = $node->setCollaborators(json_decode($collaborators, true));
				return true;
			});
		}

		if ($node instanceof AlbumPhoto) {
			$propPatch->handle(self::FAVORITE_PROPERTYNAME, function ($favoriteState) use ($node) {
				$node->setFavoriteState($favoriteState);
				return true;
			});
		}
	}
}
