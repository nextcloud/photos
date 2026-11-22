<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Listener;

use OCA\Photos\Listener\AddedByMetadataProvider;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\FilesMetadata\Event\MetadataLiveEvent;
use OCP\FilesMetadata\Model\IFilesMetadata;
use OCP\IUser;
use OCP\IUserSession;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class AddedByMetadataProviderTest extends TestCase {
	private IUserSession&MockObject $userSession;
	private IFilesMetadata&MockObject $metadata;
	private AddedByMetadataProvider $provider;

	protected function setUp(): void {
		parent::setUp();

		$this->userSession = $this->createMock(IUserSession::class);
		$this->metadata = $this->createMock(IFilesMetadata::class);
		$this->provider = new AddedByMetadataProvider($this->userSession);
	}

	private function signIn(?string $userId): void {
		$user = null;
		if ($userId !== null) {
			$user = $this->createMock(IUser::class);
			$user->method('getUID')->willReturn($userId);
		}

		$this->userSession->method('getUser')->willReturn($user);
	}

	private function createFile(string $mimeType): File&MockObject {
		$file = $this->createMock(File::class);
		$file->method('getMimeType')->willReturn($mimeType);

		return $file;
	}

	private function handle(Node $node): void {
		$this->provider->handle(new MetadataLiveEvent($node, $this->metadata));
	}

	public function testRecordsTheUserAddingAPhoto(): void {
		$this->signIn('alice');
		$this->metadata->method('getKeys')->willReturn([]);

		$this->metadata->expects($this->once())
			->method('setString')
			->with(AddedByMetadataProvider::METADATA_KEY, 'alice');

		$this->handle($this->createFile('image/jpeg'));
	}

	public function testRecordsTheUserAddingAVideo(): void {
		$this->signIn('alice');
		$this->metadata->method('getKeys')->willReturn([]);

		$this->metadata->expects($this->once())
			->method('setString')
			->with(AddedByMetadataProvider::METADATA_KEY, 'alice');

		$this->handle($this->createFile('video/mp4'));
	}

	public function testKeepsTheMetadataOfAnExistingFile(): void {
		$this->signIn('bob');
		$this->metadata->method('getKeys')->willReturn(['photos-size']);

		$this->metadata->expects($this->never())->method('setString');

		$this->handle($this->createFile('image/jpeg'));
	}

	public function testIgnoresFilesWrittenWithoutASession(): void {
		$this->signIn(null);
		$this->metadata->method('getKeys')->willReturn([]);

		$this->metadata->expects($this->never())->method('setString');

		$this->handle($this->createFile('image/jpeg'));
	}

	public function testIgnoresOtherFiles(): void {
		$this->signIn('alice');
		$this->metadata->method('getKeys')->willReturn([]);

		$this->metadata->expects($this->never())->method('setString');

		$this->handle($this->createFile('text/plain'));
		$this->handle($this->createMock(Folder::class));
	}
}
