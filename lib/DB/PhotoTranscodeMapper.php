<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\DB;

use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

/**
 * State machine for HLS transcode rows. Direct DB access (no
 * QBMapper) because the table uses `file_id` as PK rather than the
 * `id` column QBMapper expects.
 *
 * Concurrency: the worker uses `claimNextPending` to atomically move
 * a row from `pending → transcoding` so two cron ticks running at
 * once don't both try to ffmpeg the same file. `releaseTranscoding`
 * resets stale claims on startup in case a previous worker died
 * mid-run and left rows stuck.
 */
class PhotoTranscodeMapper {
	public const STATE_PENDING = 'pending';
	public const STATE_TRANSCODING = 'transcoding';
	public const STATE_READY = 'ready';
	public const STATE_FAILED = 'failed';
	public const STATE_UNSUPPORTED = 'unsupported';

	public function __construct(
		private readonly IDBConnection $connection,
	) {
	}

	public function markPending(int $fileId, int $now): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->insert('photos_transcodes')
			->values([
				'file_id' => $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT),
				'state' => $qb->createNamedParameter(self::STATE_PENDING),
				'attempts' => $qb->createNamedParameter(0, IQueryBuilder::PARAM_INT),
				'updated_at' => $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT),
			]);

		try {
			$qb->executeStatement();
		} catch (\OCP\DB\Exception $e) {
			if ($e->getReason() !== \OCP\DB\Exception::REASON_UNIQUE_CONSTRAINT_VIOLATION) {
				throw $e;
			}
			// Row already exists. Don't overwrite a `ready` row with
			// `pending` — that would re-queue files that are already
			// transcoded. Listener calls this on every node-write, so
			// we just leave terminal rows alone.
		}
	}

	/**
	 * Atomically reserve the oldest pending row. Returns the file_id
	 * of the claimed row, or null if nothing is pending.
	 *
	 * The UPDATE … WHERE state='pending' AND file_id IN (…) is the
	 * fence: only one worker observes the row in the pending state,
	 * so only one worker transitions it.
	 */
	public function claimNextPending(int $now): ?int {
		// Pick the oldest pending row under attempt-cap.
		$select = $this->connection->getQueryBuilder();
		$select->select('file_id')
			->from('photos_transcodes')
			->where($select->expr()->eq('state', $select->createNamedParameter(self::STATE_PENDING)))
			->andWhere($select->expr()->lt('attempts', $select->createNamedParameter(3, IQueryBuilder::PARAM_INT)))
			->orderBy('updated_at', 'ASC')
			->setMaxResults(1);
		$result = $select->executeQuery();
		$row = $result->fetch();
		$result->closeCursor();
		if ($row === false) {
			return null;
		}
		$fileId = (int)$row['file_id'];

		// Try to flip it. If another worker beat us to it the WHERE
		// clause won't match and we fall through to "no claim".
		$update = $this->connection->getQueryBuilder();
		$update->update('photos_transcodes')
			->set('state', $update->createNamedParameter(self::STATE_TRANSCODING))
			->set('updated_at', $update->createNamedParameter($now, IQueryBuilder::PARAM_INT))
			->set('attempts', $update->func()->add('attempts', $update->createNamedParameter(1, IQueryBuilder::PARAM_INT)))
			->where($update->expr()->eq('file_id', $update->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)))
			->andWhere($update->expr()->eq('state', $update->createNamedParameter(self::STATE_PENDING)));
		$rows = $update->executeStatement();
		return $rows === 1 ? $fileId : null;
	}

	public function markReady(int $fileId, int $now): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->update('photos_transcodes')
			->set('state', $qb->createNamedParameter(self::STATE_READY))
			->set('updated_at', $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT))
			->set('error_message', $qb->createNamedParameter(null))
			->where($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}

	public function markFailed(int $fileId, string $reason, int $now): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->update('photos_transcodes')
			->set('state', $qb->createNamedParameter(self::STATE_FAILED))
			->set('updated_at', $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT))
			->set('error_message', $qb->createNamedParameter(substr($reason, 0, 255)))
			->where($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}

	public function markUnsupported(int $fileId, string $reason, int $now): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->update('photos_transcodes')
			->set('state', $qb->createNamedParameter(self::STATE_UNSUPPORTED))
			->set('updated_at', $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT))
			->set('error_message', $qb->createNamedParameter(substr($reason, 0, 255)))
			->where($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}

	public function deleteByFileId(int $fileId): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->delete('photos_transcodes')
			->where($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}

	/**
	 * Reset rows stuck in `transcoding` from a previous worker that
	 * died mid-run. Called on job startup. The `now - 30min` cutoff
	 * keeps active workers' rows alone — they have at least 30
	 * minutes per file before the next tick reaps them.
	 */
	public function releaseStaleTranscoding(int $now): int {
		$cutoff = $now - 30 * 60;
		$qb = $this->connection->getQueryBuilder();
		$qb->update('photos_transcodes')
			->set('state', $qb->createNamedParameter(self::STATE_PENDING))
			->set('updated_at', $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('state', $qb->createNamedParameter(self::STATE_TRANSCODING)))
			->andWhere($qb->expr()->lt('updated_at', $qb->createNamedParameter($cutoff, IQueryBuilder::PARAM_INT)));
		return $qb->executeStatement();
	}

	/**
	 * @return string|null One of the STATE_* constants, or null if
	 *                     no row exists for this file_id.
	 */
	public function getState(int $fileId): ?string {
		$qb = $this->connection->getQueryBuilder();
		$qb->select('state')
			->from('photos_transcodes')
			->where($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$result = $qb->executeQuery();
		$row = $result->fetch();
		$result->closeCursor();
		return $row === false ? null : (string)$row['state'];
	}
}
