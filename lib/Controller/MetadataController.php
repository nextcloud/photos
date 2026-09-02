<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Controller;

use OCA\Photos\AppInfo\Application;
use OCA\Photos\DB\PhotoMetadata;
use OCA\Photos\DB\PhotoMetadataMapper;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\JSONResponse;
use OCP\Constants;
use OCP\Files\IRootFolder;
use OCP\Files\Node;
use OCP\IRequest;
use OCP\IUserSession;

/**
 * Stores and returns user-editable photo details (description, rating).
 *
 * Access is always scoped to the current user's own files: a file id is only
 * ever resolved through that user's folder, so a caller can neither read nor
 * write details for a file they cannot see, and writing additionally requires
 * update permission on the file. CSRF protection is kept on the write.
 */
class MetadataController extends Controller {
	public function __construct(
		IRequest $request,
		private readonly PhotoMetadataMapper $mapper,
		private readonly IRootFolder $rootFolder,
		private readonly IUserSession $userSession,
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	#[NoAdminRequired]
	public function get(int $fileId): JSONResponse {
		if ($this->getAccessibleNode($fileId) === null) {
			return new JSONResponse(['message' => 'File not found'], Http::STATUS_NOT_FOUND);
		}

		return new JSONResponse($this->findOrEmpty($fileId));
	}

	#[NoAdminRequired]
	public function update(int $fileId, ?string $description = null, ?int $rating = null): JSONResponse {
		$node = $this->getAccessibleNode($fileId);
		if ($node === null) {
			return new JSONResponse(['message' => 'File not found'], Http::STATUS_NOT_FOUND);
		}

		if (($node->getPermissions() & Constants::PERMISSION_UPDATE) === 0) {
			return new JSONResponse(['message' => 'No permission to edit this file'], Http::STATUS_FORBIDDEN);
		}

		if ($rating !== null && ($rating < 0 || $rating > 5)) {
			return new JSONResponse(['message' => 'Rating must be between 0 and 5'], Http::STATUS_BAD_REQUEST);
		}

		$entity = $this->mapper->findByFileId($fileId);
		$isNew = $entity === null;
		if ($entity === null) {
			$entity = new PhotoMetadata();
			$entity->setFileId($fileId);
		}

		if ($description !== null) {
			// An empty description is stored as "no description" rather than "".
			$entity->setDescription($description === '' ? null : $description);
		}
		if ($rating !== null) {
			$entity->setRating($rating);
		}

		$isNew ? $this->mapper->insert($entity) : $this->mapper->update($entity);

		return new JSONResponse($entity);
	}

	/** The stored details, or an empty set so the response shape stays stable. */
	private function findOrEmpty(int $fileId): PhotoMetadata {
		$entity = $this->mapper->findByFileId($fileId);
		if ($entity !== null) {
			return $entity;
		}

		$empty = new PhotoMetadata();
		$empty->setFileId($fileId);
		return $empty;
	}

	/** The file for the id, only if the current user can actually access it. */
	private function getAccessibleNode(int $fileId): ?Node {
		$user = $this->userSession->getUser();
		if ($user === null) {
			return null;
		}

		$nodes = $this->rootFolder->getUserFolder($user->getUID())->getById($fileId);
		return $nodes[0] ?? null;
	}
}
