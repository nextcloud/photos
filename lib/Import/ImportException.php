<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Import;

/**
 * An import that cannot run or failed, with a message for the user.
 */
class ImportException extends \Exception {
}
