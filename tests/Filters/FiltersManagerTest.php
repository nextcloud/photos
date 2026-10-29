<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Filters;

use OCA\Photos\Filters\FiltersManager;
use OCA\Photos\Service\UserConfigService;
use OCP\Files\Folder;
use OCP\Files\IMimeTypeLoader;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\Files\Storage\ISharedStorage;
use OCP\Files\Storage\IStorage;
use OCP\Share\IShare;
use Test\TestCase;

class FiltersManagerTest extends TestCase {
	private IRootFolder $rootFolder;
	private UserConfigService $userConfigService;
	private FiltersManager $filtersManager;

	protected function setUp(): void {
		parent::setUp();

		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->userConfigService = $this->createMock(UserConfigService::class);

		$this->filtersManager = new FiltersManager(
			$this->rootFolder,
			$this->createMock(IMimeTypeLoader::class),
			$this->userConfigService,
		);
	}

	public function testIsDownloadAllowedForFileOutsideAnyShare(): void {
		$storage = $this->createMock(IStorage::class);
		$storage->method('instanceOfStorage')->with(ISharedStorage::class)->willReturn(false);

		$this->assertTrue($this->filtersManager->isDownloadAllowed($this->nodeWithStorage($storage)));
	}

	public function testIsDownloadAllowedWhenTheShareGrantsDownload(): void {
		$this->assertTrue($this->filtersManager->isDownloadAllowed($this->receivedShareNode(true)));
	}

	public function testIsDownloadDeniedWhenTheShareForbidsDownload(): void {
		$this->assertFalse($this->filtersManager->isDownloadAllowed($this->receivedShareNode(false)));
	}

	public function testGetFilesBasedOnFiltersDropsDownloadRestrictedReceivedShares(): void {
		$ownStorage = $this->createMock(IStorage::class);
		$ownStorage->method('instanceOfStorage')->with(ISharedStorage::class)->willReturn(false);

		$ownFile = $this->searchResult(10, 'own.jpg', $ownStorage);
		$restricted = $this->searchResult(20, 'restricted.jpg', $this->sharedStorage(false));

		$userFolder = $this->createMock(Folder::class);
		$userFolder->method('search')->willReturn([$ownFile, $restricted]);
		$this->rootFolder->method('getUserFolder')->with('alice')->willReturn($userFolder);
		$this->userConfigService->method('getConfigForUser')
			->with('alice', 'photosSourceFolders')
			->willReturn('["/Photos"]');

		$result = $this->filtersManager->getFilesBasedOnFilters('alice', ['name' => ['jpg']]);

		$this->assertCount(1, $result);
		$this->assertSame(10, $result[0]->getFileId());
	}

	private function nodeWithStorage(IStorage $storage): Node {
		$node = $this->createMock(Node::class);
		$node->method('getStorage')->willReturn($storage);
		return $node;
	}

	private function receivedShareNode(bool $canDownload): Node {
		return $this->nodeWithStorage($this->sharedStorage($canDownload));
	}

	private function sharedStorage(bool $canDownload): ISharedStorage {
		$share = $this->createMock(IShare::class);
		$share->method('canDownload')->willReturn($canDownload);

		$storage = $this->createMock(ISharedStorage::class);
		$storage->method('instanceOfStorage')->with(ISharedStorage::class)->willReturn(true);
		$storage->method('getShare')->willReturn($share);
		return $storage;
	}

	private function searchResult(int $id, string $name, IStorage $storage): Node {
		$node = $this->createMock(Node::class);
		$node->method('getId')->willReturn($id);
		$node->method('getName')->willReturn($name);
		$node->method('getMimetype')->willReturn('image/jpeg');
		$node->method('getSize')->willReturn(1024);
		$node->method('getMTime')->willReturn(0);
		$node->method('getEtag')->willReturn('etag');
		$node->method('getStorage')->willReturn($storage);
		return $node;
	}
}
