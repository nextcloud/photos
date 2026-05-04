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
 * Append-only activity log for shared albums. Each row is
 * "actor X did action A in album Y at time T" — for example
 * "Bob added 12 photos" or "Alice reacted with ❤️ to IMG_001".
 *
 * `target_id` is overloaded: for `add_file` / `remove_file` /
 * `react_add` / `react_remove` it points at the affected file_id;
 * for share/unshare events it points at the collaborator id (in
 * which case `target_kind` flips to 'user' / 'group'). The flat
 * shape avoids a join-per-action-type without committing to a
 * separate event-payload column.
 *
 * Index on `(album_id, created_at DESC)` is the feed query — give
 * me the most recent N events for this album.
 */
#[CreateTable(table: 'photos_activity', description: 'Append-only activity log for shared photo albums')]
class Version34000Date20260509000000 extends SimpleMigrationStep {

	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if ($schema->hasTable('photos_activity')) {
			return null;
		}

		$table = $schema->createTable('photos_activity');
		$table->addColumn('id', Types::BIGINT, [
			'autoincrement' => true,
			'notnull' => true,
			'unsigned' => true,
		]);
		$table->addColumn('album_id', Types::BIGINT, [
			'notnull' => true,
			'unsigned' => true,
		]);
		$table->addColumn('actor_id', Types::STRING, [
			'notnull' => true,
			'length' => 64,
		]);
		// add_file | remove_file | react_add | react_remove |
		// share_added | share_removed | album_renamed
		$table->addColumn('action', Types::STRING, [
			'notnull' => true,
			'length' => 32,
		]);
		// Affected entity. For file-related actions = file_id; for
		// share-related = collaborator id; for album-renamed = the
		// new name (truncated). Stored as string so we don't have
		// to keep a discriminator column on the SELECT path.
		$table->addColumn('target_id', Types::STRING, [
			'notnull' => false,
			'length' => 255,
		]);
		// 'file' | 'user' | 'group' | 'name'. Lets the feed renderer
		// pick the right "Bob added IMG_001" vs "Bob shared with
		// alice" template without re-deriving from `action`.
		$table->addColumn('target_kind', Types::STRING, [
			'notnull' => false,
			'length' => 16,
		]);
		// JSON-encoded extra payload — emoji for reactions, anything
		// else future actions might need. Kept opt-in so SELECTs
		// don't pay the parse cost when we don't need it.
		$table->addColumn('payload', Types::TEXT, [
			'notnull' => false,
		]);
		$table->addColumn('created_at', Types::BIGINT, [
			'notnull' => true,
			'default' => 0,
			'unsigned' => true,
		]);

		$table->setPrimaryKey(['id'], 'photos_activity_pk');
		$table->addIndex(['album_id', 'created_at'], 'photos_activity_feed');

		return $schema;
	}
}
