<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

/**
 * Read the CSV files of an iCloud Photos export from privacy.apple.com.
 *
 * Every part of the export has a "Photos" folder with the media files and one
 * or more "Photo Details.csv", "Photo Details-1.csv"… files describing them:
 *
 *   imgName,fileChecksum,favorite,hidden,deleted,originalCreationDate,viewCount,importDate
 *   IMG_7938.HEIC,AfQj57ORF2JI…,yes,no,no,"Saturday June 4,2022 12:11 PM GMT",10,"Saturday June 4,2022 12:11 PM GMT"
 *
 * and an "Albums" folder with one CSV per album, named after the album,
 * listing the file names of its members under an "imgName" header.
 *
 * @psalm-type PhotoDetails = array{takenAt: ?int, favorite: bool, hidden: bool, deleted: bool}
 */
class ICloudExportService {
	/** Larger files are not read, Apple splits the details into several files. */
	public const MAX_CSV_SIZE = 32 * 1024 * 1024;

	private const MEMBER_HEADERS = ['imgname', 'imagename', 'images'];

	private const MONTHS = [
		'jan' => 1, 'feb' => 2, 'mar' => 3, 'apr' => 4, 'may' => 5, 'jun' => 6,
		'jul' => 7, 'aug' => 8, 'sep' => 9, 'oct' => 10, 'nov' => 11, 'dec' => 12,
	];

	public function isPhotoDetailsFile(string $fileName): bool {
		return preg_match('/^photo[ _]details(?:[ _-]?\d+)?\.csv$/i', $fileName) === 1;
	}

	/**
	 * @return ?string The album name, NULL if the file is no album CSV
	 */
	public function getAlbumName(string $fileName): ?string {
		if (preg_match('/^(.+)\.csv$/i', $fileName, $matches) !== 1) {
			return null;
		}

		$name = trim($matches[1]);
		return $name === '' ? null : $name;
	}

	/**
	 * A file name listed twice with different details maps to NULL: the
	 * details cannot be attributed to either of the files.
	 *
	 * @return array<string, PhotoDetails|null> Details, by file name
	 */
	public function parsePhotoDetails(string $content): array {
		$rows = $this->readCsv($content);
		$header = array_shift($rows);
		if ($header === null) {
			return [];
		}

		$columns = array_flip(array_map($this->normalizeHeader(...), $header));
		if (!isset($columns['imgname'])) {
			return [];
		}

		$details = [];
		foreach ($rows as $row) {
			$name = trim($row[$columns['imgname']] ?? '');
			if ($name === '') {
				continue;
			}

			$photo = [
				'takenAt' => $this->parseDate($this->getColumn($row, $columns, 'originalcreationdate')),
				'favorite' => $this->parseFlag($this->getColumn($row, $columns, 'favorite')),
				'hidden' => $this->parseFlag($this->getColumn($row, $columns, 'hidden')),
				'deleted' => $this->parseFlag($this->getColumn($row, $columns, 'deleted')),
			];

			$details[$name] = array_key_exists($name, $details) && $details[$name] !== $photo ? null : $photo;
		}

		return $details;
	}

	/**
	 * @return list<string> File names of the album members, without duplicates
	 */
	public function parseAlbum(string $content): array {
		$rows = $this->readCsv($content);
		$header = array_shift($rows);
		if ($header === null) {
			return [];
		}

		$column = 0;
		foreach ($header as $index => $name) {
			if (in_array($this->normalizeHeader($name), self::MEMBER_HEADERS, true)) {
				$column = $index;
				break;
			}
		}

		$members = [];
		foreach ($rows as $row) {
			$name = trim($row[$column] ?? '');
			if ($name !== '') {
				$members[$name] = true;
			}
		}

		return array_map('strval', array_keys($members));
	}

	/**
	 * Parse the dates of the export, such as "Saturday June 4,2022 12:11 PM GMT"
	 * or "Friday October 06,2023 12:11 PM GMT". The weekday, the space after the
	 * comma, the meridiem and the GMT suffix are optional, months may be
	 * abbreviated and the hours given in 24 hour format.
	 *
	 * @return ?int Unix timestamp, NULL if the date is invalid or before 1970
	 */
	public function parseDate(string $date): ?int {
		$date = trim(preg_replace('/\s+/', ' ', $date) ?? '');
		$pattern = '/^(?:[a-z]+,? )?([a-z]{3,})\.? (\d{1,2}), ?(\d{4}),? (\d{1,2}):(\d{2})(?::(\d{2}))? ?([ap])?\.?m?\.?(?: (?:gmt|utc|z))?$/i';
		if (preg_match($pattern, $date, $matches) !== 1) {
			return null;
		}

		[, $monthName, $day, $year, $hour, $minute] = $matches;
		$second = $matches[6] ?? '';
		$meridiem = strtolower($matches[7] ?? '');

		$month = self::MONTHS[strtolower(substr($monthName, 0, 3))] ?? null;
		$hour = (int)$hour;
		if ($meridiem !== '' && $hour >= 1 && $hour <= 12) {
			$hour = $hour % 12 + ($meridiem === 'p' ? 12 : 0);
		}

		if ($month === null || !checkdate($month, (int)$day, (int)$year)
			|| $hour > 23 || (int)$minute > 59 || (int)$second > 59) {
			return null;
		}

		$timestamp = gmmktime($hour, (int)$minute, (int)$second, $month, (int)$day, (int)$year);
		return $timestamp > 0 ? $timestamp : null;
	}

	/**
	 * @return list<list<string>> Rows of the CSV, without empty lines
	 */
	private function readCsv(string $content): array {
		$content = preg_replace('/^\xEF\xBB\xBF/', '', $content) ?? $content;

		$handle = fopen('php://memory', 'r+');
		if ($handle === false) {
			return [];
		}
		fwrite($handle, $content);
		rewind($handle);

		$rows = [];
		while (($row = fgetcsv($handle, null, ',', '"', '')) !== false) {
			if ($row !== [null]) {
				$rows[] = array_map(static fn (?string $cell): string => (string)$cell, $row);
			}
		}
		fclose($handle);

		return $rows;
	}

	private function normalizeHeader(string $header): string {
		return strtolower(preg_replace('/\s+/', '', $header) ?? $header);
	}

	/**
	 * @param list<string> $row
	 * @param array<string, int> $columns Column indexes, by normalized header
	 */
	private function getColumn(array $row, array $columns, string $header): string {
		return isset($columns[$header]) ? trim($row[$columns[$header]] ?? '') : '';
	}

	private function parseFlag(string $value): bool {
		return in_array(strtolower($value), ['yes', 'true', '1'], true);
	}
}
