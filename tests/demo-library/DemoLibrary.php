<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\DemoLibrary;

/**
 * Plans and renders a synthetic photo library: procedurally drawn JPEGs whose
 * capture dates and positions cluster the way those of a real library do.
 *
 * @psalm-type Photo = array{path: string, timestamp: int, latitude: float, longitude: float, hue: int, model: string}
 */
class DemoLibrary {
	public const MAX_COUNT = 100000;

	private const YEARS = 15;
	private const DAY = 86400;

	/** Latitude and longitude of the places the photos are taken at. */
	private const CITIES = [
		'Amsterdam' => [52.37, 4.90], 'Athens' => [37.98, 23.73], 'Auckland' => [-36.85, 174.76],
		'Bangkok' => [13.76, 100.50], 'Barcelona' => [41.39, 2.17], 'Berlin' => [52.52, 13.40],
		'Bogotá' => [4.71, -74.07], 'Buenos Aires' => [-34.60, -58.38], 'Cairo' => [30.04, 31.24],
		'Cape Town' => [-33.92, 18.42], 'Chicago' => [41.88, -87.63], 'Copenhagen' => [55.68, 12.57],
		'Delhi' => [28.61, 77.21], 'Dubai' => [25.20, 55.27], 'Dublin' => [53.35, -6.26],
		'Edinburgh' => [55.95, -3.19], 'Hanoi' => [21.03, 105.85], 'Havana' => [23.11, -82.37],
		'Helsinki' => [60.17, 24.94], 'Hong Kong' => [22.32, 114.17], 'Honolulu' => [21.31, -157.86],
		'Istanbul' => [41.01, 28.98], 'Jakarta' => [-6.21, 106.85], 'Kyoto' => [35.01, 135.77],
		'Lima' => [-12.05, -77.04], 'Lisbon' => [38.72, -9.14], 'London' => [51.51, -0.13],
		'Los Angeles' => [34.05, -118.24], 'Marrakesh' => [31.63, -7.99], 'Melbourne' => [-37.81, 144.96],
		'Mexico City' => [19.43, -99.13], 'Montréal' => [45.50, -73.57], 'Mumbai' => [19.08, 72.88],
		'Nairobi' => [-1.29, 36.82], 'New York' => [40.71, -74.01], 'Oslo' => [59.91, 10.75],
		'Paris' => [48.86, 2.35], 'Prague' => [50.08, 14.44], 'Reykjavík' => [64.15, -21.94],
		'Rio de Janeiro' => [-22.91, -43.17], 'Rome' => [41.90, 12.50], 'San Francisco' => [37.77, -122.42],
		'Seoul' => [37.57, 126.98], 'Singapore' => [1.35, 103.82], 'Stockholm' => [59.33, 18.07],
		'Stuttgart' => [48.78, 9.18], 'Sydney' => [-33.87, 151.21], 'Tokyo' => [35.68, 139.69],
		'Vancouver' => [49.28, -123.12], 'Vienna' => [48.21, 16.37],
	];

	/** Width to height ratios, the common ones listed more than once. */
	private const ASPECT_RATIOS = [[4, 3], [4, 3], [4, 3], [3, 2], [3, 2], [16, 9], [1, 1], [3, 4], [3, 4], [2, 3], [9, 16], [2, 1]];

	/**
	 * Plans the library, oldest photo first. The same arguments give the same plan.
	 *
	 * @param int $end timestamp of the day the newest photos are taken on
	 * @return list<Photo>
	 */
	public static function plan(int $count, int $seed, int $end): array {
		if ($count < 1 || $count > self::MAX_COUNT) {
			throw new \InvalidArgumentException('The number of photos must be between 1 and ' . self::MAX_COUNT);
		}

		mt_srand($seed);
		$cities = array_values(self::CITIES);
		$home = $cities[mt_rand(0, count($cities) - 1)];
		$lastDay = intdiv($end, self::DAY);
		$days = self::YEARS * 365;

		$photos = [];
		while (count($photos) < $count) {
			// The square root makes recent years busier than early ones
			$day = $lastDay - $days + (int)(sqrt(mt_rand() / mt_getrandmax()) * $days);
			$hue = mt_rand(0, 359);
			$kind = mt_rand(1, 100);

			if ($kind <= 4) {
				// A trip: several days of photos around another city
				$city = $cities[mt_rand(0, count($cities) - 1)];
				$length = min(mt_rand(3, 14), $lastDay - $day + 1);
				for ($i = $length * mt_rand(5, 25); $i > 0; $i--) {
					$time = ($day + mt_rand(0, $length - 1)) * self::DAY + mt_rand(8 * 3600, 21 * 3600);
					$photos[] = self::photo($time, self::near($city, 0.08), $hue + mt_rand(-40, 40), $lastDay);
				}
			} elseif ($kind <= 20) {
				// A burst: one spot, about a photo per second
				$time = $day * self::DAY + mt_rand(8 * 3600, 21 * 3600);
				$spot = self::near($home, 0.15);
				for ($i = mt_rand(5, 20); $i > 0; $i--) {
					$photos[] = self::photo($time, $spot, $hue, $lastDay);
					$time += mt_rand(1, 2);
				}
			} else {
				// Daily life: a few photos within some hours, close to home
				$time = $day * self::DAY + mt_rand(7 * 3600, 18 * 3600);
				for ($i = mt_rand(1, 6); $i > 0; $i--) {
					$photos[] = self::photo($time, self::near($home, 0.15), $hue + mt_rand(-40, 40), $lastDay);
					$time += mt_rand(60, 3600);
				}
			}
		}

		$photos = array_slice($photos, 0, $count);
		usort($photos, static fn (array $a, array $b): int => $a['timestamp'] <=> $b['timestamp']);

		$taken = [];
		foreach ($photos as &$photo) {
			$name = gmdate('Y/m/\I\M\G_Ymd_His', $photo['timestamp']);
			$copy = $taken[$name] = ($taken[$name] ?? 0) + 1;
			$photo['path'] = $name . ($copy > 1 ? '_' . $copy : '') . '.jpg';
		}

		return $photos;
	}

	/**
	 * @param array{float, float} $position
	 * @return Photo
	 */
	private static function photo(int $timestamp, array $position, int $hue, int $lastDay): array {
		return [
			'path' => '',
			'timestamp' => $timestamp,
			'latitude' => $position[0],
			'longitude' => $position[1],
			'hue' => ($hue + 360) % 360,
			// A new camera every five years
			'model' => 'Synthetic ' . (self::YEARS / 5 - intdiv($lastDay - intdiv($timestamp, self::DAY), 5 * 365)),
		];
	}

	/**
	 * @param array{float, float} $position
	 * @return array{float, float} a position up to $spread degrees away
	 */
	private static function near(array $position, float $spread): array {
		return [
			round($position[0] + (mt_rand(-1000, 1000) / 1000) * $spread, 5),
			round($position[1] + (mt_rand(-1000, 1000) / 1000) * $spread, 5),
		];
	}

	/**
	 * Draws the photo: a gradient with a few translucent shapes on it,
	 * tagged with its capture date, position and camera.
	 *
	 * @param Photo $photo
	 * @param int $size length of the long edge in pixels
	 * @return string the JPEG
	 */
	public static function render(array $photo, int $size): string {
		// The picture only depends on the photo, not on what was drawn before it
		mt_srand(crc32($photo['path']));

		[$w, $h] = self::ASPECT_RATIOS[mt_rand(0, count(self::ASPECT_RATIOS) - 1)];
		$width = (int)round($size * min(1, $w / $h));
		$height = (int)round($size * min(1, $h / $w));
		$image = imagecreatetruecolor($width, $height);

		$from = self::rgb($photo['hue'], mt_rand(40, 90) / 100, mt_rand(60, 100) / 100);
		$to = self::rgb($photo['hue'] + mt_rand(20, 90), mt_rand(40, 90) / 100, mt_rand(20, 70) / 100);
		for ($y = 0; $y < $height; $y++) {
			$mix = $y / $height;
			$color = imagecolorallocate(
				$image,
				(int)($from[0] + ($to[0] - $from[0]) * $mix),
				(int)($from[1] + ($to[1] - $from[1]) * $mix),
				(int)($from[2] + ($to[2] - $from[2]) * $mix),
			);
			imageline($image, 0, $y, $width, $y, $color);
		}

		for ($i = mt_rand(2, 5); $i > 0; $i--) {
			[$r, $g, $b] = self::rgb($photo['hue'] + mt_rand(90, 270), mt_rand(30, 100) / 100, mt_rand(50, 100) / 100);
			$color = imagecolorallocatealpha($image, $r, $g, $b, mt_rand(20, 80));
			$x = mt_rand(0, $width);
			$y = mt_rand(0, $height);
			$extent = mt_rand(intdiv($size, 10), intdiv($size, 2));

			match (mt_rand(0, 2)) {
				0 => imagefilledellipse($image, $x, $y, $extent, mt_rand(intdiv($size, 10), intdiv($size, 2)), $color),
				1 => imagefilledrectangle($image, $x, $y, $x + $extent, $y + mt_rand(intdiv($size, 10), intdiv($size, 2)), $color),
				2 => imagefilledpolygon($image, [$x, $y, $x + $extent, $y + mt_rand(-$extent, $extent), $x + mt_rand(-$extent, $extent), $y + $extent], $color),
			};
		}

		ob_start();
		imagejpeg($image, null, 80);
		$jpeg = ob_get_clean();

		return ExifWriter::addTo(
			$jpeg,
			gmdate('Y:m:d H:i:s', $photo['timestamp']),
			$photo['latitude'],
			$photo['longitude'],
			'Nextcloud demo library',
			$photo['model'],
		);
	}

	/**
	 * @return array{int, int, int} red, green and blue of an HSV colour
	 */
	private static function rgb(int $hue, float $saturation, float $value): array {
		$channel = static function (int $n) use ($hue, $saturation, $value): int {
			$k = fmod($n + $hue / 60, 6);
			return (int)round(255 * ($value - $value * $saturation * max(0, min($k, 4 - $k, 1))));
		};

		return [$channel(5), $channel(3), $channel(1)];
	}
}
