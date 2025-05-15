<?php

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Photos\Dashboard;

use OCA\Photos\AppInfo\Application;
use OCP\AppFramework\Services\IInitialState;
use OCP\Dashboard\IIconWidget;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\Util;

class OnThisDay implements IIconWidget {
	public function __construct(
		private readonly IL10N $l,
		private readonly IURLGenerator $url,
		private readonly IInitialState $initialState,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function getId(): string {
		return 'photos-onthisday';
	}

	/**
	 * @inheritDoc
	 */
	public function getTitle(): string {
		return $this->l->t('On This Day');
	}

	/**
	 * @inheritDoc
	 */
	public function getOrder(): int {
		return 20;
	}

	/**
	 * @inheritDoc
	 */
	public function getIconClass(): string {
		return 'icon-calendar-dark';
	}

	/**
	 * @inheritDoc
	 */
	public function getIconUrl(): string {
		return $this->url->getAbsoluteURL($this->url->imagePath('core', 'places/calendar.svg'));
	}

	/**
	 * @inheritDoc
	 */
	public function getUrl(): ?string {
		return $this->url->linkToRouteAbsolute('photos.page.indexthisday');
	}

	/**
	 * @inheritDoc
	 */
	public function load(): void {
		Util::addScript('photos', 'photos-dashboard');
		Util::addStyle('photos', 'photos-dashboard');
		$this->initialState->provideInitialState('image-mimes', Application::IMAGE_MIMES);
		$this->initialState->provideInitialState('video-mimes', Application::VIDEO_MIMES);
	}
}
