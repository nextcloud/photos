<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Exception;

/**
 * A rejected guest upload, carrying the HTTP status and a message safe to show the visitor.
 */
class GuestUploadException extends \Exception {
	public function __construct(
		string $message,
		public readonly int $status,
	) {
		parent::__construct($message);
	}
}
