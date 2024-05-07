<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\RepairStep;

use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IMetadataValueWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;

class InitMetadata implements IRepairStep {
	public function __construct(
		private IFilesMetadataManager $metadataManager,
	) {
	}

	public function getName() {
		return 'init metadata';
	}

	public function run(IOutput $output) {
		$this->metadataManager->initMetadata('photos-original_date_time', IMetadataValueWrapper::TYPE_INT, true, IMetadataValueWrapper::EDIT_FORBIDDEN);
	}
}
