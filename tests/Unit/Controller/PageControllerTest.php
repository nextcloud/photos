<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Controller;

use OCA\Photos\Controller\PageController;
use OCA\Photos\Service\UserConfigService;
use OCP\App\IAppManager;
use OCP\AppFramework\Services\IInitialState;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\ICache;
use OCP\ICacheFactory;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IRequest;
use OCP\IUser;
use OCP\IUserSession;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class PageControllerTest extends TestCase {
	/** @var array<string, mixed> */
	private array $initialState = [];

	public static function socialStates(): array {
		return [
			'enabled' => [true],
			'disabled' => [false],
		];
	}

	/**
	 * @dataProvider socialStates
	 */
	public function testIndexTellsWhetherSocialIsEnabled(bool $enabled): void {
		$appManager = $this->createMock(IAppManager::class);
		$appManager->method('isEnabledForUser')
			->willReturnCallback(fn (string $appId): bool => $appId === 'social' && $enabled);

		$this->createController($appManager)->index();

		$this->assertSame($enabled, $this->initialState['social']);
	}

	private function createController(IAppManager $appManager): PageController {
		$initialState = $this->createMock(IInitialState::class);
		$initialState->method('provideInitialState')
			->willReturnCallback(function (string $key, mixed $value): void {
				$this->initialState[$key] = $value;
			});

		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn('alice');
		$userSession = $this->createMock(IUserSession::class);
		$userSession->method('getUser')->willReturn($user);

		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->willThrowException(new NotFoundException());

		$cacheFactory = $this->createMock(ICacheFactory::class);
		$cacheFactory->method('createDistributed')->willReturn($this->createMock(ICache::class));

		$config = $this->createMock(IConfig::class);
		$config->method('getAppValue')->willReturn('true');
		$config->method('getSystemValueBool')->willReturn(true);

		return new PageController(
			$this->createMock(IRequest::class),
			$appManager,
			$this->createMock(IEventDispatcher::class),
			$this->createMock(UserConfigService::class),
			$initialState,
			$userSession,
			$rootFolder,
			$cacheFactory,
			$this->createMock(LoggerInterface::class),
			$config,
			$this->createMock(IL10N::class),
			null,
		);
	}
}
