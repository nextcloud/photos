<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Import;

use OC\FilesMetadata\Model\FilesMetadata;
use OCA\Photos\Album\AlbumInfo;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\Import\ICloudImporter;
use OCA\Photos\Import\ImportReport;
use OCA\Photos\Service\ICloudExportService;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\IL10N;
use OCP\ITagManager;
use OCP\ITags;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class ICloudImporterTest extends TestCase {
	private ICloudImporter $importer;

	protected function setUp(): void {
		parent::setUp();

		$filesMetadataManager = $this->createMock(IFilesMetadataManager::class);
		$filesMetadataManager->method('getMetadataForNode')->willReturnCallback(fn (File $file) => new FilesMetadata($file->getId()));

		$tags = $this->createMock(ITags::class);
		$tags->method('getFavorites')->willReturn([]);
		$tagManager = $this->createMock(ITagManager::class);
		$tagManager->method('load')->willReturn($tags);

		$albumMapper = $this->createMock(AlbumMapper::class);
		$albumMapper->method('create')->willReturn(new AlbumInfo(1, 'alice', 'Summer', '', 0, -1));

		$l10n = $this->createMock(IL10N::class);
		$l10n->method('t')->willReturnArgument(0);

		$this->importer = new ICloudImporter($filesMetadataManager, $tagManager, $albumMapper, new ICloudExportService(), $l10n);
	}

	private function createFile(string $name, string $mimeType, string $content = ''): File&MockObject {
		static $id = 0;
		$file = $this->createMock(File::class);
		$file->method('getId')->willReturn(++$id);
		$file->method('getName')->willReturn($name);
		$file->method('getPath')->willReturn('/alice/files/iCloud/' . $name);
		$file->method('getMimeType')->willReturn($mimeType);
		$file->method('isUpdateable')->willReturn(true);
		$file->method('getSize')->willReturn(strlen($content));
		$file->method('getContent')->willReturn($content);
		return $file;
	}

	private function createFolder(string $name, array $nodes): Folder&MockObject {
		$folder = $this->createMock(Folder::class);
		$folder->method('getName')->willReturn($name);
		$folder->method('getPath')->willReturn('/alice/files/' . $name);
		$folder->method('getDirectoryListing')->willReturn($nodes);
		foreach ($nodes as $node) {
			if ($node instanceof File) {
				$node->method('getParent')->willReturn($folder);
			}
		}
		return $folder;
	}

	public function testReportsLabelledOutcomesWithTheirItems(): void {
		$folder = $this->createFolder('iCloud', [
			$this->createFolder('Photos', [
				$this->createFile('IMG_0001.JPG', 'image/jpeg'),
				$this->createFile('Photo Details.csv', 'text/csv', "imgName,favorite,hidden,deleted,originalCreationDate\n"
					. "IMG_0001.JPG,yes,no,no,\"Saturday June 4,2022 12:11 PM GMT\"\n"
					. "IMG_0404.JPG,no,no,no,\"Saturday June 4,2022 12:11 PM GMT\"\n"),
			]),
			$this->createFolder('Albums', [
				$this->createFile('Summer.csv', 'text/csv', "imgName\nIMG_0001.JPG\nIMG_0405.JPG\n"),
			]),
		]);

		$items = [];
		$report = new ImportReport(function (string $outcome, ?string $item) use (&$items): void {
			$items[] = [$outcome, $item];
		});
		$this->importer->import('alice', $folder, [], false, $report);

		$this->assertSame([
			['details_without_file', 'IMG_0404.JPG'],
			['date', '/alice/files/iCloud/IMG_0001.JPG'],
			['favorite', '/alice/files/iCloud/IMG_0001.JPG'],
			['member_not_found', 'IMG_0405.JPG'],
			['album_created', 'Summer'],
			['album_file', '/alice/files/iCloud/IMG_0001.JPG'],
		], $items);
		$this->assertSame(1, $report->get('media'));
		$this->assertSame(1, $report->get('details'));

		$labels = array_merge(...array_values($this->importer->getSummaryLabels()));
		foreach (array_keys($report->getCounts()) as $outcome) {
			$this->assertArrayHasKey($outcome, $labels);
		}
	}
}
