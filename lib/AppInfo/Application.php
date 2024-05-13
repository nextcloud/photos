<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\Photos\AppInfo;

use OCA\DAV\Connector\Sabre\Principal;
use OCA\DAV\Events\SabrePluginAuthInitEvent;
use OCA\Files\Event\LoadSidebar;
use OCA\Photos\Listener\AlbumsManagementEventListener;
use OCA\Photos\Listener\CSPListener;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\LoadSidebarScripts;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCA\Photos\Listener\SabrePluginAuthInitListener;
use OCA\Photos\Listener\SizeMetadataProvider;
use OCA\Photos\Listener\TagListener;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\Files\Events\Node\NodeDeletedEvent;
use OCP\FilesMetadata\Event\MetadataBackgroundEvent;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IMetadataValueWrapper;
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
	}

	public function boot(IBootContext $context): void {
		/** @var IFilesMetadataManager $metadataManager */
		$metadataManager = $context->getServerContainer()->get(IFilesMetadataManager::class);
		$metadataManager->initMetadata('photos-original_date_time', IMetadataValueWrapper::TYPE_INT, true, IMetadataValueWrapper::EDIT_FORBIDDEN);
	}
}
