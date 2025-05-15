<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Photos\Command;

use OCA\Photos\Service\ReverseGeoCoderService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class UpdateReverseGeocodingFilesCommand extends Command {
	public function __construct(
		private readonly ReverseGeoCoderService $rgcService,
	) {
		parent::__construct();
	}

	/**
	 * Configure the command
	 */
	protected function configure(): void {
		$this->setName('photos:update-1000-cities')
			->setDescription('Update the list of 1000 and more inhabitant cities');
	}

	/**
	 * Execute the command
	 */
	protected function execute(InputInterface $input, OutputInterface $output): int {
		try {
			if (!$this->rgcService->arePlacesEnabled()) {
				throw new \Exception('Places is disabled');
			}

			$this->rgcService->buildKDTree(true);
		} catch (\Exception $ex) {
			$output->writeln('<error>Failed to update reverse geocoding files</error>');
			$output->writeln($ex->getMessage());
			return 1;
		}

		return 0;
	}
}
