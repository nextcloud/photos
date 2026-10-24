<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Tests\Listener;

use OCA\Photos\Listener\ExifMetadataProvider;
use OCP\Files\File;
use Psr\Log\LoggerInterface;
use ReflectionMethod;
use Test\TestCase;

class ExifMetadataProviderTest extends TestCase {
	public function testPreservesKnownOffsetTimeTags(): void {
		$logger = $this->createMock(LoggerInterface::class);
		$provider = new ExifMetadataProvider($logger);

		$node = $this->createMock(File::class);

		$method = new ReflectionMethod($provider, 'sanitizeEntries');
		$method->setAccessible(true);

		$result = $method->invoke(
			$provider,
			[
				'UndefinedTag:0x9010' => '+09:00',
				'UndefinedTag:0x9011' => '+09:00',
				'UndefinedTag:0x9012' => '+09:00',
			],
			$node,
		);

		$this->assertSame(
			[
				'OffsetTime' => '+09:00',
				'OffsetTimeOriginal' => '+09:00',
				'OffsetTimeDigitized' => '+09:00',
			],
			$result,
		);
	}
}
