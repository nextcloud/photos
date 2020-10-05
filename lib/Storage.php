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
use OCA\Files_Trashbin\Events\MoveToTrashEvent;
use OCA\Files_Trashbin\Trash\ITrashManager;
use OCP\Encryption\Exceptions\GenericEncryptionException;
use OCP\Files\IRootFolder;
use OCP\Files\Mount\IMountPoint;
use OCP\Files\Node;
use OCP\ILogger;
use OCP\IUserManager;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class Storage extends Wrapper {
	/** @var IMountPoint */
	private $mountPoint;

	/** @var  IUserManager */
	private $userManager;

	/** @var ILogger */
	private $logger;

	/** @var EventDispatcherInterface */
	private $eventDispatcher;

	/** @var IRootFolder */
	private $rootFolder;

	/** @var ITrashManager */
	private $trashManager;

	/**
	 * Storage constructor.
	 *
	 * @param array $parameters
	 * @param ITrashManager $trashManager
	 * @param IUserManager|null $userManager
	 * @param ILogger|null $logger
	 * @param EventDispatcherInterface|null $eventDispatcher
	 * @param IRootFolder|null $rootFolder
	 */
	public function __construct(
		$parameters,
		ITrashManager $trashManager = null,
		IUserManager $userManager = null,
		ILogger $logger = null,
		EventDispatcherInterface $eventDispatcher = null,
		IRootFolder $rootFolder = null
	) {
		$this->mountPoint = $parameters['mountPoint'];
		$this->trashManager = $trashManager;
		$this->userManager = $userManager;
		$this->logger = $logger;
		$this->eventDispatcher = $eventDispatcher;
		$this->rootFolder = $rootFolder;
		parent::__construct($parameters);
	}

	/**
	 * Setup the storate wrapper callback
	 */
	public static function setupStorage() {
		\OC\Files\Filesystem::addStorageWrapper('oc_photos', function ($mountPoint, $storage) {
			return new \OCA\Photos\Storage(
				['storage' => $storage, 'mountPoint' => $mountPoint],
				\OC::$server->query(ITrashManager::class),
				\OC::$server->getUserManager(),
				\OC::$server->getLogger(),
				\OC::$server->getEventDispatcher(),
				\OC::$server->getLazyRootFolder()
			);
		}, 1);
	}

	public function getMountPoint() {
		return $this->mountPoint;
	}
}
