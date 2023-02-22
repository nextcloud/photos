<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\Photos\Command;

use OCA\Photos\Service\ReverseGeoCoderService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class UpdateReverseGeocodingFilesCommand extends Command {
	public function __construct(
		private ReverseGeoCoderService $rgcService,
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
			$this->rgcService->buildKDTree(true);
		} catch (\Exception $ex) {
			$output->writeln('<error>Failed to update reverse geocoding files</error>');
			$output->writeln($ex->getMessage());
			return 1;
		}

		return 0;
	}
}
