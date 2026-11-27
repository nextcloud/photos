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

	public function testStoresThatTheWelcomeWasDismissed(): void {
		$this->userConfig->expects($this->once())
			->method('setValueString')
			->with('alice', 'photos', 'welcomeDismissed', 'true');

		$this->assertEquals(Http::STATUS_OK, $this->controller->setUserConfig('welcomeDismissed', 'true')->getStatus());
	}

	public function testRejectsAWelcomeStateThatIsNoBoolean(): void {
		$this->userConfig->expects($this->never())->method('setValueString');

		$this->assertEquals(Http::STATUS_BAD_REQUEST, $this->controller->setUserConfig('welcomeDismissed', 'later')->getStatus());
	}
}
