<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Controller;

use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Controller\PublicAlbumController;
use OCA\Photos\Exception\GuestUploadException;
use OCA\Photos\Service\GuestUploadService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Services\IInitialState;
use OCP\IL10N;
use OCP\IRequest;
use OCP\Security\RateLimiting\ILimiter;
use OCP\Security\RateLimiting\IRateLimitExceededException;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class PublicAlbumControllerTest extends TestCase {
	private IRequest&MockObject $request;
	private AlbumMapper&MockObject $albumMapper;
	private GuestUploadService&MockObject $guestUploadService;
	private ILimiter&MockObject $limiter;
	private PublicAlbumController $controller;
	private AlbumInfo $album;
	private array $upload = ['name' => 'a.jpg', 'tmp_name' => '/tmp/x', 'error' => UPLOAD_ERR_OK];

	protected function setUp(): void {
		parent::setUp();

		$this->request = $this->createMock(IRequest::class);
		$this->request->method('getRemoteAddress')->willReturn('192.0.2.1');
		$this->albumMapper = $this->createMock(AlbumMapper::class);
		$this->guestUploadService = $this->createMock(GuestUploadService::class);
		$this->limiter = $this->createMock(ILimiter::class);
		$l = $this->createMock(IL10N::class);
		$l->method('t')->willReturnArgument(0);

		$this->controller = new PublicAlbumController(
			$this->request,
			$this->createMock(IInitialState::class),
			$this->albumMapper,
			$this->guestUploadService,
			$this->limiter,
			$l,
		);

		$this->album = new AlbumInfo(7, 'owner', 'Wedding', '', 0, -1);
	}

	private function linkResolvesTo(?AlbumInfo $album, bool $guestUpload = true): void {
		$this->albumMapper->method('getSharedAlbumsForCollaborator')
			->with('token', AlbumMapper::TYPE_LINK)
			->willReturn($album === null ? [] : [new AlbumInfo(7, 'owner', 'Wedding (owner)', '', 0, -1)]);
		$this->albumMapper->method('get')->with(7)->willReturn($album);
		$this->albumMapper->method('isGuestUploadAllowed')->with(7)->willReturn($guestUpload);
	}

	public function testUploadsToTheLinkedAlbum(): void {
		$this->linkResolvesTo($this->album);
		$this->request->method('getUploadedFile')->with('file')->willReturn($this->upload);
		$this->guestUploadService->expects($this->once())
			->method('upload')
			->with($this->album, $this->upload, 'Anna')
			->willReturn(42);

		$response = $this->controller->upload('token', 'Anna');

		$this->assertSame(Http::STATUS_CREATED, $response->getStatus());
		$this->assertSame(['fileId' => 42], $response->getData());
	}

	public function testWrongTokenIsThrottled(): void {
		$this->linkResolvesTo(null);
		$this->guestUploadService->expects($this->never())->method('upload');

		$response = $this->controller->upload('token');

		$this->assertSame(Http::STATUS_NOT_FOUND, $response->getStatus());
		$this->assertTrue($response->isThrottled());
	}

	public function testEmptyTokenIsThrottled(): void {
		$this->albumMapper->expects($this->never())->method('getSharedAlbumsForCollaborator');

		$response = $this->controller->upload('');

		$this->assertSame(Http::STATUS_NOT_FOUND, $response->getStatus());
		$this->assertTrue($response->isThrottled());
	}

	public function testAlbumWithoutGuestUploadsRefuses(): void {
		$this->linkResolvesTo($this->album, false);
		$this->request->method('getUploadedFile')->willReturn($this->upload);
		$this->guestUploadService->expects($this->never())->method('upload');

		$response = $this->controller->upload('token');

		$this->assertSame(Http::STATUS_FORBIDDEN, $response->getStatus());
		$this->assertFalse($response->isThrottled());
	}

	public function testRateLimitIsCheckedFirst(): void {
		$this->limiter->expects($this->once())
			->method('registerAnonRequest')
			->with('photos-guest-upload-token', PublicAlbumController::GUEST_UPLOAD_LIMIT, PublicAlbumController::GUEST_UPLOAD_PERIOD, '192.0.2.1')
			->willThrowException(new class extends \Exception implements IRateLimitExceededException {
			});
		$this->albumMapper->expects($this->never())->method('getSharedAlbumsForCollaborator');
		$this->guestUploadService->expects($this->never())->method('upload');

		$response = $this->controller->upload('token');

		$this->assertSame(Http::STATUS_TOO_MANY_REQUESTS, $response->getStatus());
	}

	public function testMissingFileIsRejected(): void {
		$this->linkResolvesTo($this->album);
		$this->request->method('getUploadedFile')->willReturn(null);
		$this->guestUploadService->expects($this->never())->method('upload');

		$response = $this->controller->upload('token');

		$this->assertSame(Http::STATUS_BAD_REQUEST, $response->getStatus());
	}

	public function testRejectedUploadKeepsItsStatus(): void {
		$this->linkResolvesTo($this->album);
		$this->request->method('getUploadedFile')->willReturn($this->upload);
		$this->guestUploadService->method('upload')
			->willThrowException(new GuestUploadException('Only photos and videos can be added.', Http::STATUS_UNSUPPORTED_MEDIA_TYPE));

		$response = $this->controller->upload('token');

		$this->assertSame(Http::STATUS_UNSUPPORTED_MEDIA_TYPE, $response->getStatus());
		$this->assertSame(['message' => 'Only photos and videos can be added.'], $response->getData());
	}
}
