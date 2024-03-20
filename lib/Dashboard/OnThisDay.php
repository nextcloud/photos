<?php

namespace OCA\Photos\Dashboard;

use OCA\Photos\AppInfo\Application;
use OCP\AppFramework\Services\IInitialState;
use OCP\Dashboard\IWidget;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\Util;

class OnThisDay implements IWidget {
	public function __construct(
		private IL10N $l,
		private IURLGenerator $url,
		private IInitialState $initialState
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function getId(): string {
		return 'photos.onthisday';
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
	public function getUrl(): ?string {
		return $this->url->linkToRoute('photos.page.indexthisday');
	}

	/**
	 * @inheritDoc
	 */
	public function load(): void {
		Util::addScript('photos', 'photos-dashboard');
		$this->initialState->provideInitialState('image-mimes', Application::IMAGE_MIMES);
		$this->initialState->provideInitialState('video-mimes', Application::VIDEO_MIMES);
	}
}
