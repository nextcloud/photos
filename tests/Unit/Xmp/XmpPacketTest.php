<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Xmp;

use DateTimeImmutable;
use DateTimeZone;
use OCA\Photos\Xmp\XmpPacket;
use Test\TestCase;

class XmpPacketTest extends TestCase {
	private static function sample(string $name): XmpPacket {
		return XmpPacket::fromString((string)file_get_contents(__DIR__ . '/samples/' . $name));
	}

	public static function dataSamples(): array {
		return [
			// EXIF formatted date, no time zone, attributes, coordinates in degrees and decimal minutes
			'darktable' => ['darktable.jpg.xmp', '2019-08-17T12:34:56+00:00', false, 51.3135, 12.3742, 3, ['holiday', 'darktable|format|jpg']],
			// ISO date with fractions and a time zone, western longitude
			'Lightroom' => ['lightroom.xmp', '2022-12-24T16:05:31+01:00', true, 38.71136, -9.137115, 4, ['Lisbon', 'Christmas']],
			// Child elements, coordinates in degrees, minutes and seconds, xpacket wrapper
			'digiKam' => ['digikam.jpg.xmp', '2021-06-12T09:15:00+00:00', false, 48.858367, 2.294500, 2, ['Family']],
			// Properties spread over several descriptions, negative offset
			'ExifTool' => ['exiftool.jpg.xmp', '2024-03-02T07:45:10-05:00', true, 40.749430, -73.985963, 1, []],
		];
	}

	/**
	 * @dataProvider dataSamples
	 */
	public function testReadsRealWorldSidecars(string $file, string $date, bool $hasTimeZone, float $latitude, float $longitude, int $rating, array $subjects): void {
		$packet = self::sample($file);

		$this->assertSame($date, $packet->getDateTimeOriginal()?->format('Y-m-d\TH:i:sP'));
		$this->assertSame($hasTimeZone, $packet->hasTimeZone());
		$coordinates = $packet->getCoordinates();
		$this->assertNotNull($coordinates);
		$this->assertEqualsWithDelta($latitude, $coordinates['latitude'], 0.000001);
		$this->assertEqualsWithDelta($longitude, $coordinates['longitude'], 0.000001);
		$this->assertSame($rating, $packet->getRating());
		$this->assertSame($subjects, $packet->getSubjects());
	}

	/**
	 * @dataProvider dataSamples
	 */
	public function testKeepsWhatItDoesNotKnowWhenUpdating(string $file): void {
		$original = (string)file_get_contents(__DIR__ . '/samples/' . $file);
		$packet = XmpPacket::fromString($original);

		$packet->setDateTimeOriginal(new DateTimeImmutable('2020-07-14T21:30:00+02:00'));
		$packet->setCoordinates(['latitude' => -33.8568, 'longitude' => 151.2153]);
		$packet->setRating(5);
		$packet->addSubjects(['Sydney']);

		$updated = XmpPacket::fromString($packet->toString());
		$this->assertSame('2020-07-14T21:30:00+02:00', $updated->getDateTimeOriginal()?->format('Y-m-d\TH:i:sP'));
		$this->assertEqualsWithDelta(-33.8568, $updated->getCoordinates()['latitude'] ?? null, 0.000001);
		$this->assertEqualsWithDelta(151.2153, $updated->getCoordinates()['longitude'] ?? null, 0.000001);
		$this->assertSame(5, $updated->getRating());
		$this->assertSame(array_merge(self::sample($file)->getSubjects(), ['Sydney']), $updated->getSubjects());

		$this->assertSameUnknownContent($original, $packet->toString());
	}

	/**
	 * Everything but the properties written by Photos is still there.
	 */
	private function assertSameUnknownContent(string $original, string $updated): void {
		$known = ['DateTimeOriginal', 'DateCreated', 'GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSAltitudeRef', 'Rating', 'subject'];
		$this->assertSame(self::unknownContent($original, $known), self::unknownContent($updated, $known));
	}

	/**
	 * @return list<string> Unknown attributes and elements, with their values
	 */
	private static function unknownContent(string $xml, array $known): array {
		$document = new \DOMDocument();
		$document->loadXML($xml);
		$content = [];
		foreach ((new \DOMXPath($document))->query('//*|//@*') as $node) {
			if (in_array($node->localName, $known, true) || ($node->parentNode?->localName === 'subject') || ($node->parentNode?->parentNode?->localName === 'subject')) {
				continue;
			}
			$content[] = $node->namespaceURI . ' ' . $node->localName . ($node instanceof \DOMAttr ? '=' . $node->value : '');
		}
		sort($content);

		return $content;
	}

	public function testReplacesEveryOccurrenceOfAProperty(): void {
		$packet = self::sample('digikam.jpg.xmp');

		$packet->setDateTimeOriginal(new DateTimeImmutable('2020-07-14T21:30:00Z'));

		$this->assertSame(1, substr_count($packet->toString(), 'DateTimeOriginal'));
	}

	public function testUpdatesTheCreationDateLightroomShows(): void {
		$packet = self::sample('lightroom.xmp');

		$packet->setDateTimeOriginal(new DateTimeImmutable('2020-07-14T21:30:00+02:00'));

		$this->assertStringContainsString('photoshop:DateCreated="2020-07-14T21:30:00+02:00"', $packet->toString());
	}

	public function testRemovesTheValues(): void {
		$packet = self::sample('darktable.jpg.xmp');

		$packet->setDateTimeOriginal(null);
		$packet->setCoordinates(null);

		$this->assertNull($packet->getDateTimeOriginal());
		$this->assertNull($packet->getCoordinates());
		$this->assertStringNotContainsString('GPSAltitude', $packet->toString());
		// The version of the GPS tags is not a position.
		$this->assertStringContainsString('exif:GPSVersionID="2.2.0.0"', $packet->toString());
	}

	public function testCreatesAPacketOtherToolsUnderstand(): void {
		$packet = XmpPacket::create();
		$packet->setDateTimeOriginal(new DateTimeImmutable('2020-07-14 21:30:00', new DateTimeZone('Europe/Paris')));
		$packet->setCoordinates(['latitude' => 48.8583, 'longitude' => 2.2945]);
		$packet->setRating(5);
		$packet->addSubjects(['Paris', 'Tower']);

		$xml = $packet->toString();
		$document = new \DOMDocument();
		$this->assertTrue($document->loadXML($xml));
		$xpath = new \DOMXPath($document);
		$xpath->registerNamespace('x', XmpPacket::NS_X);
		$xpath->registerNamespace('rdf', XmpPacket::NS_RDF);
		$xpath->registerNamespace('exif', XmpPacket::NS_EXIF);
		$xpath->registerNamespace('xmp', XmpPacket::NS_XMP);
		$xpath->registerNamespace('dc', XmpPacket::NS_DC);

		$description = '/x:xmpmeta/rdf:RDF/rdf:Description';
		$this->assertSame('2020-07-14T21:30:00+02:00', $xpath->evaluate("string($description/@exif:DateTimeOriginal)"));
		$this->assertSame('48,51.498N', $xpath->evaluate("string($description/@exif:GPSLatitude)"));
		$this->assertSame('2,17.67E', $xpath->evaluate("string($description/@exif:GPSLongitude)"));
		$this->assertSame('5', $xpath->evaluate("string($description/@xmp:Rating)"));
		$this->assertSame(2.0, $xpath->evaluate("count($description/dc:subject/rdf:Bag/rdf:li)"));
	}

	public static function dataCoordinates(): array {
		return [
			[0.0, 0.0],
			[-90.0, 180.0],
			[51.5007, -0.1246],
			[-0.00001, 179.99999999],
		];
	}

	/**
	 * @dataProvider dataCoordinates
	 */
	public function testRoundTripsCoordinates(float $latitude, float $longitude): void {
		$packet = XmpPacket::create();
		$packet->setCoordinates(['latitude' => $latitude, 'longitude' => $longitude]);

		$coordinates = XmpPacket::fromString($packet->toString())->getCoordinates();

		$this->assertEqualsWithDelta($latitude, $coordinates['latitude'] ?? null, 0.0000002);
		$this->assertEqualsWithDelta($longitude, $coordinates['longitude'] ?? null, 0.0000002);
		$this->assertDoesNotMatchRegularExpression('/,60/', $packet->toString());
	}

	public function testUsesThePrefixesOfThePacket(): void {
		$packet = XmpPacket::fromString('<x:xmpmeta xmlns:x="adobe:ns:meta/"><r:RDF xmlns:r="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
			. '<r:Description r:about="" xmlns:e="http://ns.adobe.com/exif/1.0/" e:GPSLatitude="10,30N" e:GPSLongitude="20,15W"/>'
			. '</r:RDF></x:xmpmeta>');

		$packet->setDateTimeOriginal(new DateTimeImmutable('2020-07-14T21:30:00Z'));

		$this->assertStringContainsString('e:DateTimeOriginal="2020-07-14T21:30:00+00:00"', $packet->toString());
		$this->assertSame(['latitude' => 10.5, 'longitude' => -20.25], $packet->getCoordinates());
	}

	public static function dataInvalidPackets(): array {
		return [
			'not XML' => ['IMG_1234'],
			'not XMP' => ['<?xml version="1.0"?><html/>'],
			'entity expansion' => ['<?xml version="1.0"?><!DOCTYPE x [<!ENTITY a "aaaa">]><x:xmpmeta xmlns:x="adobe:ns:meta/"/>'],
		];
	}

	/**
	 * @dataProvider dataInvalidPackets
	 */
	public function testRefusesWhatIsNotAnXmpPacket(string $xml): void {
		$this->expectException(\InvalidArgumentException::class);

		XmpPacket::fromString($xml);
	}

	public static function dataInvalidValues(): array {
		return [
			'date only' => ['exif:DateTimeOriginal="2020-07-14"'],
			'garbage date' => ['exif:DateTimeOriginal="yesterday"'],
			'latitude out of range' => ['exif:GPSLatitude="91,0N" exif:GPSLongitude="2,0E"'],
			'wrong hemisphere letter' => ['exif:GPSLatitude="48,0E" exif:GPSLongitude="2,0E"'],
		];
	}

	/**
	 * @dataProvider dataInvalidValues
	 */
	public function testIgnoresValuesItCannotRead(string $attributes): void {
		$packet = XmpPacket::fromString('<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
			. '<rdf:Description rdf:about="" xmlns:exif="http://ns.adobe.com/exif/1.0/" ' . $attributes . '/>'
			. '</rdf:RDF></x:xmpmeta>');

		$this->assertNull($packet->getDateTimeOriginal());
		$this->assertNull($packet->getCoordinates());
	}
}
