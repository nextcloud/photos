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

	public static function dataValidSmartAlbums(): array {
		return [
			'empty list' => ['[]'],
			'filters of several types' => [json_encode([
				[
					'id' => 'mq2k1x9abc',
					'name' => 'Rome trips',
					'filters' => [
						'name' => ['rome'],
						'places' => ['Rome'],
						'date-range' => [['start' => 1700000000000, 'end' => 1700500000000]],
					],
				],
				['id' => 'other_id-2', 'name' => 'Everything', 'filters' => []],
			])],
		];
	}

	/**
	 * @dataProvider dataValidSmartAlbums
	 */
	public function testStoresValidSmartAlbums(string $value): void {
		$this->userConfig->expects($this->once())
			->method('setValueString')
			->with('alice', 'photos', 'smartAlbums', $value);

		$response = $this->controller->setUserConfig('smartAlbums', $value);

		$this->assertEquals(Http::STATUS_OK, $response->getStatus());
	}

	public static function dataInvalidSmartAlbums(): array {
		$smartAlbum = ['id' => 'abc', 'name' => 'Rome', 'filters' => ['places' => ['Rome']]];

		return [
			'not JSON' => ['not json'],
			'not a list' => [json_encode(['abc' => $smartAlbum])],
			'not an object' => [json_encode(['abc'])],
			'missing filters' => [json_encode([['id' => 'abc', 'name' => 'Rome']])],
			'extra key' => [json_encode([[...$smartAlbum, 'shared' => true]])],
			'empty id' => [json_encode([[...$smartAlbum, 'id' => '']])],
			'id with unsafe characters' => [json_encode([[...$smartAlbum, 'id' => '../abc']])],
			'duplicate id' => [json_encode([$smartAlbum, $smartAlbum])],
			'blank name' => [json_encode([[...$smartAlbum, 'name' => '  ']])],
			'name too long' => [json_encode([[...$smartAlbum, 'name' => str_repeat('a', 256)]])],
			'name not a string' => [json_encode([[...$smartAlbum, 'name' => 42]])],
			'filters not an object' => [json_encode([[...$smartAlbum, 'filters' => 'places']])],
			'filter values not a list' => [json_encode([[...$smartAlbum, 'filters' => ['places' => 'Rome']]])],
		];
	}

	/**
	 * @dataProvider dataInvalidSmartAlbums
	 */
	public function testRejectsInvalidSmartAlbums(string $value): void {
		$this->userConfig->expects($this->never())->method('setValueString');

		$response = $this->controller->setUserConfig('smartAlbums', $value);

		$this->assertEquals(Http::STATUS_BAD_REQUEST, $response->getStatus());
	}
}
