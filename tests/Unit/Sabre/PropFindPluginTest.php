<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Sabre;

use OCA\DAV\Connector\Sabre\File;
use OCA\Photos\Listener\AddedByMetadataProvider;
use OCA\Photos\Sabre\PropFindPlugin;
use OCP\Files\FileInfo;
use OCP\Files\IRootFolder;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IPreview;
use OCP\IUser;
use OCP\IUserManager;
use OCP\IUserSession;
use PHPUnit\Framework\MockObject\MockObject;
use Sabre\DAV\PropFind;
use Test\TestCase;

class PropFindPluginTest extends TestCase {
	private IUserSession&MockObject $userSession;
	private IUserManager&MockObject $userManager;
	private PropFindPlugin $plugin;

	protected function setUp(): void {
		parent::setUp();

		$this->userSession = $this->createMock(IUserSession::class);
		$this->userManager = $this->createMock(IUserManager::class);
		$this->userManager->method('getDisplayName')
			->willReturnMap([['bob', 'Bob Builder']]);

		$this->plugin = new PropFindPlugin(
			$this->createMock(IPreview::class),
			$this->createMock(IFilesMetadataManager::class),
			$this->userSession,
			$this->createMock(IRootFolder::class),
			$this->userManager,
		);
	}

	private function findAddedByDisplayName(array $metadata): mixed {
		$fileInfo = $this->createMock(FileInfo::class);
		$fileInfo->method('getMetadata')->willReturn($metadata);
		$node = $this->createMock(File::class);
		$node->method('getFileInfo')->willReturn($fileInfo);

		$propFind = new PropFind('files/alice/Family/photo.jpg', [PropFindPlugin::ADDED_BY_DISPLAY_NAME_PROPERTYNAME]);
		$this->plugin->propFind($propFind, $node);

		return $propFind->get(PropFindPlugin::ADDED_BY_DISPLAY_NAME_PROPERTYNAME);
	}

	private function signIn(): void {
		$this->userSession->method('getUser')->willReturn($this->createMock(IUser::class));
	}

	public function testReturnsTheDisplayNameOfTheUserWhoAddedTheFile(): void {
		$this->signIn();

		$this->assertSame('Bob Builder', $this->findAddedByDisplayName([AddedByMetadataProvider::METADATA_KEY => 'bob']));
	}

	public function testReturnsNothingForAFileWithoutUploader(): void {
		$this->signIn();

		$this->assertNull($this->findAddedByDisplayName(['photos-size' => ['width' => 1, 'height' => 1]]));
	}

	public function testReturnsNothingWithoutASession(): void {
		$this->userSession->method('getUser')->willReturn(null);

		$this->assertNull($this->findAddedByDisplayName([AddedByMetadataProvider::METADATA_KEY => 'bob']));
	}
}
