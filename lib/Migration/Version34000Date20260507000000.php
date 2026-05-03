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
use OCP\Migration\Attributes\AddColumn;
use OCP\Migration\Attributes\ColumnType;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Denormalise the image dimensions onto `oc_photos_index`. The
 * justified-grid layout in the timeline reads `width` / `height` for
 * every visible tile to compute aspect ratio; storing them on the
 * index row lets the timeline endpoint serve the layout straight
 * from one SQL with no `oc_files_metadata` lookup at the photos-size
 * key.
 *
 * NULL until the next index pass populates them — the fields read
 * from EXIF metadata which the metadata pipeline writes
 * asynchronously, so a freshly-written file gets indexed first
 * (with NULL dimensions) and the dimensions land on the next
 * NodeWritten / metadata-event re-index. The frontend already has a
 * fallback aspect ratio for files without size metadata.
 */
#[AddColumn(table: 'photos_index', name: 'width', type: ColumnType::SMALLINT, description: 'Denormalised image width from photos-size metadata')]
#[AddColumn(table: 'photos_index', name: 'height', type: ColumnType::SMALLINT, description: 'Denormalised image height from photos-size metadata')]
class Version34000Date20260507000000 extends SimpleMigrationStep {

	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if (!$schema->hasTable('photos_index')) {
			return null;
		}

		$table = $schema->getTable('photos_index');
		$modified = false;

		if (!$table->hasColumn('width')) {
			$table->addColumn('width', Types::INTEGER, [
				'notnull' => false,
				'unsigned' => true,
			]);
			$modified = true;
		}
		if (!$table->hasColumn('height')) {
			$table->addColumn('height', Types::INTEGER, [
				'notnull' => false,
				'unsigned' => true,
			]);
			$modified = true;
		}

		return $modified ? $schema : null;
	}
}
