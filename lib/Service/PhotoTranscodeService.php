<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Service;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\PhotoTranscodeMapper;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\IConfig;
use Psr\Log\LoggerInterface;

/**
 * Owns the ffmpeg invocation that turns a stored video into HLS
 * segments. The mapper handles the state machine; this class is the
 * "do the actual work" layer.
 *
 * Storage layout (one dir per fileId, beneath the NC datadir):
 *
 *   <datadir>/photos_transcodes/<fileId>/master.m3u8
 *   <datadir>/photos_transcodes/<fileId>/seg-000.ts
 *   <datadir>/photos_transcodes/<fileId>/seg-001.ts
 *   ...
 *
 * Why under the datadir rather than IAppData: ffmpeg writes to a
 * real filesystem path. IAppData is an abstraction (could be
 * object storage), so we'd have to transcode to a temp dir then
 * upload each segment — twice the I/O. Segments are a *cache*, not
 * user data, so local-only is fine. Object-storage installations
 * can disable transcoding via `photos.enable_transcoding = false`.
 *
 * Quality preset (single ladder for now): H.264 baseline @ 2 Mbps,
 * 720p max, AAC stereo @ 128k. Compatible with every browser that
 * supports HLS, small enough to stream over modest connections.
 * Adaptive ladders (multiple bitrates) come later — a good follow-
 * up once we have telemetry on which devices play badly.
 */
class PhotoTranscodeService {
	/** Mimes we transcode. Browser-compat formats are handled
	 * directly by the client, no transcode needed. */
	public const TARGET_MIMES = [
		// HEVC variants — modern iPhone default, won't play in Chrome/FF.
		'video/quicktime',
		'video/x-matroska',
		'video/x-msvideo',
		'video/avi',
		'video/3gpp',
		'video/x-flv',
		'video/x-ms-wmv',
		// HEIC etc. don't ship via the photos app's video timeline.
	];

	private const SEGMENT_DURATION_SEC = 6;
	private const MAX_HEIGHT = 720;
	private const VIDEO_BITRATE_K = 2000;
	private const AUDIO_BITRATE_K = 128;

	public function __construct(
		private readonly PhotoTranscodeMapper $mapper,
		private readonly IRootFolder $rootFolder,
		private readonly IConfig $config,
		private readonly ITimeFactory $time,
		private readonly LoggerInterface $logger,
	) {
	}

	/**
	 * True when ffmpeg is reachable and the admin hasn't disabled
	 * the feature. Cached results would be premature — this is a
	 * cheap stat call and admins do toggle it during setup.
	 */
	public function isEnabled(): bool {
		if ($this->config->getAppValue(Application::APP_ID, 'enable_transcoding', 'true') !== 'true') {
			return false;
		}
		$ffmpeg = $this->getFfmpegBinary();
		return $ffmpeg !== null && is_executable($ffmpeg);
	}

	/**
	 * The ffmpeg path. Reuses NC's `preview_ffmpeg_path` system
	 * config so admins don't have to set it twice; falls back to a
	 * `which ffmpeg` style probe of common locations.
	 */
	public function getFfmpegBinary(): ?string {
		$configured = $this->config->getSystemValue('preview_ffmpeg_path', null);
		if (is_string($configured) && $configured !== '') {
			return $configured;
		}

		// Probe common locations rather than shelling out to `which`
		// — `which` requires a shell which we'd rather not invoke.
		foreach (['/usr/bin/ffmpeg', '/usr/local/bin/ffmpeg', '/opt/homebrew/bin/ffmpeg'] as $candidate) {
			if (is_executable($candidate)) {
				return $candidate;
			}
		}
		return null;
	}

	/**
	 * Should this node be queued for transcoding? Filters out files
	 * the browser can already play (mp4/webm/ogg), files that
	 * aren't videos, and files in mimes we don't support.
	 */
	public function shouldQueue(Node $node): bool {
		$mime = $node->getMimeType();
		if (!str_starts_with($mime, 'video/')) {
			return false;
		}
		// Browser-playable mimes — the client will use the original.
		if ($mime === 'video/mp4' || $mime === 'video/webm' || $mime === 'video/ogg') {
			return false;
		}
		return in_array($mime, self::TARGET_MIMES, true);
	}

	/**
	 * Run ffmpeg on the given fileId. Resolves the local source path
	 * via getUserFolder (we need a real disk path; IAppData / object
	 * storage isn't supported for now — admins disable transcoding
	 * if they're on S3 backends).
	 *
	 * Returns true on success, false on any failure. Caller updates
	 * the mapper state.
	 */
	public function transcodeFile(int $fileId): bool {
		$ffmpeg = $this->getFfmpegBinary();
		if ($ffmpeg === null) {
			$this->mapper->markFailed($fileId, 'ffmpeg binary not found', $this->time->getTime());
			return false;
		}

		$node = $this->resolveNode($fileId);
		if ($node === null) {
			$this->mapper->markUnsupported($fileId, 'file not accessible', $this->time->getTime());
			return false;
		}

		$sourcePath = $this->getLocalPath($node);
		if ($sourcePath === null) {
			// Object storage / external storage — we'd need to copy
			// to a temp file first. Skip for now (the hover-preview
			// already falls back to the still thumbnail in that
			// case). Mark unsupported so the worker doesn't retry.
			$this->mapper->markUnsupported($fileId, 'file not on local storage', $this->time->getTime());
			return false;
		}

		$outDir = $this->getOutputDir($fileId);
		if ($outDir === null) {
			$this->mapper->markFailed($fileId, 'cannot create output directory', $this->time->getTime());
			return false;
		}

		// Wipe any partial output from a previous failed run before
		// starting fresh.
		$this->clearDir($outDir);

		$manifestPath = $outDir . '/master.m3u8';
		$segmentPattern = $outDir . '/seg-%03d.ts';

		$cmd = [
			$ffmpeg,
			'-y', // overwrite
			'-hide_banner',
			'-loglevel', 'error',
			'-i', $sourcePath,
			// Video: H.264 main profile, capped to 720p, CRF-style
			// quality with a hard bitrate ceiling for predictability.
			'-c:v', 'libx264',
			'-profile:v', 'main',
			'-preset', 'veryfast',
			'-vf', 'scale=-2:min(' . self::MAX_HEIGHT . '\,ih)',
			'-b:v', self::VIDEO_BITRATE_K . 'k',
			'-maxrate', self::VIDEO_BITRATE_K . 'k',
			'-bufsize', (self::VIDEO_BITRATE_K * 2) . 'k',
			// Audio: AAC stereo. Maps the first audio stream if any;
			// `-ac 2` downmixes 5.1 to stereo for compatibility.
			'-c:a', 'aac',
			'-ac', '2',
			'-b:a', self::AUDIO_BITRATE_K . 'k',
			// HLS flags: independent_segments lets each segment be
			// decoded standalone; delete_segments off because we
			// keep the whole VOD playlist; program_date_time for
			// scrubber UI in clients that show timestamps.
			'-f', 'hls',
			'-hls_time', (string)self::SEGMENT_DURATION_SEC,
			'-hls_list_size', '0',
			'-hls_flags', 'independent_segments+program_date_time',
			'-hls_segment_filename', $segmentPattern,
			$manifestPath,
		];

		$proc = proc_open(
			$cmd,
			[1 => ['pipe', 'w'], 2 => ['pipe', 'w']],
			$pipes,
		);
		if (!is_resource($proc)) {
			$this->mapper->markFailed($fileId, 'cannot spawn ffmpeg', $this->time->getTime());
			return false;
		}

		$stderr = stream_get_contents($pipes[2]);
		fclose($pipes[1]);
		fclose($pipes[2]);
		$exit = proc_close($proc);

		if ($exit !== 0 || !is_file($manifestPath)) {
			$reason = trim((string)$stderr);
			if ($reason === '') {
				$reason = 'ffmpeg exited ' . $exit;
			}
			$this->logger->warning('photos transcode: ffmpeg failed for {fileId}', [
				'fileId' => $fileId,
				'exit' => $exit,
				'stderr' => $reason,
			]);
			$this->clearDir($outDir);
			$this->mapper->markFailed($fileId, $reason, $this->time->getTime());
			return false;
		}

		$this->mapper->markReady($fileId, $this->time->getTime());
		return true;
	}

	/**
	 * Disk path to the manifest, or null when the file isn't ready.
	 * Controllers use this to decide between 200 and 404.
	 */
	public function getManifestPath(int $fileId): ?string {
		if ($this->mapper->getState($fileId) !== PhotoTranscodeMapper::STATE_READY) {
			return null;
		}
		$path = $this->getOutputDir($fileId) . '/master.m3u8';
		return is_file($path) ? $path : null;
	}

	/**
	 * Disk path to a numbered segment, or null when not present.
	 * `seg-%03d.ts` is the convention ffmpeg writes; we whitelist
	 * the segment name shape so a malicious request can't traverse
	 * out of the file's directory.
	 */
	public function getSegmentPath(int $fileId, string $segmentName): ?string {
		if (preg_match('/^seg-\d{3,}\.ts$/', $segmentName) !== 1) {
			return null;
		}
		if ($this->mapper->getState($fileId) !== PhotoTranscodeMapper::STATE_READY) {
			return null;
		}
		$path = $this->getOutputDir($fileId) . '/' . $segmentName;
		return is_file($path) ? $path : null;
	}

	public function deleteForFileId(int $fileId): void {
		$dir = $this->getOutputDir($fileId);
		if ($dir !== null && is_dir($dir)) {
			$this->clearDir($dir);
			@rmdir($dir);
		}
		$this->mapper->deleteByFileId($fileId);
	}

	private function resolveNode(int $fileId): ?Node {
		$nodes = $this->rootFolder->getById($fileId);
		return $nodes[0] ?? null;
	}

	/**
	 * Local filesystem path for the source video, or null when we
	 * can't get one (object storage backend, S3, encrypted, etc.).
	 */
	private function getLocalPath(Node $node): ?string {
		$storage = $node->getStorage();
		if (!$storage->isLocal()) {
			return null;
		}
		$path = $storage->getLocalFile($node->getInternalPath());
		return $path === false ? null : $path;
	}

	private function getOutputDir(int $fileId): ?string {
		$datadir = $this->config->getSystemValue('datadirectory', '');
		if (!is_string($datadir) || $datadir === '') {
			return null;
		}
		$dir = rtrim($datadir, '/') . '/photos_transcodes/' . $fileId;
		if (!is_dir($dir) && !@mkdir($dir, 0o770, true) && !is_dir($dir)) {
			return null;
		}
		return $dir;
	}

	/**
	 * Drop every file in the output directory but keep the dir
	 * itself. Used between fresh transcode attempts and on retry.
	 */
	private function clearDir(string $dir): void {
		if (!is_dir($dir)) {
			return;
		}
		foreach (glob($dir . '/*') ?: [] as $file) {
			@unlink($file);
		}
	}
}
