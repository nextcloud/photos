<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Service;

use OCA\Photos\DB\Place\PlaceMapper;
use OCA\Photos\Listener\ExifMetadataProvider;
use OCA\Photos\Listener\PlaceMetadataProvider;
use OCA\Photos\Service\MediaPlaceManager;
use OCA\Photos\Service\ReverseGeoCoderService;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IFilesMetadata;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class MediaPlaceManagerTest extends TestCase {
	private ReverseGeoCoderService&MockObject $rgcService;
	private IFilesMetadata&MockObject $metadata;
	private MediaPlaceManager $manager;

	protected function setUp(): void {
		parent::setUp();

		$this->rgcService = $this->createMock(ReverseGeoCoderService::class);
		$this->rgcService->method('arePlacesEnabled')->willReturn(true);
		$this->metadata = $this->createMock(IFilesMetadata::class);

		$this->manager = new MediaPlaceManager(
			$this->createMock(IFilesMetadataManager::class),
			$this->rgcService,
			$this->createMock(PlaceMapper::class),
		);
	}

	private function withCoordinates(): void {
		$this->metadata->method('hasKey')->with(ExifMetadataProvider::METADATA_KEY_GPS)->willReturn(true);
		$this->metadata->method('getArray')
			->with(ExifMetadataProvider::METADATA_KEY_GPS)
			->willReturn(['latitude' => 48.8583, 'longitude' => 2.2945]);
	}

	public function testStoresThePlaceAndItsCountry(): void {
		$this->withCoordinates();
		$this->rgcService->method('getPlaceForCoordinates')
			->with(48.8583, 2.2945)
			->willReturn(['name' => 'Paris', 'countryCode' => 'FR']);

		$stored = [];
		$this->metadata->expects($this->exactly(2))
			->method('setString')
			->willReturnCallback(function (string $key, string $value, bool $index) use (&$stored): IFilesMetadata {
				$stored[$key] = [$value, $index];
				return $this->metadata;
			});
		$this->metadata->expects($this->never())->method('unset');

		$this->assertTrue($this->manager->setPlaceForMetadata($this->metadata));
		$this->assertSame([
			PlaceMetadataProvider::METADATA_KEY => ['Paris', true],
			PlaceMetadataProvider::METADATA_KEY_COUNTRY => ['FR', true],
		], $stored);
	}

	public function testDropsAStaleCountryWhenTheCityHasNone(): void {
		$this->withCoordinates();
		$this->rgcService->method('getPlaceForCoordinates')
			->willReturn(['name' => 'Paris', 'countryCode' => '']);

		$this->metadata->expects($this->once())
			->method('setString')
			->with(PlaceMetadataProvider::METADATA_KEY, 'Paris', true);
		$this->metadata->expects($this->once())
			->method('unset')
			->with(PlaceMetadataProvider::METADATA_KEY_COUNTRY);

		$this->assertTrue($this->manager->setPlaceForMetadata($this->metadata));
	}

	public function testLeavesTheMetadataAloneWithoutCoordinates(): void {
		$this->metadata->method('hasKey')->willReturn(false);
		$this->rgcService->expects($this->never())->method('getPlaceForCoordinates');
		$this->metadata->expects($this->never())->method('setString');
		$this->metadata->expects($this->never())->method('unset');

		$this->assertFalse($this->manager->setPlaceForMetadata($this->metadata));
	}
}
