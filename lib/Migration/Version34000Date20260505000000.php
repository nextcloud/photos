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
 * Per-user EXIF override layer. Lets a user correct a photo's
 * capture time or GPS without rewriting the file on disk — the
 * edited values shadow the EXIF-derived ones in the photos UI
 * (timeline sort, View metadata, EXIF overlay) but the original
 * file stays byte-identical.
 *
 * (user_id, file_id) is the natural primary key — same as
 * `oc_photos_index`. A shared photo gets one override row per
 * recipient: bob's edit doesn't bleed into alice's view.
 *
 * `taken_at` and the GPS pair are NULLable; null means "no
 * override, fall back to the EXIF value". Read code coalesces
 * via `COALESCE(edits.taken_at, idx.taken_at)`.
 *
 * The columns that get added later (title, description, rating,
 * orientation) can be appended without breaking this migration —
 * each is its own NULLable column with no index dependency.
 */
#[CreateTable(table: 'photos_metadata_edits', description: 'Per-user EXIF overrides (date / GPS) for photos')]
class Version34000Date20260505000000 extends SimpleMigrationStep {

	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if ($schema->hasTable('photos_metadata_edits')) {
			return null;
		}

		$table = $schema->createTable('photos_metadata_edits');

		$table->addColumn('user_id', Types::STRING, [
			'notnull' => true,
			'length' => 64,
		]);
		$table->addColumn('file_id', Types::BIGINT, [
			'notnull' => true,
			'unsigned' => true,
		]);
		$table->addColumn('taken_at', Types::BIGINT, [
			'notnull' => false,
			'unsigned' => true,
		]);
		// Stored as DECIMAL(9,6): six decimal places gives ~11 cm
		// resolution at the equator — overkill for hand-corrected
		// locations, but DECIMAL avoids the float-precision drift
		// that would let "37.774900" round-trip as "37.7748999...".
		$table->addColumn('gps_lat', Types::DECIMAL, [
			'notnull' => false,
			'precision' => 9,
			'scale' => 6,
		]);
		$table->addColumn('gps_lng', Types::DECIMAL, [
			'notnull' => false,
			'precision' => 9,
			'scale' => 6,
		]);
		$table->addColumn('updated_at', Types::BIGINT, [
			'notnull' => true,
			'default' => 0,
			'unsigned' => true,
		]);

		$table->setPrimaryKey(['user_id', 'file_id'], 'photos_meta_edits_pk');
		// Look up by file alone for the NodeDeleted listener — we
		// drop every user's override when the source file goes away.
		$table->addIndex(['file_id'], 'photos_meta_edits_file');

		return $schema;
	}
}
