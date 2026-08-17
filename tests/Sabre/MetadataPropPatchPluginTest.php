<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Sabre;

use OCA\DAV\Connector\Sabre\File;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCA\Photos\Sabre\MetadataPropPatchPlugin;
use OCA\Photos\Service\MediaPlaceManager;
use OCP\Files\FileInfo;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IFilesMetadata;
use PHPUnit\Framework\MockObject\MockObject;
use Sabre\DAV\Exception\BadRequest;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\PropPatch;
use Sabre\DAV\Server;
use Sabre\DAV\Tree;
use Sabre\DAV\Xml\Request\PropPatch as PropPatchRequest;
use Test\TestCase;

class MetadataPropPatchPluginTest extends TestCase {
	private const FILE_ID = 42;

	private IFilesMetadataManager&MockObject $filesMetadataManager;
	private MediaPlaceManager&MockObject $mediaPlaceManager;
	private IFilesMetadata&MockObject $metadata;
	private MetadataPropPatchPlugin $plugin;

	protected function setUp(): void {
		parent::setUp();

		$this->filesMetadataManager = $this->createMock(IFilesMetadataManager::class);
		$this->mediaPlaceManager = $this->createMock(MediaPlaceManager::class);
		$this->metadata = $this->createMock(IFilesMetadata::class);

		$this->filesMetadataManager->method('getMetadata')
			->with(self::FILE_ID)
			->willReturn($this->metadata);

		$this->plugin = new MetadataPropPatchPlugin(
			$this->filesMetadataManager,
			$this->mediaPlaceManager,
		);
	}

	/**
	 * Parse a PROPPATCH body the way the DAV server does, which is where the
	 * properties of the plugin are deserialized and validated.
	 *
	 * @return array<string, mixed> The requested properties, by name
	 */
	private function parseProperties(string $propertyUpdate): array {
		$server = new Server();
		$this->plugin->initialize($server);

		/** @var PropPatchRequest $request */
		$request = $server->xml->expect(
			'{DAV:}propertyupdate',
			'<?xml version="1.0"?>
			<d:propertyupdate xmlns:d="DAV:" xmlns:nc="http://nextcloud.org/ns">'
			. $propertyUpdate
			. '</d:propertyupdate>',
		);

		return $request->properties;
	}

	private function createServerForNode(bool $updateable = true): Server {
		$fileInfo = $this->createMock(FileInfo::class);
		$fileInfo->method('isUpdateable')->willReturn($updateable);

		$node = $this->createMock(File::class);
		$node->method('getFileInfo')->willReturn($fileInfo);
		$node->method('getId')->willReturn(self::FILE_ID);

		$tree = $this->createMock(Tree::class);
		$tree->method('getNodeForPath')->willReturn($node);

		$server = new Server();
		$server->tree = $tree;
		$this->plugin->initialize($server);

		return $server;
	}

	public function testReadsTheCoordinatesOfAPropPatchBody(): void {
		$properties = $this->parseProperties(
			'<d:set><d:prop>
				<nc:metadata-photos-gps>
					<nc:latitude>48.8583</nc:latitude>
					<nc:longitude>2.2945</nc:longitude>
				</nc:metadata-photos-gps>
			</d:prop></d:set>'
		);

		$this->assertEquals(
			['latitude' => 48.8583, 'longitude' => 2.2945],
			$properties[MetadataPropPatchPlugin::GPS_PROPERTYNAME],
		);
	}

	/**
	 * PROPFIND writes the coordinates without a namespace, so a client sending
	 * back what it read has to be understood as well.
	 */
	public function testReadsCoordinatesWithoutANamespace(): void {
		$properties = $this->parseProperties(
			'<d:set><d:prop>
				<nc:metadata-photos-gps>
					<latitude>-43.5</latitude>
					<longitude>5.31345</longitude>
				</nc:metadata-photos-gps>
			</d:prop></d:set>'
		);

		$this->assertEquals(
			['latitude' => -43.5, 'longitude' => 5.31345],
			$properties[MetadataPropPatchPlugin::GPS_PROPERTYNAME],
		);
	}

	/**
	 * The altitude cannot be edited, and the one of the previous position would
	 * be misleading.
	 */
	public function testDropsAnythingButTheCoordinates(): void {
		$properties = $this->parseProperties(
			'<d:set><d:prop>
				<nc:metadata-photos-gps>
					<nc:latitude>48.8583</nc:latitude>
					<nc:longitude>2.2945</nc:longitude>
					<nc:altitude>202.33</nc:altitude>
				</nc:metadata-photos-gps>
			</d:prop></d:set>'
		);

		$this->assertEquals(
			['latitude', 'longitude'],
			array_keys($properties[MetadataPropPatchPlugin::GPS_PROPERTYNAME]),
		);
	}

	public static function dataInvalidCoordinates(): array {
		return [
			'latitude out of range' => ['<nc:latitude>90.1</nc:latitude><nc:longitude>2</nc:longitude>'],
			'longitude out of range' => ['<nc:latitude>48</nc:latitude><nc:longitude>-180.1</nc:longitude>'],
			'not a number' => ['<nc:latitude>north</nc:latitude><nc:longitude>2</nc:longitude>'],
			'missing longitude' => ['<nc:latitude>48.8583</nc:latitude>'],
		];
	}

	/**
	 * @dataProvider dataInvalidCoordinates
	 */
	public function testRefusesCoordinatesWhichCannotBeRead(string $coordinates): void {
		$this->expectException(BadRequest::class);

		$this->parseProperties(
			'<d:set><d:prop><nc:metadata-photos-gps>' . $coordinates . '</nc:metadata-photos-gps></d:prop></d:set>'
		);
	}

	public function testReadsTheTakenDateAsATimestamp(): void {
		$properties = $this->parseProperties(
			'<d:set><d:prop>
				<nc:metadata-photos-original_date_time>1594762200</nc:metadata-photos-original_date_time>
			</d:prop></d:set>'
		);

		$this->assertSame(1594762200, $properties[MetadataPropPatchPlugin::ORIGINAL_DATE_TIME_PROPERTYNAME]);
	}

	public function testRefusesATakenDateWhichIsNotATimestamp(): void {
		$this->expectException(BadRequest::class);

		$this->parseProperties(
			'<d:set><d:prop>
				<nc:metadata-photos-original_date_time>2020-07-14</nc:metadata-photos-original_date_time>
			</d:prop></d:set>'
		);
	}

	public function testStoresTheCorrectedMetadata(): void {
		$this->createServerForNode();

		$this->metadata->expects($this->once())
			->method('setInt')
			->with(OriginalDateTimeMetadataProvider::METADATA_KEY, 1594762200, true);
		$this->metadata->expects($this->once())
			->method('setArray')
			->with(ExifMetadataProvider::METADATA_KEY_GPS, ['latitude' => 48.8583, 'longitude' => 2.2945]);

		// The place is derived from the coordinates, it has to follow them.
		$this->mediaPlaceManager->method('getPlaceForMetadata')->willReturn('Vanves');
		$this->metadata->expects($this->once())
			->method('setString')
			->with(PlaceMetadataProvider::METADATA_KEY, 'Vanves', true);

		$this->filesMetadataManager->expects($this->once())->method('saveMetadata')->with($this->metadata);

		$propPatch = new PropPatch([
			MetadataPropPatchPlugin::ORIGINAL_DATE_TIME_PROPERTYNAME => 1594762200,
			MetadataPropPatchPlugin::GPS_PROPERTYNAME => ['latitude' => 48.8583, 'longitude' => 2.2945],
		]);

		$this->plugin->handleUpdateProperties('photo.jpg', $propPatch);

		$this->assertTrue($propPatch->commit());
	}

	public function testRemovesTheLocationAndThePlaceItStandsFor(): void {
		$this->createServerForNode();

		$this->mediaPlaceManager->method('getPlaceForMetadata')->willReturn(null);

		$this->metadata->expects($this->exactly(2))
			->method('unset')
			->willReturnMap([
				[ExifMetadataProvider::METADATA_KEY_GPS, $this->metadata],
				[PlaceMetadataProvider::METADATA_KEY, $this->metadata],
			]);
		$this->metadata->expects($this->never())->method('setArray');

		$propPatch = new PropPatch([MetadataPropPatchPlugin::GPS_PROPERTYNAME => null]);

		$this->plugin->handleUpdateProperties('photo.jpg', $propPatch);

		$this->assertTrue($propPatch->commit());
	}

	public function testLeavesUntouchedPropertiesAlone(): void {
		$this->createServerForNode();

		$this->metadata->expects($this->once())->method('setArray');
		$this->metadata->expects($this->never())->method('setInt');

		$propPatch = new PropPatch([MetadataPropPatchPlugin::GPS_PROPERTYNAME => ['latitude' => 1.0, 'longitude' => 2.0]]);

		$this->plugin->handleUpdateProperties('photo.jpg', $propPatch);

		$this->assertTrue($propPatch->commit());
	}

	public function testRefusesToEditAPhotoWhichCannotBeWritten(): void {
		$this->createServerForNode(updateable: false);

		$this->filesMetadataManager->expects($this->never())->method('saveMetadata');

		$propPatch = new PropPatch([MetadataPropPatchPlugin::ORIGINAL_DATE_TIME_PROPERTYNAME => 1594762200]);
		$this->plugin->handleUpdateProperties('photo.jpg', $propPatch);

		$this->expectException(Forbidden::class);
		$propPatch->commit();
	}

	public function testIgnoresNodesWhichAreNotFiles(): void {
		$tree = $this->createMock(Tree::class);
		$tree->method('getNodeForPath')->willReturn(new \Sabre\DAV\SimpleCollection('albums'));

		$server = new Server();
		$server->tree = $tree;
		$this->plugin->initialize($server);

		$this->filesMetadataManager->expects($this->never())->method('saveMetadata');

		$propPatch = new PropPatch([MetadataPropPatchPlugin::ORIGINAL_DATE_TIME_PROPERTYNAME => 1594762200]);
		$this->plugin->handleUpdateProperties('albums', $propPatch);

		// Nothing handled the property, so the update is reported as failed.
		$this->assertFalse($propPatch->commit());
	}
}
