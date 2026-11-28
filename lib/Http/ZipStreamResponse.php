<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Http;

use OC\Streamer;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\ICallbackResponse;
use OCP\AppFramework\Http\IOutput;
use OCP\AppFramework\Http\Response;
use OCP\Files\File;
use OCP\Files\NotPermittedException;
use Psr\Log\LoggerInterface;

/**
 * Streams files as a zip archive.
 *
 * @template-extends Response<Http::STATUS_OK, array<string, mixed>>
 */
class ZipStreamResponse extends Response implements ICallbackResponse {
	/**
	 * @param array<string, File> $files Files indexed by their name in the archive
	 */
	public function __construct(
		private readonly Streamer $streamer,
		private readonly array $files,
		private readonly string $archiveName,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct();
	}

	#[\Override]
	public function callback(IOutput $output): void {
		$this->streamer->sendHeaders($this->archiveName);
		foreach ($this->files as $name => $file) {
			try {
				$stream = $file->fopen('r');
			} catch (NotPermittedException $e) {
				$this->logger->error('Could not open album file for public download', ['file' => $name, 'exception' => $e]);
				continue;
			}

			if ($stream === false) {
				$this->logger->error('Could not open album file for public download', ['file' => $name]);
				continue;
			}

			try {
				if (!$this->streamer->addFileFromStream($stream, $name, $file->getSize(), $file->getMTime())) {
					$this->logger->error('Could not add album file to public download archive', ['file' => $name]);
				}
			} finally {
				fclose($stream);
			}
		}
		$this->streamer->finalize();
	}
}
