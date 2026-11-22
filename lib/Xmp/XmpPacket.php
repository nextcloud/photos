<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Xmp;

use DateTimeImmutable;
use DateTimeInterface;
use DOMDocument;
use DOMElement;
use DOMNode;

/**
 * Reads and updates the few properties Photos knows in an XMP packet.
 *
 * Everything else in the packet, including properties of other tools and
 * their namespaces, is kept as it is. Simple properties may be stored either
 * as attributes of an rdf:Description or as child elements, both are read and
 * replaced.
 */
class XmpPacket {
	public const NS_X = 'adobe:ns:meta/';
	public const NS_RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
	public const NS_EXIF = 'http://ns.adobe.com/exif/1.0/';
	public const NS_XMP = 'http://ns.adobe.com/xap/1.0/';
	public const NS_DC = 'http://purl.org/dc/elements/1.1/';
	public const NS_PHOTOSHOP = 'http://ns.adobe.com/photoshop/1.0/';

	private const PREFIXES = [
		self::NS_EXIF => 'exif',
		self::NS_XMP => 'xmp',
		self::NS_DC => 'dc',
		self::NS_PHOTOSHOP => 'photoshop',
	];

	private function __construct(
		private readonly DOMDocument $document,
		private readonly DOMElement $description,
	) {
	}

	public static function create(): self {
		return self::fromString(
			'<?xml version="1.0" encoding="UTF-8"?>' . "\n"
			. '<x:xmpmeta xmlns:x="' . self::NS_X . '">' . "\n"
			. ' <rdf:RDF xmlns:rdf="' . self::NS_RDF . '">' . "\n"
			. '  <rdf:Description rdf:about=""/>' . "\n"
			. ' </rdf:RDF>' . "\n"
			. '</x:xmpmeta>' . "\n"
		);
	}

	/**
	 * @throws \InvalidArgumentException When the content is not an XMP packet
	 */
	public static function fromString(string $xml): self {
		// Document type declarations have no place in XMP and are the vector of
		// entity expansion attacks.
		if (stripos($xml, '<!DOCTYPE') !== false || stripos($xml, '<!ENTITY') !== false) {
			throw new \InvalidArgumentException('XMP packets must not declare a document type');
		}

		$document = new DOMDocument();
		$previous = libxml_use_internal_errors(true);
		try {
			$loaded = $document->loadXML($xml, LIBXML_NONET);
		} finally {
			libxml_clear_errors();
			libxml_use_internal_errors($previous);
		}

		$rdf = $loaded ? $document->getElementsByTagNameNS(self::NS_RDF, 'RDF')->item(0) : null;
		if (!($rdf instanceof DOMElement)) {
			throw new \InvalidArgumentException('Not an XMP packet');
		}

		$description = $document->getElementsByTagNameNS(self::NS_RDF, 'Description')->item(0);
		if (!($description instanceof DOMElement)) {
			$description = $document->createElementNS(self::NS_RDF, ($rdf->prefix ?: 'rdf') . ':Description');
			$description->setAttributeNS(self::NS_RDF, ($rdf->prefix ?: 'rdf') . ':about', '');
			$rdf->appendChild($description);
		}

		return new self($document, $description);
	}

	public function toString(): string {
		return (string)$this->document->saveXML();
	}

	/**
	 * Moment the photo was taken. Values without a time zone are read in the
	 * default time zone, as the dates of the EXIF data are.
	 */
	public function getDateTimeOriginal(): ?DateTimeImmutable {
		return $this->readDateTimeOriginal()[0] ?? null;
	}

	/**
	 * Whether the moment the photo was taken carries a time zone.
	 */
	public function hasTimeZone(): bool {
		return $this->readDateTimeOriginal()[1] ?? false;
	}

	/**
	 * @return ?array{0: DateTimeImmutable, 1: bool} The date and whether it
	 *                                               carries a time zone
	 */
	private function readDateTimeOriginal(): ?array {
		$value = $this->getValue(self::NS_EXIF, 'DateTimeOriginal') ?? $this->getValue(self::NS_PHOTOSHOP, 'DateCreated');
		if ($value === null) {
			return null;
		}

		// Some tools store the date in the EXIF format, YYYY:MM:DD HH:MM:SS.
		$value = (string)preg_replace('/^(\d{4}):(\d{2}):(\d{2})[ T]/', '$1-$2-$3T', $value);
		if (preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/', $value, $matches) !== 1) {
			return null;
		}

		try {
			return [new DateTimeImmutable($value), isset($matches[1])];
		} catch (\Exception) {
			return null;
		}
	}

	public function setDateTimeOriginal(?DateTimeInterface $dateTime): void {
		$value = $dateTime?->format('Y-m-d\TH:i:sP');
		$this->setValue(self::NS_EXIF, 'DateTimeOriginal', $value);
		// Lightroom shows the IPTC creation date when there is one.
		if ($this->getValue(self::NS_PHOTOSHOP, 'DateCreated') !== null) {
			$this->setValue(self::NS_PHOTOSHOP, 'DateCreated', $value);
		}
	}

	/**
	 * @return ?array{latitude: float, longitude: float}
	 */
	public function getCoordinates(): ?array {
		$latitude = self::parseCoordinate($this->getValue(self::NS_EXIF, 'GPSLatitude'), 'N', 'S', 90.0);
		$longitude = self::parseCoordinate($this->getValue(self::NS_EXIF, 'GPSLongitude'), 'E', 'W', 180.0);
		if ($latitude === null || $longitude === null) {
			return null;
		}

		return ['latitude' => $latitude, 'longitude' => $longitude];
	}

	/**
	 * @param ?array{latitude: float, longitude: float} $coordinates
	 */
	public function setCoordinates(?array $coordinates): void {
		$this->setValue(self::NS_EXIF, 'GPSLatitude', $coordinates === null ? null : self::formatCoordinate($coordinates['latitude'], 'N', 'S'));
		$this->setValue(self::NS_EXIF, 'GPSLongitude', $coordinates === null ? null : self::formatCoordinate($coordinates['longitude'], 'E', 'W'));
		// The altitude of a previous position would be misleading.
		$this->setValue(self::NS_EXIF, 'GPSAltitude', null);
		$this->setValue(self::NS_EXIF, 'GPSAltitudeRef', null);
	}

	public function getRating(): ?int {
		$rating = $this->getValue(self::NS_XMP, 'Rating');
		return $rating !== null && is_numeric($rating) ? (int)$rating : null;
	}

	public function setRating(int $rating): void {
		$this->setValue(self::NS_XMP, 'Rating', (string)$rating);
	}

	/**
	 * @return list<string>
	 */
	public function getSubjects(): array {
		$subjects = [];
		foreach ($this->findProperties(self::NS_DC, 'subject') as $property) {
			if ($property instanceof DOMElement) {
				foreach ($property->getElementsByTagNameNS(self::NS_RDF, 'li') as $item) {
					$subjects[] = $item->textContent;
				}
			}
		}

		return array_values(array_unique($subjects));
	}

	/**
	 * Add keywords, keeping the ones already listed.
	 *
	 * @param list<string> $subjects
	 */
	public function addSubjects(array $subjects): void {
		$subjects = array_values(array_unique(array_merge($this->getSubjects(), $subjects)));
		$this->removeProperty(self::NS_DC, 'subject');
		if ($subjects === []) {
			return;
		}

		$rdfPrefix = $this->description->prefix ?: 'rdf';
		$property = $this->document->createElementNS(self::NS_DC, $this->prefixFor(self::NS_DC) . ':subject');
		$bag = $this->document->createElementNS(self::NS_RDF, $rdfPrefix . ':Bag');
		foreach ($subjects as $subject) {
			$item = $this->document->createElementNS(self::NS_RDF, $rdfPrefix . ':li');
			$item->appendChild($this->document->createTextNode($subject));
			$bag->appendChild($item);
		}
		$property->appendChild($bag);
		$this->description->appendChild($property);
	}

	private function getValue(string $namespace, string $name): ?string {
		foreach ($this->findProperties($namespace, $name) as $property) {
			$value = trim($property->textContent);
			if ($value !== '') {
				return $value;
			}
		}

		return null;
	}

	/**
	 * Replace every occurrence of a simple property by a single attribute on
	 * the first rdf:Description, or remove it when the value is NULL.
	 */
	private function setValue(string $namespace, string $name, ?string $value): void {
		$this->removeProperty($namespace, $name);
		if ($value !== null) {
			$this->description->setAttributeNS($namespace, $this->prefixFor($namespace) . ':' . $name, $value);
		}
	}

	private function removeProperty(string $namespace, string $name): void {
		foreach ($this->findProperties($namespace, $name) as $property) {
			if ($property instanceof \DOMAttr) {
				$property->ownerElement?->removeAttributeNode($property);
			} else {
				$property->parentNode?->removeChild($property);
			}
		}
	}

	/**
	 * @return list<DOMNode> Attributes and child elements of all the
	 *                       rdf:Description elements holding the property
	 */
	private function findProperties(string $namespace, string $name): array {
		$properties = [];
		foreach ($this->document->getElementsByTagNameNS(self::NS_RDF, 'Description') as $description) {
			$attribute = $description->getAttributeNodeNS($namespace, $name);
			if ($attribute instanceof \DOMAttr) {
				$properties[] = $attribute;
			}
			foreach ($description->childNodes as $child) {
				if ($child instanceof DOMElement && $child->namespaceURI === $namespace && $child->localName === $name) {
					$properties[] = $child;
				}
			}
		}

		return $properties;
	}

	/**
	 * Prefix bound to a namespace, the one of the packet if it has one.
	 */
	private function prefixFor(string $namespace): string {
		$prefix = $this->description->lookupPrefix($namespace);
		if (is_string($prefix) && $prefix !== '') {
			return $prefix;
		}

		$prefix = self::PREFIXES[$namespace];
		$bound = $this->description->lookupNamespaceURI($prefix);
		if ($bound !== null && $bound !== $namespace) {
			$prefix = 'nc' . $prefix;
		}
		$this->description->setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:' . $prefix, $namespace);

		return $prefix;
	}

	/**
	 * Read a coordinate in the XMP format, "DDD,MM,SSk" or "DDD,MM.mmk", or as
	 * signed decimal degrees.
	 */
	private static function parseCoordinate(?string $value, string $positive, string $negative, float $limit): ?float {
		if ($value === null) {
			return null;
		}

		$value = strtoupper(str_replace(' ', '', $value));
		if (is_numeric($value)) {
			$coordinate = (float)$value;
		} elseif (preg_match('/^(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)(?:,(\d+(?:\.\d+)?))?([' . $positive . $negative . '])$/', $value, $matches) === 1) {
			$coordinate = (float)$matches[1] + (float)$matches[2] / 60.0 + (float)($matches[3] ?: '0') / 3600.0;
			if ($matches[4] === $negative) {
				$coordinate = -$coordinate;
			}
		} else {
			return null;
		}

		return abs($coordinate) <= $limit ? $coordinate : null;
	}

	private static function formatCoordinate(float $coordinate, string $positive, string $negative): string {
		$degrees = floor(abs($coordinate));
		$minutes = round((abs($coordinate) - $degrees) * 60.0, 6);
		if ($minutes >= 60) {
			$degrees += 1.0;
			$minutes = 0.0;
		}

		return (int)$degrees . ',' . rtrim(rtrim(number_format($minutes, 6, '.', ''), '0'), '.') . ($coordinate < 0 ? $negative : $positive);
	}
}
