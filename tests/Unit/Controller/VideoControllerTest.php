<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Controller;

use OCA\Photos\Controller\VideoController;
use OCA\Photos\Service\VideoRenditionService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\StreamResponse;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\IUserFolder;
use OCP\Files\Node;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\Storage\ISharedStorage;
use OCP\Files\Storage\IStorage;
use OCP\IRequest;
use OCP\IUser;
use OCP\IUserSession;
use OCP\Share\IAttributes;
use OCP\Share\IShare;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class VideoControllerTest extends TestCase {
	private IUserSession&MockObject $userSession;
	private IRootFolder&MockObject $rootFolder;
	private IUserFolder&MockObject $userFolder;
	private VideoRenditionService&MockObject $renditionService;
	private VideoController $controller;

	protected function setUp(): void {
		parent::setUp();

		$user = $this->createMock(IUser::class);
		$user->method('getUID')->willReturn('alice');
		$this->userSession = $this->createMock(IUserSession::class);
		$this->userSession->method('getUser')->willReturn($user);

		$this->userFolder = $this->createMock(IUserFolder::class);
		$this->rootFolder = $this->createMock(IRootFolder::class);
		$this->rootFolder->method('getUserFolder')->with('alice')->willReturn($this->userFolder);

		$this->renditionService = $this->createMock(VideoRenditionService::class);

		$this->controller = new VideoController(
			$this->createMock(IRequest::class),
			$this->userSession,
			$this->rootFolder,
			$this->renditionService,
		);
	}

	public function testNotFoundWhenDisabled(): void {
		$this->renditionService->method('isEnabled')->willReturn(false);
		$this->rootFolder->expects($this->never())->method('getUserFolder');

		$this->assertSame(Http::STATUS_NOT_FOUND, $this->controller->rendition(42)->getStatus());
	}

	public function testNotFoundWithoutUser(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$userSession = $this->createMock(IUserSession::class);
		$controller = new VideoController($this->createMock(IRequest::class), $userSession, $this->rootFolder, $this->renditionService);
		$this->rootFolder->expects($this->never())->method('getUserFolder');

		$this->assertSame(Http::STATUS_NOT_FOUND, $controller->rendition(42)->getStatus());
	}

	public function testNotFoundForFilesOutsideTheUserFolder(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$this->userFolder->method('getFirstNodeById')->with(42)->willReturn(null);
		$this->renditionService->expects($this->never())->method('getRendition');
		$this->renditionService->expects($this->never())->method('queue');

		$this->assertSame(Http::STATUS_NOT_FOUND, $this->controller->rendition(42)->getStatus());
	}

	public function testNotFoundForFolders(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$this->userFolder->method('getFirstNodeById')->willReturn($this->createMock(Folder::class));
		$this->renditionService->expects($this->never())->method('queue');

		$this->assertSame(Http::STATUS_NOT_FOUND, $this->controller->rendition(42)->getStatus());
	}

	public function testNotFoundForFilesWhichAreNotVideos(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$this->userFolder->method('getFirstNodeById')->willReturn($this->createVideo(mimeType: 'image/jpeg'));
		$this->renditionService->expects($this->never())->method('queue');

		$this->assertSame(Http::STATUS_NOT_FOUND, $this->controller->rendition(42)->getStatus());
	}

	public function testNotFoundForUnreadableFiles(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$this->userFolder->method('getFirstNodeById')->willReturn($this->createVideo(readable: false));
		$this->renditionService->expects($this->never())->method('getRendition');
		$this->renditionService->expects($this->never())->method('queue');

		$this->assertSame(Http::STATUS_NOT_FOUND, $this->controller->rendition(42)->getStatus());
	}

	public function testNotFoundForSharesWithoutDownload(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$this->userFolder->method('getFirstNodeById')->willReturn($this->createVideo(download: false));
		$this->renditionService->expects($this->never())->method('getRendition');
		$this->renditionService->expects($this->never())->method('queue');

		$this->assertSame(Http::STATUS_NOT_FOUND, $this->controller->rendition(42)->getStatus());
	}

	public function testQueuesTheConversionOfVideosWithoutRendition(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$file = $this->createVideo(download: true);
		$this->userFolder->method('getFirstNodeById')->willReturn($file);
		$this->renditionService->method('getRendition')->willReturn(null);
		$this->renditionService->method('isUnconvertible')->willReturn(false);
		$this->renditionService->expects($this->once())->method('queue')->with('alice', $file);

		$this->assertSame(Http::STATUS_NOT_FOUND, $this->controller->rendition(42)->getStatus());
	}

	public function testDoesNotQueueUnconvertibleVideosAgain(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$this->userFolder->method('getFirstNodeById')->willReturn($this->createVideo());
		$this->renditionService->method('getRendition')->willReturn(null);
		$this->renditionService->method('isUnconvertible')->willReturn(true);
		$this->renditionService->expects($this->never())->method('queue');

		$this->assertSame(Http::STATUS_NOT_FOUND, $this->controller->rendition(42)->getStatus());
	}

	public function testStreamsTheRendition(): void {
		$this->renditionService->method('isEnabled')->willReturn(true);
		$this->userFolder->method('getFirstNodeById')->willReturn($this->createVideo());
		$rendition = $this->createMock(ISimpleFile::class);
		$rendition->method('read')->willReturn(fopen('php://memory', 'rb'));
		$rendition->method('getSize')->willReturn(1234);
		$this->renditionService->method('getRendition')->willReturn($rendition);
		$this->renditionService->expects($this->never())->method('queue');

		$response = $this->controller->rendition(42);

		$this->assertInstanceOf(StreamResponse::class, $response);
		$this->assertSame(Http::STATUS_OK, $response->getStatus());
		$this->assertSame('video/mp4', $response->getHeaders()['Content-Type']);
		$this->assertSame('1234', $response->getHeaders()['Content-Length']);
	}

	/**
	 * @param bool|null $download Download permission of the share holding the
	 *                            video, null for a video of the user
	 */
	private function createVideo(string $mimeType = 'video/quicktime', bool $readable = true, ?bool $download = null): Node&MockObject {
		if ($download === null) {
			$storage = $this->createMock(IStorage::class);
			$storage->method('instanceOfStorage')->willReturn(false);
		} else {
			$attributes = $this->createMock(IAttributes::class);
			$attributes->method('getAttribute')->with('permissions', 'download')->willReturn($download);
			$share = $this->createMock(IShare::class);
			$share->method('getAttributes')->willReturn($attributes);
			$storage = $this->createMock(ISharedStorage::class);
			$storage->method('instanceOfStorage')->with(ISharedStorage::class)->willReturn(true);
			$storage->method('getShare')->willReturn($share);
		}

		$file = $this->createMock(File::class);
		$file->method('getId')->willReturn(42);
		$file->method('getMimetype')->willReturn($mimeType);
		$file->method('isReadable')->willReturn($readable);
		$file->method('getStorage')->willReturn($storage);
		return $file;
	}
}
