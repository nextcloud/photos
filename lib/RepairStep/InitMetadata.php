<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\RepairStep;

use OCA\Photos\Listener\OriginalDateTimeMetadataProvider;
use OCP\FilesMetadata\IFilesMetadataManager;
use OCP\FilesMetadata\Model\IMetadataValueWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;

class InitMetadata implements IRepairStep {
	public function __construct(
		private readonly IFilesMetadataManager $metadataManager,
	) {
	}

	public function getName(): string {
		return 'init metadata';
	}

	public function run(IOutput $output) {
		$this->metadataManager->initMetadata(OriginalDateTimeMetadataProvider::METADATA_KEY, IMetadataValueWrapper::TYPE_INT, true, IMetadataValueWrapper::EDIT_FORBIDDEN);
	}
}
