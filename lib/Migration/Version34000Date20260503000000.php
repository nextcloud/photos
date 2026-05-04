<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\DB\Types;
use OCP\Migration\Attributes\CreateTable;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Adds the per-user photo index table that the timeline API queries
 * directly. Without this, the timeline has to be re-derived from
 * filecache via DAV REPORT on every page load, which is the dominant
 * cost on large libraries (Memories app uses the same approach).
 *
 * `taken_at` is a denormalised copy of the EXIF DateTimeOriginal so
 * the timeline can sort by capture date with zero metadata joins. It
 * falls back to `mtime` at write time when EXIF is absent. `indexed_at`
 * lets the backfill job tell which rows are stale across a metadata
 * extractor change.
 */
#[CreateTable(table: 'photos_index', description: 'Per-user index of photos/videos for the timeline')]
class Version34000Date20260503000000 extends SimpleMigrationStep {

	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if ($schema->hasTable('photos_index')) {
			return null;
		}

		$table = $schema->createTable('photos_index');

		$table->addColumn('file_id', Types::BIGINT, [
			'notnull' => true,
			'unsigned' => true,
		]);
		$table->addColumn('user_id', Types::STRING, [
			'notnull' => true,
			'length' => 64,
		]);
		$table->addColumn('mimetype', Types::STRING, [
			'notnull' => true,
			'length' => 255,
		]);
		$table->addColumn('is_video', Types::SMALLINT, [
			'notnull' => true,
			'default' => 0,
			'unsigned' => true,
		]);
		$table->addColumn('size', Types::BIGINT, [
			'notnull' => true,
			'default' => 0,
			'unsigned' => true,
		]);
		$table->addColumn('mtime', Types::BIGINT, [
			'notnull' => true,
			'default' => 0,
			'unsigned' => true,
		]);
		$table->addColumn('taken_at', Types::BIGINT, [
			'notnull' => false,
			'unsigned' => true,
		]);
		$table->addColumn('indexed_at', Types::BIGINT, [
			'notnull' => true,
			'default' => 0,
			'unsigned' => true,
		]);

		// (user_id, file_id) is the natural primary — one row per user
		// per file (a single file can be visible to multiple users via
		// shares; each gets its own row so per-user filters / paging
		// don't have to join the share tables on every query).
		$table->setPrimaryKey(['user_id', 'file_id'], 'photos_index_pk');

		// Timeline query: ORDER BY (taken_at, mtime, file_id) DESC for
		// a fixed user. Composite index drives this directly.
		$table->addIndex(['user_id', 'taken_at', 'mtime'], 'photos_index_user_date');

		// Lookup by file_id alone for the NodeDeleted/Renamed listeners
		// (we don't always know which user a deletion event applies to;
		// shared files have multiple rows). Leading `user_id` in the PK
		// would force a full scan otherwise.
		$table->addIndex(['file_id'], 'photos_index_file');

		return $schema;
	}
}
