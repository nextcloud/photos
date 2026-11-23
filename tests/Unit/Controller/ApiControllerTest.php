<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Controller;

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
		$user->method('getUid')->willReturn('alice');
		$userSession = $this->createMock(IUserSession::class);
		$userSession->method('getUser')->willReturn($user);

		$this->userConfig = $this->createMock(IUserConfig::class);
		$this->controller = new ApiController($this->createMock(IRequest::class), $this->userConfig, $userSession);
	}

	public function testStoresTheLastSeenVersion(): void {
		$this->userConfig->expects($this->once())
			->method('setValueString')
			->with('alice', 'photos', 'lastSeenVersion', '9.0.0');

		$this->assertEquals(Http::STATUS_OK, $this->controller->setUserConfig('lastSeenVersion', '9.0.0')->getStatus());
	}

	/**
	 * @dataProvider invalidVersions
	 */
	public function testRejectsALastSeenVersionThatIsNoVersion(string $version): void {
		$this->userConfig->expects($this->never())->method('setValueString');

		$this->assertEquals(Http::STATUS_BAD_REQUEST, $this->controller->setUserConfig('lastSeenVersion', $version)->getStatus());
	}

	public static function invalidVersions(): array {
		return [[''], ['9.0.0-dev.0'], ['9.0.0.1'], ['<b>9</b>'], ["9.0.0\n"]];
	}
}
