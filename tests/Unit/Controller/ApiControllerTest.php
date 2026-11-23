<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Controller;

use OCA\Photos\Controller\ApiController;
use OCP\Config\IUserConfig;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\NotFoundException;
use OCP\IRequest;
use OCP\IUser;
use OCP\IUserSession;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class ApiControllerTest extends TestCase {
	private IUserConfig&MockObject $userConfig;
	private ApiController $controller;

	protected function setUp(): void {
		parent::setUp();

		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn('alice');
		$userSession = $this->createMock(IUserSession::class);
		$userSession->method('getUser')->willReturn($user);

		$userFolder = $this->createMock(IUserFolder::class);
		$userFolder->method('get')->willReturnCallback(fn (string $path): Folder => match ($path) {
			'/Photos' => $this->folder(false),
			'/Vault' => $this->folder(true),
			default => throw new NotFoundException(),
		});
		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->with('alice')->willReturn($userFolder);

		$this->userConfig = $this->createMock(IUserConfig::class);

		$this->controller = new ApiController(
			$this->createMock(IRequest::class),
			$this->userConfig,
			$userSession,
			$rootFolder,
		);
	}

	public function testUploadLocationCanBeARegularFolder(): void {
		$this->userConfig->expects($this->once())->method('setValueString')
			->with('alice', 'photos', 'photosLocation', '/Photos');

		$this->assertSame(200, $this->controller->setUserConfig('photosLocation', '/Photos')->getStatus());
	}

	public function testUploadLocationCanBeAFolderThatDoesNotExistYet(): void {
		$this->userConfig->expects($this->once())->method('setValueString');

		$this->assertSame(200, $this->controller->setUserConfig('photosLocation', '/New')->getStatus());
	}

	public function testUploadLocationCannotBeAnEncryptedFolder(): void {
		$this->userConfig->expects($this->never())->method('setValueString');

		$this->assertSame(400, $this->controller->setUserConfig('photosLocation', '/Vault')->getStatus());
	}

	public function testSourceFoldersCanBeRegularFolders(): void {
		$this->userConfig->expects($this->once())->method('setValueString')
			->with('alice', 'photos', 'photosSourceFolders', '["/Photos","/New"]');

		$this->assertSame(200, $this->controller->setUserConfig('photosSourceFolders', '["/Photos","/New"]')->getStatus());
	}

	public function testSourceFoldersCannotHoldAnEncryptedFolder(): void {
		$this->userConfig->expects($this->never())->method('setValueString');

		$this->assertSame(400, $this->controller->setUserConfig('photosSourceFolders', '["/Photos","/Vault"]')->getStatus());
	}

	private function folder(bool $encrypted): Folder {
		$folder = $this->createMock(Folder::class);
		$folder->method('isEncrypted')->willReturn($encrypted);

		return $folder;
	}
}
