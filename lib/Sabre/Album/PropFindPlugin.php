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

use OC\Metadata\IMetadataManager;
use OCA\DAV\Connector\Sabre\FilesPlugin;
use OCP\IConfig;
use Sabre\DAV\INode;
use Sabre\DAV\PropFind;
use Sabre\DAV\Server;
use Sabre\DAV\ServerPlugin;

class PropFindPlugin extends ServerPlugin {
	private IConfig $config;
	private IMetadataManager $metadataManager;
	private bool $metadataEnabled;

	public function __construct(IConfig $config, IMetadataManager $metadataManager) {
		$this->config = $config;
		$this->metadataManager = $metadataManager;
		$this->metadataEnabled = $this->config->getSystemValueBool('enable_file_metadata', true);
	}


	public function initialize(Server $server) {
		$server->on('propFind', [$this, 'propFind']);
	}

	public function propFind(PropFind $propFind, INode $node) {
		if ($node instanceof AlbumPhoto) {
			$propFind->handle('{http://nextcloud.org/ns}file-name', function () use ($node) {
				return $node->getFile()->getName();
			});
			$propFind->handle(FilesPlugin::INTERNAL_FILEID_PROPERTYNAME, function () use ($node) {
				return $node->getFile()->getFileId();
			});
			$propFind->handle(FilesPlugin::GETETAG_PROPERTYNAME, function () use ($node): string {
				return $node->getETag();
			});

			if ($this->metadataEnabled) {
				$propFind->handle(FilesPlugin::FILE_METADATA_SIZE, function () use ($node) {
					if (!str_starts_with($node->getFile()->getMimetype(), 'image')) {
						return json_encode((object)[]);
					}

					if ($node->getFile()->hasMetadata('size')) {
						$sizeMetadata = $node->getFile()->getMetadata('size');
					} else {
						$sizeMetadata = $this->metadataManager->fetchMetadataFor('size', [$node->getFile()->getFileId()])[$node->getFile()->getFileId()];
					}

					return json_encode((object)$sizeMetadata->getMetadata());
				});
			}
		}

		if ($node instanceof AlbumRoot) {
			// TODO detect dynamically which metadata groups are requested and
			// preload all of them and not just size
			if ($this->metadataEnabled && in_array(FilesPlugin::FILE_METADATA_SIZE, $propFind->getRequestedProperties(), true)) {
				$fileIds = $node->getAlbum()->getFileIds();

				$preloadedMetadata = $this->metadataManager->fetchMetadataFor('size', $fileIds);
				foreach ($node->getAlbum()->getFiles() as $file) {
					if (str_starts_with($file->getMimeType(), 'image')) {
						$file->setMetadata('size', $preloadedMetadata[$file->getFileId()]);
					}
				}
			}
		}
	}
}
