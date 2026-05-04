<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\Album\AlbumMapper;
use OCA\Photos\DB\PhotoReactionMapper;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IRequest;
use OCP\Share\IShare;

/**
 * Emoji reactions on photos in (shared or owned) albums.
 *
 *   GET  /api/v1/albums/{albumId}/files/{fileId}/reactions
 *        → list of {emoji, userId, createdAt}, oldest first.
 *   POST /api/v1/albums/{albumId}/files/{fileId}/reactions
 *        body: {emoji}
 *        → toggles: returns {added: bool} so the client knows
 *        whether the row exists post-call.
 *
 * Authorisation: the user must have access to the album. We check
 * via the existing `AlbumMapper` — if the album belongs to them or
 * is shared with them, reactions are allowed; otherwise 404.
 *
 * Why the toggle semantic instead of separate POST + DELETE: the
 * UI is a single emoji button — tap to add, tap again to remove.
 * Modeling that as one round trip keeps the optimistic-update
 * logic on the client trivially simple.
 */
class ReactionsController extends Controller {
	private const ALLOWED_EMOJI = [
		'❤️', '👍', '🔥', '😂', '😮', '😢',
	];

	public function __construct(
		IRequest $request,
		private readonly PhotoReactionMapper $mapper,
		private readonly AlbumMapper $albumMapper,
		private readonly ITimeFactory $time,
		private readonly string $userId,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	#[NoAdminRequired]
	public function get(int $albumId, int $fileId): JSONResponse {
		if (!$this->userCanAccess($albumId)) {
			return new JSONResponse([], Http::STATUS_NOT_FOUND);
		}
		$rows = $this->mapper->getForFile($albumId, $fileId);

		// Aggregate by emoji + per-emoji user list. Frontend uses
		// the user list to render avatar tooltips and decide
		// whether the current user has already reacted.
		$summary = [];
		foreach ($rows as $row) {
			$emoji = $row['emoji'];
			if (!isset($summary[$emoji])) {
				$summary[$emoji] = ['emoji' => $emoji, 'count' => 0, 'userIds' => [], 'reactedByMe' => false];
			}
			$summary[$emoji]['count']++;
			$summary[$emoji]['userIds'][] = $row['user_id'];
			if ($row['user_id'] === $this->userId) {
				$summary[$emoji]['reactedByMe'] = true;
			}
		}

		return new JSONResponse([
			'fileId' => $fileId,
			'albumId' => $albumId,
			'reactions' => array_values($summary),
		]);
	}

	#[NoAdminRequired]
	public function toggle(int $albumId, int $fileId, string $emoji): JSONResponse {
		if (!$this->userCanAccess($albumId)) {
			return new JSONResponse(['error' => 'not found'], Http::STATUS_NOT_FOUND);
		}
		// Whitelist the emoji set so the column stays narrow and
		// the frontend can render a fixed bar without worrying about
		// arbitrary unicode. Future expansion: read from a config or
		// take the emoji set from the user.
		if (!in_array($emoji, self::ALLOWED_EMOJI, true)) {
			return new JSONResponse(['error' => 'unsupported emoji'], Http::STATUS_UNPROCESSABLE_ENTITY);
		}

		$added = $this->mapper->toggle($albumId, $fileId, $this->userId, $emoji, $this->time->getTime());
		return new JSONResponse(['added' => $added]);
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
			// Shared with the user — `AlbumMapper::getSharedAlbumsForCollaborator`
			// returns every album the user can see via collaborator
			// rows; cheaper than re-resolving the share graph.
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
