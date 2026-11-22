<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Service;

use OCA\Photos\Service\ICloudExportService;
use Test\TestCase;

class ICloudExportServiceTest extends TestCase {
	/** "Photo Details-3.csv" as exported, with a byte order mark and CRLF line endings. */
	private const PHOTO_DETAILS = "\xEF\xBB\xBF"
		. "imgName,fileChecksum,favorite,hidden,deleted,originalCreationDate,viewCount,importDate\r\n"
		. "IMG_7938.HEIC,AfQj57ORF2JIumUCjO+PawZ9nqPg,yes,no,no,\"Saturday June 4,2022 12:11 PM GMT\",10,\"Saturday June 4,2022 12:11 PM GMT\"\r\n"
		. "IMG_0403.MOV,AcQTH38VUJ8ryqOCgiKuos3A5eCo,no,no,no,\"Thursday August 29,2013 7:08 AM GMT\",0,\"Wednesday September 4,2013 9:10 PM GMT\"\r\n"
		. "IMG_0012.JPG,AYSZZDwMrFRpfZMZmC721ZAQuwIp,no,yes,no,\"Friday October 06,2023 12:11 AM GMT\",3,\"Friday October 06,2023 12:11 PM GMT\"\r\n"
		. "IMG_0013.PNG,Ab4Ty0lDnuC4LO2TT2Mx7nDtnMWy,no,no,yes,,0,\"Friday October 06,2023 12:11 PM GMT\"\r\n"
		. "\r\n";

	private ICloudExportService $service;

	protected function setUp(): void {
		parent::setUp();

		$this->service = new ICloudExportService();
	}

	public function testParsesPhotoDetails(): void {
		$this->assertSame([
			'IMG_7938.HEIC' => ['takenAt' => gmmktime(12, 11, 0, 6, 4, 2022), 'favorite' => true, 'hidden' => false, 'deleted' => false],
			'IMG_0403.MOV' => ['takenAt' => gmmktime(7, 8, 0, 8, 29, 2013), 'favorite' => false, 'hidden' => false, 'deleted' => false],
			'IMG_0012.JPG' => ['takenAt' => gmmktime(0, 11, 0, 10, 6, 2023), 'favorite' => false, 'hidden' => true, 'deleted' => false],
			'IMG_0013.PNG' => ['takenAt' => null, 'favorite' => false, 'hidden' => false, 'deleted' => true],
		], $this->service->parsePhotoDetails(self::PHOTO_DETAILS));
	}

	public function testFindsColumnsByName(): void {
		$csv = "originalCreationDate, Favorite ,imgName\n"
			. "\"Monday January 2,2006 3:04 PM GMT\",yes,IMG_0001.JPG\n"
			. "not a date,no,IMG_0002.JPG\n";

		$this->assertSame([
			'IMG_0001.JPG' => ['takenAt' => gmmktime(15, 4, 0, 1, 2, 2006), 'favorite' => true, 'hidden' => false, 'deleted' => false],
			'IMG_0002.JPG' => ['takenAt' => null, 'favorite' => false, 'hidden' => false, 'deleted' => false],
		], $this->service->parsePhotoDetails($csv));
	}

	public function testDropsConflictingDuplicateNames(): void {
		$csv = "imgName,fileChecksum,favorite,hidden,deleted,originalCreationDate,viewCount,importDate\n"
			. "IMG_0403.MOV,AcQTH38V,no,no,no,\"Thursday August 29,2013 7:08 AM GMT\",0,\"Wednesday September 4,2013 9:10 PM GMT\"\n"
			. "IMG_0403.MOV,AYSZZDwM,no,no,no,\"Wednesday October 11,2017 3:53 PM GMT\",0,\"Wednesday October 11,2017 3:53 PM GMT\"\n"
			. "IMG_0403.MOV,AcQTH38V,no,no,no,\"Thursday August 29,2013 7:08 AM GMT\",0,\"Wednesday September 4,2013 9:10 PM GMT\"\n"
			. "IMG_0500.JPG,AfQj57OR,yes,no,no,\"Saturday June 4,2022 12:11 PM GMT\",1,\"Saturday June 4,2022 12:11 PM GMT\"\n"
			. "IMG_0500.JPG,AfQj57OR,yes,no,no,\"Saturday June 4,2022 12:11 PM GMT\",2,\"Saturday June 4,2022 12:11 PM GMT\"\n";

		$details = $this->service->parsePhotoDetails($csv);

		$this->assertNull($details['IMG_0403.MOV']);
		$this->assertSame(gmmktime(12, 11, 0, 6, 4, 2022), $details['IMG_0500.JPG']['takenAt'] ?? null);
	}

	public static function dataInvalidPhotoDetails(): array {
		return [
			'empty' => [''],
			'header only' => ["imgName,fileChecksum,favorite,hidden,deleted,originalCreationDate,viewCount,importDate\n"],
			'no imgName column' => ["name,date\nIMG_0001.JPG,\"Saturday June 4,2022 12:11 PM GMT\"\n"],
		];
	}

	/**
	 * @dataProvider dataInvalidPhotoDetails
	 */
	public function testIgnoresInvalidPhotoDetails(string $csv): void {
		$this->assertSame([], $this->service->parsePhotoDetails($csv));
	}

	public static function dataParseDate(): array {
		return [
			'export format' => ['Saturday June 4,2022 12:11 PM GMT', gmmktime(12, 11, 0, 6, 4, 2022)],
			'zero padded day' => ['Friday October 06,2023 12:11 PM GMT', gmmktime(12, 11, 0, 10, 6, 2023)],
			'midnight' => ['Friday October 06,2023 12:11 AM GMT', gmmktime(0, 11, 0, 10, 6, 2023)],
			'morning' => ['Thursday August 29,2013 7:08 AM GMT', gmmktime(7, 8, 0, 8, 29, 2013)],
			'space after comma' => ['Thursday August 29, 2013 7:08 PM GMT', gmmktime(19, 8, 0, 8, 29, 2013)],
			'no weekday' => ['August 29,2013 7:08 PM', gmmktime(19, 8, 0, 8, 29, 2013)],
			'abbreviated' => ['Thu Aug 29,2013 7:08 pm UTC', gmmktime(19, 8, 0, 8, 29, 2013)],
			'abbreviated september' => ['Sept. 1,2013 7:08 a.m.', gmmktime(7, 8, 0, 9, 1, 2013)],
			'seconds' => ['Saturday June 4,2022 12:11:59 PM GMT', gmmktime(12, 11, 59, 6, 4, 2022)],
			'24 hour' => ['Saturday June 4,2022 17:11 GMT', gmmktime(17, 11, 0, 6, 4, 2022)],
			'24 hour with meridiem' => ['Saturday June 4,2022 17:11 PM GMT', gmmktime(17, 11, 0, 6, 4, 2022)],
			'extra spaces' => ['  Saturday  June 4,2022   12:11 PM GMT ', gmmktime(12, 11, 0, 6, 4, 2022)],
			'empty' => ['', null],
			'iso' => ['2022-06-04T12:11:00Z', null],
			'unknown month' => ['Saturday Juin 4,2022 12:11 PM GMT', null],
			'invalid day' => ['Thursday February 30,2023 12:11 PM GMT', null],
			'invalid hour' => ['Saturday June 4,2022 24:11 GMT', null],
			'invalid minute' => ['Saturday June 4,2022 12:61 PM GMT', null],
			'before 1970' => ['Monday January 1,1968 12:00 PM GMT', null],
			'other time zone' => ['Saturday June 4,2022 12:11 PM PDT', null],
		];
	}

	/**
	 * @dataProvider dataParseDate
	 */
	public function testParseDate(string $date, ?int $expected): void {
		$this->assertSame($expected, $this->service->parseDate($date));
	}

	public static function dataParseAlbum(): array {
		return [
			'export format' => ["imgName\nIMG_0001.JPG\nIMG_0002.HEIC\n", ['IMG_0001.JPG', 'IMG_0002.HEIC']],
			'images header, BOM and CRLF' => ["\xEF\xBB\xBFImages\r\nIMG_0001.JPG\r\n\r\nIMG_0002.HEIC\r\n", ['IMG_0001.JPG', 'IMG_0002.HEIC']],
			'imageName in second column' => ["albumName,imageName\nTrip,IMG_0001.JPG\nTrip,IMG_0002.HEIC\n", ['IMG_0001.JPG', 'IMG_0002.HEIC']],
			'duplicates' => ["imgName\nIMG_0001.JPG\nIMG_0001.JPG\n IMG_0002.HEIC \n", ['IMG_0001.JPG', 'IMG_0002.HEIC']],
			'quoted name with comma' => ["imgName\n\"Scan 1, front.jpg\"\n", ['Scan 1, front.jpg']],
			'numeric name' => ["imgName\n1234\n", ['1234']],
			'empty file' => ['', []],
			'header only' => ["imgName\n", []],
		];
	}

	/**
	 * @dataProvider dataParseAlbum
	 */
	public function testParseAlbum(string $csv, array $expected): void {
		$this->assertSame($expected, $this->service->parseAlbum($csv));
	}

	public static function dataIsPhotoDetailsFile(): array {
		return [
			['Photo Details.csv', true],
			['Photo Details-1.csv', true],
			['Photo Details-37.csv', true],
			['photo_details.CSV', true],
			['Photo Details (1).csv', false],
			['Photo Details.csv.json', false],
			['Holiday.csv', false],
		];
	}

	/**
	 * @dataProvider dataIsPhotoDetailsFile
	 */
	public function testIsPhotoDetailsFile(string $name, bool $expected): void {
		$this->assertSame($expected, $this->service->isPhotoDetailsFile($name));
	}

	public static function dataGetAlbumName(): array {
		return [
			['Spécial album.csv', 'Spécial album'],
			['Summer 2023.CSV', 'Summer 2023'],
			[' Padded .csv', 'Padded'],
			['.csv', null],
			['Notes.txt', null],
		];
	}

	/**
	 * @dataProvider dataGetAlbumName
	 */
	public function testGetAlbumName(string $fileName, ?string $expected): void {
		$this->assertSame($expected, $this->service->getAlbumName($fileName));
	}
}
