<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OC\Streamer;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\AppInfo\Application;
use OCA\Photos\Filters\FiltersManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\ICallbackResponse;
use OCP\AppFramework\Http\IOutput;
use OCP\AppFramework\Http\Response;
use OCP\Files\File;
use OCP\Files\IRootFolder;
use OCP\Files\NotPermittedException;
use OCP\IDateTimeZone;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

class PublicDownloadController extends Controller {
	public function __construct(
		IRequest $request,
		private readonly IRootFolder $rootFolder,
		private readonly AlbumMapper $albumMapper,
		private readonly FiltersManager $filtersManager,
		private readonly IDateTimeZone $timezoneFactory,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	/**
	 * Download all the files of a publicly shared album as a zip archive.
	 *
	 * @PublicPage
	 * @NoCSRFRequired
	 */
	public function index(string $token): Response {
		$albums = $this->albumMapper->getSharedAlbumsForCollaborator($token, AlbumMapper::TYPE_LINK);
		if (\count($albums) === 0) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		/** @var array<string, File> $files */
		$files = [];
		$totalSize = 0;
		foreach ($albums as $album) {
			$albumFiles = $this->albumMapper->getForAlbumIdAndUserWithFiles($album->getId(), $album->getUserId(), $album->getDecodedFilters());
			foreach ($albumFiles as $albumFile) {
				$nodes = $this->rootFolder->getUserFolder($albumFile->getOwner())->getById($albumFile->getFileId());
				$node = $nodes[0] ?? null;
				if (!($node instanceof File) || !$node->isReadable() || !$this->filtersManager->isDownloadAllowed($node)) {
					continue;
				}

				$name = $this->getUniqueName($node->getName(), $files);
				$files[$name] = $node;
				$totalSize += $node->getSize();
			}
		}

		if (\count($files) === 0) {
			return new DataResponse([], Http::STATUS_NOT_FOUND);
		}

		$streamer = new Streamer(false, $totalSize, \count($files), $this->timezoneFactory);

		return new class($streamer, $files, $albums[0]->getTitle(), $this->logger) extends Response implements ICallbackResponse {
			/**
			 * @param array<string, File> $files
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
		};
	}

	/**
	 * @param array<string, File> $taken
	 */
	private function getUniqueName(string $name, array $taken): string {
		if (!isset($taken[$name])) {
			return $name;
		}

		$info = pathinfo($name);
		$base = $info['filename'];
		$extension = isset($info['extension']) ? '.' . $info['extension'] : '';
		for ($i = 2; isset($taken["$base ($i)$extension"]); $i++);

		return "$base ($i)$extension";
	}
}
