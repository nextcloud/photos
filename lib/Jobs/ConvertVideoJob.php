<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Jobs;

use OCA\Photos\Service\VideoRenditionService;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\QueuedJob;
use OCP\Files\File;
use OCP\Files\IRootFolder;
use OCP\ITempManager;
use Psr\Log\LoggerInterface;

/**
 * Converts one video into a rendition browsers without HEVC or ProRes support
 * can play. Conversions run one at a time, as each one can keep a CPU busy for
 * minutes.
 */
class ConvertVideoJob extends QueuedJob {
	public const PLAN_TRANSCODE = 'transcode';
	public const PLAN_REMUX = 'remux';

	/** Video codecs Chrome and Firefox decode without platform support. */
	public const BROWSER_CODECS = ['h264', 'vp8', 'vp9', 'av1'];
	/** Containers Chrome and Firefox play. */
	public const BROWSER_CONTAINERS = ['video/mp4', 'video/webm'];

	/** Longest side of a transcoded rendition, in pixels. */
	public const MAX_DIMENSION = 1920;
	/** CPU seconds after which ffmpeg gives up on a file. */
	public const CPU_TIME_LIMIT = 3600;

	/** Tonemapping of HDR to SDR, the same as the one of the video previews of the server. */
	private const HDR_FILTER = 'zscale=min=2020_ncl:t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p';

	public function __construct(
		ITimeFactory $time,
		private readonly IRootFolder $rootFolder,
		private readonly VideoRenditionService $renditionService,
		private readonly ITempManager $tempManager,
		private readonly LoggerInterface $logger,
	) {
		parent::__construct($time);

		$this->setAllowParallelRuns(false);
	}

	/**
	 * @param array{userId: string, fileId: int} $argument As queued by VideoRenditionService::queue()
	 */
	#[\Override]
	protected function run($argument): void {
		$ffmpeg = $this->renditionService->getFfmpegPath();
		if (!$this->renditionService->isEnabled() || $ffmpeg === null) {
			return;
		}

		try {
			$file = $this->rootFolder->getUserFolder($argument['userId'])->getFirstNodeById($argument['fileId']);
		} catch (\Exception) {
			return;
		}

		if (!($file instanceof File)
			|| !str_starts_with($file->getMimetype(), 'video/')
			|| $this->renditionService->getRendition($file) !== null
			|| $this->renditionService->isUnconvertible($file)) {
			return;
		}

		if ($file->getSize() > $this->renditionService->getMaxSourceSize()) {
			$this->renditionService->markUnconvertible($file);
			return;
		}

		$storage = $file->getStorage();
		$input = $storage->getLocalFile($file->getInternalPath());
		if ($input === false) {
			return;
		}

		try {
			$this->convert($file, $ffmpeg, $input);
		} finally {
			// Storages which are not local hand out a temporary copy of the file.
			if (!$storage->isLocal()) {
				unlink($input);
			}
		}
	}

	private function convert(File $file, string $ffmpeg, string $input): void {
		[$exitCode, $probe, $banner] = $this->execute([
			$this->renditionService->getFfprobePath($ffmpeg),
			'-select_streams', 'v:0', '-show_entries', 'stream=codec_name,color_transfer', '-of', 'json', $input,
		]);
		$video = $exitCode === 0 ? self::parseProbe($probe, $banner) : null;
		$plan = $video === null ? null : self::plan($file->getMimetype(), $video['codec']);

		if ($video === null || $plan === null) {
			$this->renditionService->markUnconvertible($file);
			return;
		}

		$output = $this->tempManager->getTemporaryFile('.mp4');
		if ($output === false) {
			return;
		}

		try {
			[$exitCode, , $errors] = $this->execute([$ffmpeg, ...self::getFfmpegArgs($input, $output, $plan, $video['hdr'])]);
			$content = $exitCode === 0 ? fopen($output, 'rb') : false;
			if ($content === false) {
				$this->logger->warning('Could not convert video {fileId} for playback: {errors}', [
					'fileId' => $file->getId(),
					'errors' => $errors,
				]);
				$this->renditionService->markUnconvertible($file);
				return;
			}

			$this->renditionService->saveRendition($file, $content);
			fclose($content);
		} finally {
			unlink($output);
		}
	}

	/**
	 * How a video has to be converted for browsers to play it, null when it
	 * does not need to be.
	 *
	 * @return self::PLAN_*|null
	 */
	public static function plan(string $mimeType, string $codec): ?string {
		if (!\in_array($codec, self::BROWSER_CODECS, true)) {
			return self::PLAN_TRANSCODE;
		}

		if (!\in_array($mimeType, self::BROWSER_CONTAINERS, true)) {
			return self::PLAN_REMUX;
		}

		return null;
	}

	/**
	 * Reads the first video stream out of the JSON ffprobe prints.
	 * HDR is only reported when ffmpeg has the zscale filter to tonemap it,
	 * which its build configuration in $banner tells.
	 *
	 * @return array{codec: string, hdr: bool}|null
	 */
	public static function parseProbe(string $json, string $banner): ?array {
		$stream = json_decode($json, true)['streams'][0] ?? null;
		if (!\is_array($stream) || !\is_string($stream['codec_name'] ?? null)) {
			return null;
		}

		return [
			'codec' => $stream['codec_name'],
			'hdr' => \in_array($stream['color_transfer'] ?? null, ['smpte2084', 'arib-std-b67'], true)
				&& str_contains($banner, '--enable-libzimg'),
		];
	}

	/**
	 * @param self::PLAN_* $plan
	 * @return list<string>
	 */
	public static function getFfmpegArgs(string $input, string $output, string $plan, bool $hdr): array {
		if ($plan === self::PLAN_REMUX) {
			$video = ['-c:v', 'copy'];
		} else {
			$max = self::MAX_DIMENSION;
			$filter = "scale=w='min($max,iw)':h='min($max,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,"
				. ($hdr ? self::HDR_FILTER : 'format=yuv420p');
			$video = ['-vf', $filter, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-threads', '2'];
		}

		return [
			'-nostdin', '-y', '-v', 'error', '-timelimit', (string)self::CPU_TIME_LIMIT,
			'-i', $input,
			'-map', '0:v:0', '-map', '0:a:0?',
			...$video,
			'-c:a', 'aac', '-b:a', '128k',
			'-movflags', '+faststart',
			$output,
		];
	}

	/**
	 * @param list<string> $command
	 * @return array{int, string, string} Exit code, standard output and standard error
	 */
	protected function execute(array $command): array {
		$process = proc_open($command, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
		if (!\is_resource($process)) {
			return [-1, '', ''];
		}

		// Standard error is read first, as ffmpeg can fill its pipe before writing anything else.
		$stderr = (string)stream_get_contents($pipes[2]);
		$stdout = (string)stream_get_contents($pipes[1]);
		return [proc_close($process), $stdout, $stderr];
	}
}
