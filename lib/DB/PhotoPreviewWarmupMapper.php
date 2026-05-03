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
 * Owns the small state machine on `oc_photos_preview_warmup`. The
 * design mirrors `PhotoTranscodeMapper` — cron-friendly atomic
 * `claimNextBatch`, attempts cap, stale-`warming` reaper — so the
 * two background jobs feel the same when reading their code.
 *
 * Where it differs: warming is fast (a few hundred milliseconds per
 * file vs minutes per video), so we hand back batches of fileIds
 * rather than one at a time. A single batch query → loop is much
 * cheaper than N round trips.
 */
class PhotoPreviewWarmupMapper {
	public const STATE_PENDING = 'pending';
	public const STATE_WARMING = 'warming';
	public const STATE_WARMED = 'warmed';
	public const STATE_FAILED = 'failed';

	public function __construct(
		private readonly IDBConnection $connection,
	) {
	}

	public function markPending(int $fileId, int $now): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->insert('photos_preview_warmup')
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
			// Row already exists. Don't overwrite a `warmed` row with
			// `pending` — that'd just re-warm files we've already done.
		}
	}

	/**
	 * Backfill rows for every file in `oc_photos_index` that doesn't
	 * yet have a warmup row. Used once on first install / migration
	 * to bootstrap existing libraries; the listener takes over for
	 * new uploads after that. Idempotent — repeated calls only insert
	 * file ids that are missing.
	 *
	 * Returns the number of rows added in this pass.
	 */
	public function backfillFromIndex(int $now, int $limit = 5000): int {
		// Pick file_ids from photos_index that don't have a warmup row.
		// LEFT JOIN + IS NULL is the portable way; chunked so a giant
		// fresh-install library doesn't cram one giant transaction.
		$qb = $this->connection->getQueryBuilder();
		$qb->selectDistinct('idx.file_id')
			->from('photos_index', 'idx')
			->leftJoin('idx', 'photos_preview_warmup', 'w', $qb->expr()->eq('idx.file_id', 'w.file_id'))
			->where($qb->expr()->isNull('w.file_id'))
			->setMaxResults($limit);

		$result = $qb->executeQuery();
		$inserted = 0;
		while ($row = $result->fetch()) {
			$this->markPending((int)$row['file_id'], $now);
			$inserted++;
		}
		$result->closeCursor();
		return $inserted;
	}

	/**
	 * Atomically claim a batch of pending rows. Returns the file
	 * ids that the caller is now responsible for warming. Empty
	 * array means the queue is drained.
	 *
	 * Implementation: select-then-update-where-pending fences us
	 * against another worker that grabbed the same rows in
	 * parallel — the second worker's UPDATE matches zero rows for
	 * the contended ids and they vanish from its claim list.
	 *
	 * @return list<int>
	 */
	public function claimNextBatch(int $now, int $batchSize): array {
		$select = $this->connection->getQueryBuilder();
		$select->select('file_id')
			->from('photos_preview_warmup')
			->where($select->expr()->eq('state', $select->createNamedParameter(self::STATE_PENDING)))
			->andWhere($select->expr()->lt('attempts', $select->createNamedParameter(3, IQueryBuilder::PARAM_INT)))
			->orderBy('updated_at', 'ASC')
			->setMaxResults($batchSize);
		$result = $select->executeQuery();
		$candidateIds = [];
		while ($row = $result->fetch()) {
			$candidateIds[] = (int)$row['file_id'];
		}
		$result->closeCursor();
		if ($candidateIds === []) {
			return [];
		}

		// Flip them to `warming` in one statement; only ones still
		// `pending` actually flip, so a parallel worker that grabbed
		// some earlier doesn't double-claim.
		$update = $this->connection->getQueryBuilder();
		$update->update('photos_preview_warmup')
			->set('state', $update->createNamedParameter(self::STATE_WARMING))
			->set('updated_at', $update->createNamedParameter($now, IQueryBuilder::PARAM_INT))
			->set('attempts', $update->func()->add('attempts', $update->createNamedParameter(1, IQueryBuilder::PARAM_INT)))
			->where($update->expr()->in('file_id', $update->createNamedParameter($candidateIds, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($update->expr()->eq('state', $update->createNamedParameter(self::STATE_PENDING)));
		$update->executeStatement();

		// Re-read to find which of the candidates we actually own.
		$verify = $this->connection->getQueryBuilder();
		$verify->select('file_id')
			->from('photos_preview_warmup')
			->where($verify->expr()->in('file_id', $verify->createNamedParameter($candidateIds, IQueryBuilder::PARAM_INT_ARRAY)))
			->andWhere($verify->expr()->eq('state', $verify->createNamedParameter(self::STATE_WARMING)))
			->andWhere($verify->expr()->eq('updated_at', $verify->createNamedParameter($now, IQueryBuilder::PARAM_INT)));
		$result = $verify->executeQuery();
		$claimed = [];
		while ($row = $result->fetch()) {
			$claimed[] = (int)$row['file_id'];
		}
		$result->closeCursor();
		return $claimed;
	}

	public function markWarmed(int $fileId, int $now): void {
		$this->setState($fileId, self::STATE_WARMED, $now);
	}

	public function markFailed(int $fileId, int $now): void {
		$this->setState($fileId, self::STATE_FAILED, $now);
	}

	private function setState(int $fileId, string $state, int $now): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->update('photos_preview_warmup')
			->set('state', $qb->createNamedParameter($state))
			->set('updated_at', $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}

	public function deleteByFileId(int $fileId): void {
		$qb = $this->connection->getQueryBuilder();
		$qb->delete('photos_preview_warmup')
			->where($qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT)));
		$qb->executeStatement();
	}

	/**
	 * Reset rows stuck in `warming` from a worker that died. 30-min
	 * cutoff matches the transcode mapper.
	 */
	public function releaseStaleWarming(int $now): int {
		$cutoff = $now - 30 * 60;
		$qb = $this->connection->getQueryBuilder();
		$qb->update('photos_preview_warmup')
			->set('state', $qb->createNamedParameter(self::STATE_PENDING))
			->set('updated_at', $qb->createNamedParameter($now, IQueryBuilder::PARAM_INT))
			->where($qb->expr()->eq('state', $qb->createNamedParameter(self::STATE_WARMING)))
			->andWhere($qb->expr()->lt('updated_at', $qb->createNamedParameter($cutoff, IQueryBuilder::PARAM_INT)));
		return $qb->executeStatement();
	}
}
