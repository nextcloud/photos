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

	public static function dataSortOrders(): array {
		return [
			['albumsSortOrder', 'recent', true],
			['albumsSortOrder', 'name', true],
			['albumsSortOrder', 'date', true],
			['albumsSortOrder', 'size', false],
			['albumPhotosSortOrder', 'oldest', true],
			['albumPhotosSortOrder', 'newest', true],
			['albumPhotosSortOrder', 'recent', false],
		];
	}

	/**
	 * @dataProvider dataSortOrders
	 */
	public function testSetSortOrder(string $key, string $value, bool $valid): void {
		$this->userConfig->expects($valid ? $this->once() : $this->never())
			->method('setValueString')
			->with('alice', 'photos', $key, $value);

		$response = $this->controller->setUserConfig($key, $value);

		$this->assertSame($valid ? Http::STATUS_OK : Http::STATUS_BAD_REQUEST, $response->getStatus());
	}
}
