<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\AppInfo;

use OCA\DAV\Connector\Sabre\Principal;
use OCA\DAV\Events\SabrePluginAuthInitEvent;
use OCA\Files\Event\LoadSidebar;
use OCA\Photos\Dashboard\OnThisDay;
use OCA\Photos\Listener\AlbumsManagementEventListener;
use OCA\Photos\Listener\CSPListener;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\LoadSidebarScripts;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Listener\PhotoIndexNodeListener;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCA\Photos\Listener\SabrePluginAuthInitListener;
use OCA\Photos\Listener\SizeMetadataProvider;
use OCA\Photos\Listener\TagListener;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\Files\Events\Node\NodeCreatedEvent;
use OCP\Files\Events\Node\NodeDeletedEvent;
use OCP\Files\Events\Node\NodeRenamedEvent;
use OCP\Files\Events\Node\NodeWrittenEvent;
use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use OCP\Group\Events\GroupDeletedEvent;
use OCP\Group\Events\UserRemovedEvent;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;
use OCP\Share\Events\ShareDeletedEvent;
use OCP\SystemTag\MapperEvent;
use OCP\User\Events\UserDeletedEvent;

class Application extends App implements IBootstrap {
	public const APP_ID = 'photos';

	public const IMAGE_MIMES = [
		'image/png',
		'image/jpeg',
		'image/heic',
		'image/webp',
		// 'image/gif',			// too rarely used for photos
		// 'image/x-xbitmap',	// too rarely used for photos
		// 'image/bmp',			// too rarely used for photos
		// 'image/svg+xml',		// too rarely used for photos
	];

	public const VIDEO_MIMES = [
		// 'video/mpeg',		// too rarely used for photos
		// 'video/ogg',			// too rarely used for photos
		// 'video/webm',		// too rarely used for photos
		'video/mp4',
		// 'video/x-m4v',		// too rarely used for photos
		'video/quicktime',
		// 'video/x-matroska'	// too rarely used for photos
	];

	public function __construct() {
		parent::__construct(self::APP_ID);
	}

	public function register(IRegistrationContext $context): void {
		$context->registerDashboardWidget(OnThisDay::class);
		/** Register $principalBackend for the DAV collection */
		$context->registerServiceAlias('principalBackend', Principal::class);

		$context->registerEventListener(LoadSidebar::class, LoadSidebarScripts::class);

		$context->registerEventListener(AddContentSecurityPolicyEvent::class, CSPListener::class);

		// Metadata
		$context->registerEventListener(MetadataLiveEvent::class, ExifMetadataProvider::class);
		$context->registerEventListener(MetadataBackgroundEvent::class, ExifMetadataProvider::class);
		// SizeMetadataProvider optionally depends on ExifMetadataProvider, so it has to be registered afterwards
		$context->registerEventListener(MetadataLiveEvent::class, SizeMetadataProvider::class);
		$context->registerEventListener(MetadataBackgroundEvent::class, SizeMetadataProvider::class);
		$context->registerEventListener(MetadataLiveEvent::class, OriginalDateTimeMetadataProvider::class);
		$context->registerEventListener(MetadataBackgroundEvent::class, OriginalDateTimeMetadataProvider::class);
		$context->registerEventListener(MetadataLiveEvent::class, PlaceMetadataProvider::class);
		$context->registerEventListener(MetadataBackgroundEvent::class, PlaceMetadataProvider::class);

		$context->registerEventListener(NodeDeletedEvent::class, AlbumsManagementEventListener::class);
		$context->registerEventListener(UserRemovedEvent::class, AlbumsManagementEventListener::class);
		$context->registerEventListener(GroupDeletedEvent::class, AlbumsManagementEventListener::class);
		$context->registerEventListener(UserDeletedEvent::class, AlbumsManagementEventListener::class);
		$context->registerEventListener(ShareDeletedEvent::class, AlbumsManagementEventListener::class);

		$context->registerEventListener(SabrePluginAuthInitEvent::class, SabrePluginAuthInitListener::class);

		$context->registerEventListener(MapperEvent::EVENT_ASSIGN, TagListener::class);
		$context->registerEventListener(MapperEvent::EVENT_UNASSIGN, TagListener::class);

		// Photo index: keep `oc_photos_index` in sync on every file
		// mutation. NodeDeleted is shared with AlbumsManagementEventListener
		// — both run on the same event without ordering issues.
		$context->registerEventListener(NodeCreatedEvent::class, PhotoIndexNodeListener::class);
		$context->registerEventListener(NodeWrittenEvent::class, PhotoIndexNodeListener::class);
		$context->registerEventListener(NodeRenamedEvent::class, PhotoIndexNodeListener::class);
		$context->registerEventListener(NodeDeletedEvent::class, PhotoIndexNodeListener::class);
	}

	public function boot(IBootContext $context): void {
	}
}
