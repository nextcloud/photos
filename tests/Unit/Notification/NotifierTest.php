<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Notification;

use OCA\Photos\Notification\Notifier;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IDateTimeZone;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\L10N\IFactory;
use OCP\Notification\AlreadyProcessedException;
use OCP\Notification\IManager as INotificationManager;
use OCP\Notification\INotification;
use OCP\Notification\UnknownNotificationException;
use OCP\Server;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class NotifierTest extends TestCase {
	private IFactory&MockObject $l10nFactory;
	private IURLGenerator&MockObject $urlGenerator;
	private ITimeFactory&MockObject $timeFactory;
	private IDateTimeZone&MockObject $dateTimeZone;
	private Notifier $notifier;

	protected function setUp(): void {
		parent::setUp();

		$this->l10nFactory = $this->createMock(IFactory::class);
		$this->urlGenerator = $this->createMock(IURLGenerator::class);
		$this->timeFactory = $this->createMock(ITimeFactory::class);
		$this->dateTimeZone = $this->createMock(IDateTimeZone::class);

		$l = $this->createMock(IL10N::class);
		$l->method('t')->willReturnArgument(0);
		$l->method('n')->willReturnCallback(
			fn (string $singular, string $plural, int $count): string => str_replace('%n', (string)$count, $count === 1 ? $singular : $plural),
		);
		$this->l10nFactory->method('get')->willReturn($l);

		$this->urlGenerator->method('linkToRouteAbsolute')
			->with('photos.page.indexthisday')
			->willReturn('https://cloud.example.org/index.php/apps/photos/thisday');
		$this->urlGenerator->method('imagePath')->willReturn('/core/img/places/calendar.svg');
		$this->urlGenerator->method('getAbsoluteURL')->willReturnCallback(fn (string $url): string => 'https://cloud.example.org' . $url);

		// 2026-11-22 23:30 in UTC, already the 23rd in Berlin.
		$this->timeFactory->method('getTime')->willReturn(1795390200);
		$this->dateTimeZone->method('getTimeZone')->with(false, 'alice')->willReturn(new \DateTimeZone('Europe/Berlin'));

		$this->notifier = new Notifier($this->l10nFactory, $this->urlGenerator, $this->timeFactory, $this->dateTimeZone);
	}

	private function createNotification(array $parameters, string $app = 'photos', string $subject = 'onthisday'): INotification {
		return Server::get(INotificationManager::class)->createNotification()
			->setApp($app)
			->setUser('alice')
			->setDateTime(new \DateTime('@1795390200'))
			->setObject('onthisday', '2026-11-23')
			->setSubject($subject, $parameters);
	}

	public function testPreparesASingleYear(): void {
		$notification = $this->notifier->prepare($this->createNotification(['years' => [3], 'day' => '2026-11-23']), 'en');

		$this->assertSame('You have memories from 3 years ago', $notification->getParsedSubject());
		$this->assertSame('https://cloud.example.org/index.php/apps/photos/thisday', $notification->getLink());
		$this->assertSame('https://cloud.example.org/core/img/places/calendar.svg', $notification->getIcon());
	}

	public function testPreparesOneYearAgo(): void {
		$notification = $this->notifier->prepare($this->createNotification(['years' => [1], 'day' => '2026-11-23']), 'en');

		$this->assertSame('You have memories from 1 year ago', $notification->getParsedSubject());
	}

	public function testPreparesSeveralYears(): void {
		$notification = $this->notifier->prepare($this->createNotification(['years' => [1, 3, 6], 'day' => '2026-11-23']), 'en');

		$this->assertSame('You have memories from 3 different years on this day', $notification->getParsedSubject());
	}

	public function testDropsTheNotificationOnceTheDayIsOver(): void {
		$this->expectException(AlreadyProcessedException::class);

		$this->notifier->prepare($this->createNotification(['years' => [1], 'day' => '2026-11-22']), 'en');
	}

	public function testRejectsOtherApps(): void {
		$this->expectException(UnknownNotificationException::class);

		$this->notifier->prepare($this->createNotification(['years' => [1], 'day' => '2026-11-23'], 'files'), 'en');
	}

	public function testRejectsOtherSubjects(): void {
		$this->expectException(UnknownNotificationException::class);

		$this->notifier->prepare($this->createNotification(['years' => [1], 'day' => '2026-11-23'], 'photos', 'other'), 'en');
	}

	public function testRejectsMalformedParameters(): void {
		$this->expectException(UnknownNotificationException::class);

		$this->notifier->prepare($this->createNotification(['years' => ['x'], 'day' => '2026-11-23']), 'en');
	}

	public function testIdAndName(): void {
		$this->assertSame('photos', $this->notifier->getID());
		$this->assertSame('Photos', $this->notifier->getName());
	}
}
