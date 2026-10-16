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
 * Adds the per-file HLS transcode state table. One row per video
 * file_id; the `state` column drives a small state machine:
 *
 *   pending     → queued for the worker to pick up
 *   transcoding → reserved by a worker (used to fence concurrent ticks)
 *   ready       → master.m3u8 + segments exist on disk
 *   failed      → ffmpeg errored (see `error_message`); skipped on
 *                 future passes unless `attempts` is explicitly reset
 *   unsupported → no video stream / bad container, won't retry
 *
 * `attempts` lets the worker back off on chronic failures (e.g.
 * truncated upload). The (state, updated_at) index is the worker's
 * pull query: "give me the oldest pending row to grab next".
 */
#[CreateTable(table: 'photos_transcodes', description: 'HLS transcode state per video file')]
class Version34000Date20260504000000 extends SimpleMigrationStep {

	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if ($schema->hasTable('photos_transcodes')) {
			return null;
		}

		$table = $schema->createTable('photos_transcodes');

		$table->addColumn('file_id', Types::BIGINT, [
			'notnull' => true,
			'unsigned' => true,
		]);
		$table->addColumn('state', Types::STRING, [
			'notnull' => true,
			'length' => 16,
			'default' => 'pending',
		]);
		$table->addColumn('attempts', Types::SMALLINT, [
			'notnull' => true,
			'default' => 0,
			'unsigned' => true,
		]);
		$table->addColumn('updated_at', Types::BIGINT, [
			'notnull' => true,
			'default' => 0,
			'unsigned' => true,
		]);
		$table->addColumn('error_message', Types::STRING, [
			'notnull' => false,
			'length' => 255,
		]);

		$table->setPrimaryKey(['file_id'], 'photos_transcodes_pk');
		$table->addIndex(['state', 'updated_at'], 'photos_transcodes_queue');

		return $schema;
	}
}
