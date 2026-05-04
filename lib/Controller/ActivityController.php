<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\DB\PhotoActivityMapper;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;
use OCP\Share\IShare;

/**
 * Read-only activity feed for an album. Auth model matches
 * ReactionsController — owner or recipient sees the feed; no one
 * else can.
 *
 * The list is intentionally chunky (most recent 50 events) rather
 * than paginated. The only consumer right now is the album
 * sidebar, which doesn't need infinite scroll; if a future
 * surface needs it we'll add `?before=…` like the indexed
 * timeline.
 */
class ActivityController extends Controller {
	public function __construct(
		IRequest $request,
		private readonly PhotoActivityMapper $mapper,
		private readonly AlbumMapper $albumMapper,
		private readonly string $userId,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	#[NoAdminRequired]
	public function get(int $albumId, int $limit = 50): JSONResponse {
		if (!$this->userCanAccess($albumId)) {
			return new JSONResponse([], Http::STATUS_NOT_FOUND);
		}

		$rows = $this->mapper->getRecent($albumId, $limit);
		// camelCase the keys for the frontend; everything else
		// passes through.
		$items = array_map(static fn (array $r): array => [
			'id' => $r['id'],
			'albumId' => $r['album_id'],
			'actorId' => $r['actor_id'],
			'action' => $r['action'],
			'targetId' => $r['target_id'],
			'targetKind' => $r['target_kind'],
			'payload' => $r['payload'],
			'createdAt' => $r['created_at'],
		], $rows);
		return new JSONResponse(['items' => $items]);
	}

	private function userCanAccess(int $albumId): bool {
		try {
			$album = $this->albumMapper->get($albumId);
			if ($album === null) {
				return false;
			}
			if ($album->getUserId() === $this->userId) {
				return true;
			}
			foreach ($this->albumMapper->getSharedAlbumsForCollaborator($this->userId, IShare::TYPE_USER) as $shared) {
				if ($shared->getId() === $albumId) {
					return true;
				}
			}
			return false;
		} catch (\Throwable) {
			return false;
		}
	}
}
