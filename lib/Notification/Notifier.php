<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Notification;

use DateTimeImmutable;
use OCA\Photos\AppInfo\Application;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IDateTimeZone;
use OCP\IURLGenerator;
use OCP\L10N\IFactory;
use OCP\Notification\AlreadyProcessedException;
use OCP\Notification\INotification;
use OCP\Notification\INotifier;
use OCP\Notification\UnknownNotificationException;

class Notifier implements INotifier {
	public function __construct(
		private readonly IFactory $l10nFactory,
		private readonly IURLGenerator $urlGenerator,
		private readonly ITimeFactory $timeFactory,
		private readonly IDateTimeZone $dateTimeZone,
	) {
	}

	#[\Override]
	public function getID(): string {
		return Application::APP_ID;
	}

	#[\Override]
	public function getName(): string {
		return $this->l10nFactory->get(Application::APP_ID)->t('Photos');
	}

	#[\Override]
	public function prepare(INotification $notification, string $languageCode): INotification {
		if ($notification->getApp() !== Application::APP_ID || $notification->getSubject() !== 'onthisday') {
			throw new UnknownNotificationException();
		}

		$parameters = $notification->getSubjectParameters();
		$years = $parameters['years'] ?? null;
		if (!is_array($years) || $years === [] || !array_is_list($years)) {
			throw new UnknownNotificationException();
		}
		foreach ($years as $year) {
			if (!is_int($year)) {
				throw new UnknownNotificationException();
			}
		}

		// The memories are only about the day they were found on.
		$today = (new DateTimeImmutable('@' . $this->timeFactory->getTime()))
			->setTimezone($this->dateTimeZone->getTimeZone(false, $notification->getUser()))
			->format('Y-m-d');
		if (($parameters['day'] ?? null) !== $today) {
			throw new AlreadyProcessedException();
		}

		$l = $this->l10nFactory->get(Application::APP_ID, $languageCode);
		$subject = count($years) === 1
			? $l->n('You have memories from %n year ago', 'You have memories from %n years ago', (int)$years[0])
			: $l->n('You have memories from %n year on this day', 'You have memories from %n different years on this day', count($years));

		$notification->setParsedSubject($subject)
			->setLink($this->urlGenerator->linkToRouteAbsolute('photos.page.indexthisday'))
			->setIcon($this->urlGenerator->getAbsoluteURL($this->urlGenerator->imagePath('core', 'places/calendar.svg')));

		return $notification;
	}
}
