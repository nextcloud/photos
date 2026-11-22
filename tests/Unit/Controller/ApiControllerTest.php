<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Controller\ApiController;
use OCP\AppFramework\Http;
use OCP\Config\IUserConfig;
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

		$this->userConfig = $this->createMock(IUserConfig::class);
		$this->controller = new ApiController(
			$this->createMock(IRequest::class),
			$this->userConfig,
			$userSession,
		);
	}

	public static function validFamilyLibraries(): array {
		return [
			'unset' => [''],
			'folder' => ['/Family'],
			'nested folder' => ['/Shared/Family photos'],
		];
	}

	/**
	 * @dataProvider validFamilyLibraries
	 */
	public function testStoresAFamilyLibrary(string $value): void {
		$this->userConfig->expects($this->once())
			->method('setValueString')
			->with('alice', Application::APP_ID, 'familyLibrary', $value);

		$response = $this->controller->setUserConfig('familyLibrary', $value);

		$this->assertSame(Http::STATUS_OK, $response->getStatus());
	}

	public static function invalidFamilyLibraries(): array {
		return [
			'root folder' => ['/'],
			'relative path' => ['Family'],
			'parent folder' => ['/Family/../Private'],
		];
	}

	/**
	 * @dataProvider invalidFamilyLibraries
	 */
	public function testRejectsAnInvalidFamilyLibrary(string $value): void {
		$this->userConfig->expects($this->never())->method('setValueString');

		$response = $this->controller->setUserConfig('familyLibrary', $value);

		$this->assertSame(Http::STATUS_BAD_REQUEST, $response->getStatus());
	}
}
