<?php
/**
 * @copyright Copyright (c) 2016, ownCloud, Inc.
 *
 * @author Bjoern Schiessle <bjoern@schiessle.org>
 * @author Björn Schießle <bjoern@schiessle.org>
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 * @author Julius Härtl <jus@bitgrid.net>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Robin Appelman <robin@icewind.nl>
 * @author Roeland Jago Douma <roeland@famdouma.nl>
 * @author Vincent Petry <pvince81@owncloud.com>
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

namespace OCA\Photos;

use OC\Files\Filesystem;
use OC\Files\Storage\Wrapper\Wrapper;
use OCP\Files\IRootFolder;
use OCP\ILogger;

use OCA\Photos\Service\MetadataService;
use OCA\Photos\Db\PhotoMetadataMapper;

class Storage extends Wrapper {

	/** @var ILogger */
	private $logger;

	/** @var IRootFolder */
	private $rootFolder;

/** @var MetadataService */
	private $metadataService;

/** @var PhotoMetadataMapper */
	private $photoMetadataMapper;

	/**
	 * Storage constructor.
	 *
	 * @param array $parameters
	 * @param ILogger|null $logger
	 * @param IRootFolder|null $rootFolder
	 * @param MetadataService|null $metadataService

	 */
	public function __construct(
		$parameters,
		ILogger $logger = null,
		IRootFolder $rootFolder = null,
		MetadataService $metadataService = null,
		PhotoMetadataMapper $photoMetadataMapper = null
	) {
		$this->logger = $logger;
		$this->rootFolder = $rootFolder;
		$this->metadataService = $metadataService;
		$this->photoMetadataMapper = $photoMetadataMapper;
		parent::__construct($parameters);
	}

	/**
	 * @return bool
	 */
	public function writeStream(string $path, $stream, int $size = null): int {
		$mimeType = \OC::$server->getMimeTypeDetector()->detectPath($path);
		if (in_array($mimeType, ['image/jpeg'])) {
			$photoMetadata = $this->metadataService->extractPhotoMetadata($stream);
			$filePath = $path;
			$filePath = preg_replace('/\\.[^.\\s]+$/', '', trim($filePath,'.part'));
			$photoMetadata->setPath($filePath);
			$this->photoMetadataMapper->insert($photoMetadata);
		}
		return parent::writeStream($path,$stream,$size);
	}

	/**
	 * Setup the storate wrapper callback
	 */
	public static function setupStorage() {
		\OC\Files\Filesystem::addStorageWrapper('oc_photos', function ($mountPoint, $storage) {
			return new \OCA\Photos\Storage(
				['storage' => $storage],
				\OC::$server->getLogger(),
				\OC::$server->getLazyRootFolder(),
				\OC::$server->get("OCA\Photos\Service\MetadataService"),
				\OC::$server->get("OCA\Photos\Db\PhotoMetadataMapper")
			);
		}, 1);
	}
}
