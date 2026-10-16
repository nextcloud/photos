<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\PhotoIndexMapper;
use OCA\Photos\DB\PhotoMetadataEditMapper;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\Files\IRootFolder;
use OCP\IDBConnection;
use OCP\IRequest;

/**
 * Per-user EXIF override editor. Read endpoint returns whatever
 * the user has overridden (null fields = no override). Write
 * endpoint accepts the same shape.
 *
 * On every save we also push the resolved `taken_at` value into
 * `oc_photos_index.taken_at` for that user — that's what the
 * timeline ORDER BY runs against, so the photo immediately
 * re-positions to its new spot in the grid without needing the
 * client to reload. The push only touches that user's index row;
 * other users see the photo in its original timeline slot.
 */
class MetadataEditController extends Controller {
	public function __construct(
		IRequest $request,
		private readonly PhotoMetadataEditMapper $editMapper,
		private readonly PhotoIndexMapper $indexMapper,
		private readonly IRootFolder $rootFolder,
		private readonly IDBConnection $connection,
		private readonly ITimeFactory $time,
		private readonly string $userId,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	#[NoAdminRequired]
	public function get(int $fileId): JSONResponse {
		if (!$this->userCanAccess($fileId)) {
			return new JSONResponse(['error' => 'not found'], Http::STATUS_NOT_FOUND);
		}

		$row = $this->editMapper->getForUserFile($this->userId, $fileId);
		return new JSONResponse([
			'fileId' => $fileId,
			'takenAt' => $row['taken_at'] ?? null,
			'gpsLat' => $row['gps_lat'] ?? null,
			'gpsLng' => $row['gps_lng'] ?? null,
		]);
	}

	/**
	 * Body shape — every field is optional. Sending a field with
	 * `null` clears the override; omitting a field leaves it
	 * untouched (read-merge-write under the hood).
	 *
	 * Validation is permissive on dates (any reasonable unix epoch)
	 * and tight on GPS (-90..90 / -180..180). Out-of-range coords
	 * are 422 rather than silently clamped.
	 */
	#[NoAdminRequired]
	public function put(
		int $fileId,
		?int $takenAt = null,
		?float $gpsLat = null,
		?float $gpsLng = null,
	): JSONResponse {
		if (!$this->userCanAccess($fileId)) {
			return new JSONResponse(['error' => 'not found'], Http::STATUS_NOT_FOUND);
		}

		$body = $this->request->getParams();

		// Build the merged "what to store" by reading the existing
		// row and only overwriting fields the caller actually
		// supplied. The framework dispatcher gives us the params as
		// nullable scalars without a way to distinguish "not sent"
		// from "sent as null" — so we look at the raw $body to get
		// that signal.
		$existing = $this->editMapper->getForUserFile($this->userId, $fileId);
		$merged = [
			'taken_at' => array_key_exists('takenAt', $body) ? $takenAt : ($existing['taken_at'] ?? null),
			'gps_lat' => array_key_exists('gpsLat', $body) ? $gpsLat : ($existing['gps_lat'] ?? null),
			'gps_lng' => array_key_exists('gpsLng', $body) ? $gpsLng : ($existing['gps_lng'] ?? null),
		];

		if ($merged['gps_lat'] !== null && ($merged['gps_lat'] < -90 || $merged['gps_lat'] > 90)) {
			return new JSONResponse(['error' => 'gpsLat out of range'], Http::STATUS_UNPROCESSABLE_ENTITY);
		}
		if ($merged['gps_lng'] !== null && ($merged['gps_lng'] < -180 || $merged['gps_lng'] > 180)) {
			return new JSONResponse(['error' => 'gpsLng out of range'], Http::STATUS_UNPROCESSABLE_ENTITY);
		}

		$this->editMapper->upsert(
			$this->userId,
			$fileId,
			$merged['taken_at'],
			$merged['gps_lat'],
			$merged['gps_lng'],
			$this->time->getTime(),
		);

		// Reflect the date edit into the user's index row so the
		// timeline ORDER BY picks it up immediately. We only touch
		// `taken_at` — keeping mtime intact lets future "sort by
		// upload time" toggles work without re-deriving anything.
		// On clear (taken_at=null), reset the index back to the
		// EXIF / mtime fallback by reading the file's actual EXIF.
		if (array_key_exists('takenAt', $body)) {
			$resolvedTakenAt = $merged['taken_at'] ?? $this->resolveOriginalTakenAt($fileId);
			if ($resolvedTakenAt !== null) {
				$this->updateIndexTakenAt($fileId, $resolvedTakenAt);
			}
		}

		return new JSONResponse([
			'fileId' => $fileId,
			'takenAt' => $merged['taken_at'],
			'gpsLat' => $merged['gps_lat'],
			'gpsLng' => $merged['gps_lng'],
		]);
	}

	private function userCanAccess(int $fileId): bool {
		try {
			$nodes = $this->rootFolder->getUserFolder($this->userId)->getById($fileId);
			return !empty($nodes);
		} catch (\Throwable) {
			return false;
		}
	}

	/**
	 * Read the file's mtime from the user's view of the file —
	 * used as the fallback "original" date when the user clears
	 * their override and the EXIF metadata isn't accessible.
	 */
	private function resolveOriginalTakenAt(int $fileId): ?int {
		try {
			$nodes = $this->rootFolder->getUserFolder($this->userId)->getById($fileId);
			if ($nodes === []) {
				return null;
			}
			return $nodes[0]->getMTime();
		} catch (\Throwable) {
			return null;
		}
	}

	/**
	 * Direct UPDATE on `oc_photos_index.taken_at` for the (user,
	 * file) row. Bypasses the mapper because that's a public API
	 * meant for inserts — a one-off taken_at refresh isn't worth a
	 * dedicated method there.
	 */
	private function updateIndexTakenAt(int $fileId, int $takenAt): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->update('photos_index')
			->set('taken_at', $qb->createNamedParameter($takenAt, IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('user_id', $qb->createNamedParameter($this->userId)))
			->andWhere($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}
}
