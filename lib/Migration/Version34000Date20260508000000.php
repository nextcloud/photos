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
 * Per-photo reactions on shared albums. Each row is "user X
 * reacted with emoji E to file F in album A".
 *
 * Why scoped to (album_id, file_id, user_id, emoji) instead of just
 * file_id: the same photo can be a member of multiple albums and a
 * user may want to leave different reactions in different sharing
 * contexts. Plus when an album is unshared, scoping the cleanup to
 * its album_id keeps reactions on other albums intact.
 *
 * One emoji per (user, photo, album) — toggling the same emoji
 * twice removes the reaction (DELETE on PK collision in the
 * controller).
 */
#[CreateTable(table: 'photos_reactions', description: 'Emoji reactions on photos in shared albums')]
class Version34000Date20260508000000 extends SimpleMigrationStep {

	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if ($schema->hasTable('photos_reactions')) {
			return null;
		}

		$table = $schema->createTable('photos_reactions');
		$table->addColumn('album_id', Types::BIGINT, [
			'notnull' => true,
			'unsigned' => true,
		]);
		$table->addColumn('file_id', Types::BIGINT, [
			'notnull' => true,
			'unsigned' => true,
		]);
		$table->addColumn('user_id', Types::STRING, [
			'notnull' => true,
			'length' => 64,
		]);
		// 16 bytes is enough for the longest emoji we surface — most
		// are 1–2 codepoints, some flags / family compositions go up
		// to 11 bytes (4 codepoints + zero-width joiners).
		$table->addColumn('emoji', Types::STRING, [
			'notnull' => true,
			'length' => 16,
		]);
		$table->addColumn('created_at', Types::BIGINT, [
			'notnull' => true,
			'default' => 0,
			'unsigned' => true,
		]);

		// One reaction per (album, file, user, emoji) — toggling the
		// same emoji twice removes the row.
		$table->setPrimaryKey(['album_id', 'file_id', 'user_id', 'emoji'], 'photos_reactions_pk');
		// Lookup-by-album for the album-view feed, lookup-by-file for
		// the slideshow's "what reactions does this photo have" query.
		$table->addIndex(['album_id', 'file_id'], 'photos_reactions_album_file');

		return $schema;
	}
}
