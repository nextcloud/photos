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
 * Per-file preview warmup queue. Tracks which photos have already
 * been pushed through `IPreview::getPreview` at the photos sizes,
 * so the background job knows what's left to warm.
 *
 * `file_id` is the PK (one row per file, not per-user) — the NC
 * preview cache is global, so warming once covers every user that
 * mounts the file.
 *
 * Same state-machine + (state, updated_at) shape as the transcode
 * queue. `attempts` lets the worker back off on broken files (e.g.
 * truncated upload, corrupt JPEG) so we don't retry forever.
 */
#[CreateTable(table: 'photos_preview_warmup', description: 'Tracks preview-cache warming progress per photo')]
class Version34000Date20260506000000 extends SimpleMigrationStep {

	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if ($schema->hasTable('photos_preview_warmup')) {
			return null;
		}

		$table = $schema->createTable('photos_preview_warmup');

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

		$table->setPrimaryKey(['file_id'], 'photos_preview_warmup_pk');
		$table->addIndex(['state', 'updated_at'], 'photos_preview_warmup_queue');

		return $schema;
	}
}
