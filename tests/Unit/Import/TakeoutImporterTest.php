<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Import;

use OC\FilesMetadata\Model\FilesMetadata;
use OCA\Photos\Import\ImportReport;
use OCA\Photos\Import\TakeoutImporter;
use OCA\Photos\Service\MediaPlaceManager;
use OCA\Photos\Service\TakeoutSidecarService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IL10N;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class TakeoutImporterTest extends TestCase {
	private IFilesMetadataManager&MockObject $filesMetadataManager;
	private TakeoutImporter $importer;

	protected function setUp(): void {
		parent::setUp();

		$this->filesMetadataManager = $this->createMock(IFilesMetadataManager::class);
		$this->filesMetadataManager->method('getMetadataForNode')->willReturnCallback(fn (File $file) => new FilesMetadata($file->getId()));

		$l10n = $this->createMock(IL10N::class);
		$l10n->method('t')->willReturnArgument(0);

		$this->importer = new TakeoutImporter($this->filesMetadataManager, $this->createMock(MediaPlaceManager::class), new TakeoutSidecarService(), $l10n);
	}

	private function createFile(int $id, string $name, string $mimeType, string $content = ''): File&MockObject {
		$file = $this->createMock(File::class);
		$file->method('getId')->willReturn($id);
		$file->method('getName')->willReturn($name);
		$file->method('getPath')->willReturn('/alice/files/Takeout/' . $name);
		$file->method('getMimeType')->willReturn($mimeType);
		$file->method('isUpdateable')->willReturn(true);
		$file->method('getSize')->willReturn(strlen($content));
		$file->method('getContent')->willReturn($content);
		return $file;
	}

	public function testReportsEachMediaFileWithALabelledOutcome(): void {
		$folder = $this->createMock(Folder::class);
		$folder->method('getDirectoryListing')->willReturn([
			$this->createFile(1, 'a.jpg', 'image/jpeg'),
			$this->createFile(2, 'a.jpg.json', 'application/json', '{"photoTakenTime":{"timestamp":"1561982400"}}'),
			$this->createFile(3, 'b.jpg', 'image/jpeg'),
		]);
		$this->filesMetadataManager->expects($this->once())->method('saveMetadata');

		$items = [];
		$report = new ImportReport(function (string $outcome, ?string $item) use (&$items): void {
			$items[] = [$outcome, $item];
		});
		$this->importer->import('alice', $folder, ['force' => false], false, $report);

		$this->assertSame([
			[TakeoutImporter::RESULT_UPDATED, '/alice/files/Takeout/a.jpg'],
			[TakeoutImporter::RESULT_NO_SIDECAR, '/alice/files/Takeout/b.jpg'],
		], $items);
		$this->assertSame(2, $report->get(TakeoutImporter::RESULT_MEDIA));

		$labels = array_merge(...array_values($this->importer->getSummaryLabels()));
		foreach (array_keys($report->getCounts()) as $outcome) {
			$this->assertArrayHasKey($outcome, $labels);
		}
	}

	public function testDeclaresTheForceOption(): void {
		$this->assertSame(['force'], array_column($this->importer->getFields(), 'id'));
	}
}
