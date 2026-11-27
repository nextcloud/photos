<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Service;

use OCA\Photos\Service\TakeoutSidecarService;
use Test\TestCase;

class TakeoutSidecarServiceTest extends TestCase {
	private TakeoutSidecarService $service;

	protected function setUp(): void {
		parent::setUp();

		$this->service = new TakeoutSidecarService();
	}

	/**
	 * @param list<string> $siblingNames
	 */
	private function findSidecar(string $mediaName, array $siblingNames): ?string {
		return $this->service->findSidecar($mediaName, $this->service->indexSidecars([$mediaName, ...$siblingNames]));
	}

	public static function dataFindSidecar(): array {
		$longName = 'Screenshot_20190714-201508_Some Long App Name.png';
		$longName2 = 'Screenshot_20190714-201508_Some Long App Nam2.png';
		$longBaseName = 'PXL_20230518_150722964_A Very Long Description Of It';

		return [
			'classic' => ['IMG_1234.jpg', ['IMG_1234.jpg.json'], 'IMG_1234.jpg.json'],
			'supplemental metadata' => ['IMG_1234.jpg', ['IMG_1234.jpg.supplemental-metadata.json'], 'IMG_1234.jpg.supplemental-metadata.json'],
			'truncated supplemental metadata' => [
				'IMG_20180805_142839.jpg',
				['IMG_20180805_142839.jpg.supplemental-metada.json'],
				'IMG_20180805_142839.jpg.supplemental-metada.json',
			],
			'supplemental metadata truncated to its first letter' => [
				'PXL_20230518_150722964.NIGHT.jpg',
				['PXL_20230518_150722964.NIGHT.jpg.s.json'],
				'PXL_20230518_150722964.NIGHT.jpg.s.json',
			],
			'video' => ['VID_20200101_101010.mp4', ['VID_20200101_101010.mp4.json'], 'VID_20200101_101010.mp4.json'],
			'upper case extension' => ['IMG_1234.JPG', ['IMG_1234.JPG.json'], 'IMG_1234.JPG.json'],
			'extension left out' => ['IMG_1234.jpg', ['IMG_1234.json'], 'IMG_1234.json'],
			'copy, suffix moved after the extension' => [
				'IMG_1234(1).jpg',
				['IMG_1234.jpg.json', 'IMG_1234.jpg(1).json'],
				'IMG_1234.jpg(1).json',
			],
			'copy, supplemental metadata' => [
				'IMG_1234(2).jpg',
				['IMG_1234.jpg.supplemental-metadata.json', 'IMG_1234.jpg.supplemental-metadata(2).json'],
				'IMG_1234.jpg.supplemental-metadata(2).json',
			],
			'copy, truncated supplemental metadata' => [
				'IMG_20180805_142839(1).jpg',
				['IMG_20180805_142839.jpg.supplemental-met(1).json'],
				'IMG_20180805_142839.jpg.supplemental-met(1).json',
			],
			'copy, suffix kept in place' => [
				'IMG_1234(1).jpg',
				['IMG_1234.jpg.json', 'IMG_1234(1).jpg.json'],
				'IMG_1234(1).jpg.json',
			],
			'copy does not use the sidecar of the original' => ['IMG_1234(1).jpg', ['IMG_1234.jpg.json'], null],
			'original does not use the sidecar of a copy' => ['IMG_1234.jpg', ['IMG_1234.jpg(1).json'], null],
			'long name, truncated' => [$longName, [mb_substr($longName, 0, 46) . '.json'], mb_substr($longName, 0, 46) . '.json'],
			'long name, truncated supplemental metadata' => [
				$longName,
				[mb_substr($longName . '.supplemental-metadata', 0, 46) . '.json'],
				mb_substr($longName . '.supplemental-metadata', 0, 46) . '.json',
			],
			'long name, truncated copy' => [
				'Screenshot_20190714-201508_Some Long App Name(1).png',
				[mb_substr($longName, 0, 46) . '.json', mb_substr($longName, 0, 46) . '(1).json'],
				mb_substr($longName, 0, 46) . '(1).json',
			],
			'long name copy, copy suffix truncated away' => [
				$longBaseName . '(1).jpg',
				[$longBaseName . '.jpg', mb_substr($longBaseName, 0, 46) . '.json', mb_substr($longBaseName, 0, 46) . '(1).json'],
				mb_substr($longBaseName, 0, 46) . '(1).json',
			],
			'long name copy without own sidecar' => [
				$longBaseName . '(1).jpg',
				[mb_substr($longBaseName, 0, 46) . '.json'],
				mb_substr($longBaseName, 0, 46) . '.json',
			],
			'long name, truncated at the first differing character' => [
				$longName2,
				[mb_substr($longName, 0, 46) . '.json', mb_substr($longName2, 0, 47) . '.json'],
				mb_substr($longName2, 0, 47) . '.json',
			],
			'long multibyte name, truncated by characters' => [
				'Sommerfest_2019_Grillabend_mit_Größeren_Überraschungen.jpg',
				['Sommerfest_2019_Grillabend_mit_Größeren_Überr.json'],
				'Sommerfest_2019_Grillabend_mit_Größeren_Überr.json',
			],
			'short prefix is no truncated name' => ['IMG_1234_long_name.jpg', ['IMG_1234.json'], null],
			'edited' => ['IMG_1234-edited.jpg', ['IMG_1234.jpg.json'], 'IMG_1234.jpg.json'],
			'edited, own sidecar' => [
				'IMG_1234-edited.jpg',
				['IMG_1234.jpg.json', 'IMG_1234-edited.jpg.json'],
				'IMG_1234-edited.jpg.json',
			],
			'edited, localized' => ['IMG_1234-bearbeitet.jpg', ['IMG_1234.jpg.supplemental-metadata.json'], 'IMG_1234.jpg.supplemental-metadata.json'],
			'edited copy' => ['IMG_1234-edited(1).jpg', ['IMG_1234.jpg.json', 'IMG_1234.jpg(1).json'], 'IMG_1234.jpg(1).json'],
			'live photo video' => ['IMG_1234.MP4', ['IMG_1234.HEIC', 'IMG_1234.HEIC.json'], 'IMG_1234.HEIC.json'],
			'live photo video, own sidecar first' => ['IMG_1234.MOV', ['IMG_1234.HEIC.json', 'IMG_1234.MOV.json'], 'IMG_1234.MOV.json'],
			'live photo video, lower case' => ['IMG_1234.mov', ['IMG_1234.jpg.supplemental-metadata.json'], 'IMG_1234.jpg.supplemental-metadata.json'],
			'picture does not use the sidecar of another picture' => ['IMG_1234.png', ['IMG_1234.jpg.json'], null],
			'other file' => ['IMG_1234.jpg', ['IMG_1235.jpg.json', 'IMG_123.jpg.json', 'metadata.json'], null],
			'no sidecar' => ['IMG_1234.jpg', ['IMG_1234.png'], null],
			'empty folder' => ['IMG_1234.jpg', [], null],
		];
	}

	/**
	 * @dataProvider dataFindSidecar
	 * @param list<string> $siblingNames
	 */
	public function testFindSidecar(string $mediaName, array $siblingNames, ?string $expected): void {
		$this->assertSame($expected, $this->findSidecar($mediaName, $siblingNames));
	}

	public function testFindSidecarIgnoresTheOrderOfTheFiles(): void {
		$names = ['IMG_1234.jpg(1).json', 'IMG_1234.jpg.json', 'IMG_1234(1).jpg', 'IMG_1234.jpg'];

		$sidecars = $this->service->indexSidecars($names);
		$this->assertSame('IMG_1234.jpg.json', $this->service->findSidecar('IMG_1234.jpg', $sidecars));
		$this->assertSame('IMG_1234.jpg(1).json', $this->service->findSidecar('IMG_1234(1).jpg', $sidecars));

		$sidecars = $this->service->indexSidecars(array_reverse($names));
		$this->assertSame('IMG_1234.jpg.json', $this->service->findSidecar('IMG_1234.jpg', $sidecars));
		$this->assertSame('IMG_1234.jpg(1).json', $this->service->findSidecar('IMG_1234(1).jpg', $sidecars));
	}

	public function testIndexSidecarsIgnoresOtherFiles(): void {
		$this->assertSame([], $this->service->indexSidecars(['IMG_1234.jpg', 'notes.txt', 'json']));
	}

	public function testParseSidecar(): void {
		$content = json_encode([
			'title' => 'IMG_1234.jpg',
			'description' => '',
			'creationTime' => ['timestamp' => '1700000000', 'formatted' => '14 Nov 2023, 22:13:20 UTC'],
			'photoTakenTime' => ['timestamp' => '1561982400', 'formatted' => '1 Jul 2019, 12:00:00 UTC'],
			'geoData' => ['latitude' => 48.8583701, 'longitude' => 2.2944813, 'altitude' => 35.5, 'latitudeSpan' => 0.0, 'longitudeSpan' => 0.0],
			'geoDataExif' => ['latitude' => 1.0, 'longitude' => 2.0, 'altitude' => 0.0, 'latitudeSpan' => 0.0, 'longitudeSpan' => 0.0],
			'url' => 'https://photos.google.com/photo/abc',
		]);

		$this->assertSame([
			'takenAt' => 1561982400,
			'gps' => ['latitude' => 48.8583701, 'longitude' => 2.2944813, 'altitude' => 35.5],
		], $this->service->parseSidecar($content));
	}

	public function testParseSidecarFallsBackToTheExifPosition(): void {
		$content = json_encode([
			'photoTakenTime' => ['timestamp' => '1561982400'],
			'geoData' => ['latitude' => 0.0, 'longitude' => 0.0, 'altitude' => 0.0],
			'geoDataExif' => ['latitude' => -33.8567844, 'longitude' => 151.213108, 'altitude' => 0.0],
		]);

		$this->assertSame([
			'takenAt' => 1561982400,
			'gps' => ['latitude' => -33.8567844, 'longitude' => 151.213108],
		], $this->service->parseSidecar($content));
	}

	public function testParseSidecarWithoutPosition(): void {
		$content = '{"photoTakenTime":{"timestamp":"1561982400"},"geoData":{"latitude":0.0,"longitude":0.0},"geoDataExif":{"latitude":0.0,"longitude":0.0}}';

		$this->assertSame(['takenAt' => 1561982400, 'gps' => null], $this->service->parseSidecar($content));
	}

	public function testParseSidecarWithoutDate(): void {
		$content = '{"creationTime":{"timestamp":"1700000000"},"geoData":{"latitude":10,"longitude":-20}}';

		$this->assertSame([
			'takenAt' => null,
			'gps' => ['latitude' => 10.0, 'longitude' => -20.0],
		], $this->service->parseSidecar($content));
	}

	public function testParseSidecarAcceptsNumericTimestamps(): void {
		$this->assertSame(
			['takenAt' => 1561982400, 'gps' => null],
			$this->service->parseSidecar('{"photoTakenTime":{"timestamp":1561982400}}'),
		);
	}

	public static function dataParseSidecarWithoutUsableData(): array {
		return [
			'not JSON' => ['not json'],
			'empty' => [''],
			'scalar' => ['"1561982400"'],
			'list' => ['[1, 2]'],
			'album metadata' => ['{"title":"Holidays","date":{"timestamp":"1561982400"}}'],
			'upload date only' => ['{"creationTime":{"timestamp":"1700000000"}}'],
			'zero timestamp' => ['{"photoTakenTime":{"timestamp":"0"}}'],
			'negative timestamp' => ['{"photoTakenTime":{"timestamp":"-5"}}'],
			'invalid timestamp' => ['{"photoTakenTime":{"timestamp":"yesterday"}}'],
			'fractional timestamp' => ['{"photoTakenTime":{"timestamp":"1561982400.5"}}'],
			'timestamp not in an object' => ['{"photoTakenTime":"1561982400"}'],
			'latitude out of range' => ['{"geoData":{"latitude":91.0,"longitude":2.0}}'],
			'longitude out of range' => ['{"geoData":{"latitude":48.0,"longitude":-180.5}}'],
			'coordinates as strings' => ['{"geoData":{"latitude":"48.8","longitude":"2.3"}}'],
			'missing longitude' => ['{"geoData":{"latitude":48.8}}'],
			'too deeply nested' => [str_repeat('[', 20) . str_repeat(']', 20)],
		];
	}

	/**
	 * @dataProvider dataParseSidecarWithoutUsableData
	 */
	public function testParseSidecarWithoutUsableData(string $content): void {
		$this->assertNull($this->service->parseSidecar($content));
	}
}
