<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

use OCA\Photos\Tests\DemoLibrary\DemoLibrary;

require_once __DIR__ . '/ExifWriter.php';
require_once __DIR__ . '/DemoLibrary.php';

$options = getopt('', ['count:', 'seed:', 'end:', 'size:'], $index);
$target = $argv[$index] ?? null;
$end = strtotime(($options['end'] ?? gmdate('Y-m-d')) . ' UTC');

if ($target === null || $end === false || !extension_loaded('gd')) {
	fwrite(STDERR, <<<TEXT
		Usage: php generate.php [--count=10000] [--seed=1] [--end=YYYY-MM-DD] [--size=640] <target folder>

		Needs the gd extension. --end is the day of the newest photos (default: today),
		--size the long edge of the pictures in pixels.

		TEXT);
	exit(1);
}

try {
	$photos = DemoLibrary::plan((int)($options['count'] ?? 10000), (int)($options['seed'] ?? 1), $end);
} catch (InvalidArgumentException $e) {
	fwrite(STDERR, $e->getMessage() . "\n");
	exit(1);
}

$size = max(16, (int)($options['size'] ?? 640));
foreach ($photos as $number => $photo) {
	$file = $target . '/' . $photo['path'];
	if (!is_dir(dirname($file))) {
		mkdir(dirname($file), 0o777, true);
	}

	file_put_contents($file, DemoLibrary::render($photo, $size));
	touch($file, $photo['timestamp']);

	if (($number + 1) % 1000 === 0) {
		echo ($number + 1) . ' / ' . count($photos) . "\n";
	}
}

echo count($photos) . ' photos written to ' . $target . "\n";
