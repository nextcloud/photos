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
use OCP\Files\NotPermittedException;
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
	public static function dataTrashbinState(): array {
		return [
			'trash bin enabled' => [true],
			'trash bin disabled' => [false],
		];
	}

	/**
	 * @dataProvider dataTrashbinState
	 */
	public function testIndexAnnouncesWhetherTheTrashbinIsEnabled(bool $enabled): void {
		$appManager = $this->createMock(IAppManager::class);
		$appManager->method('isEnabledForUser')
			->willReturnCallback(fn (string $appId): bool => $appId === 'files_trashbin' && $enabled);

		$states = [];
		$initialState = $this->createMock(IInitialState::class);
		$initialState->method('provideInitialState')
			->willReturnCallback(function (string $key, mixed $value) use (&$states): void {
				$states[$key] = $value;
			});

		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn('alice');
		$userSession = $this->createMock(IUserSession::class);
		$userSession->method('getUser')->willReturn($user);

		$rootFolder = $this->createMock(IRootFolder::class);
		$rootFolder->method('getUserFolder')->willThrowException(new NotPermittedException());

		$cacheFactory = $this->createMock(ICacheFactory::class);
		$cacheFactory->method('createDistributed')->willReturn($this->createMock(ICache::class));

		$controller = new PageController(
			$this->createMock(IRequest::class),
			$appManager,
			$this->createMock(IEventDispatcher::class),
			$this->createMock(UserConfigService::class),
			$initialState,
			$userSession,
			$rootFolder,
			$cacheFactory,
			$this->createMock(LoggerInterface::class),
			$this->createMock(IConfig::class),
			$this->createMock(IL10N::class),
			null,
		);

		$controller->index();

		$this->assertSame($enabled, $states['trashbin']);
	}
}
