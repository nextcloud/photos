<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos;

use OCP\Config\Lexicon\Entry;
use OCP\Config\Lexicon\ILexicon;
use OCP\Config\Lexicon\Strictness;
use OCP\Config\ValueType;

class ConfigLexicon implements ILexicon {
	public const string AI_CAPTIONS = 'ai_captions';
	public const string AI_CAPTIONS_PER_HOUR = 'ai_captions_per_hour';

	#[\Override]
	public function getStrictness(): Strictness {
		return Strictness::IGNORE;
	}

	#[\Override]
	public function getAppConfigs(): array {
		return [
			new Entry(
				self::AI_CAPTIONS,
				ValueType::BOOL,
				defaultRaw: false,
				definition: 'Generate a one-line description of every new photo with the "Analyze images" task processing provider, used as alternative text and in the name search',
				note: 'Each photo is sent to the provider configured for "Analyze images" in the Artificial Intelligence admin settings, which can be an external service.',
			),
			new Entry(
				self::AI_CAPTIONS_PER_HOUR,
				ValueType::INT,
				defaultRaw: 60,
				definition: 'Maximum number of photo descriptions requested from the task processing provider per hour',
			),
		];
	}

	#[\Override]
	public function getUserConfigs(): array {
		return [];
	}
}
