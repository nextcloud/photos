<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Photos\Command;

use OCA\Photos\Album\AlbumMapper;
use OCP\IUserManager;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class AlbumCreateCommand extends Command {

	public function __construct(
		private readonly AlbumMapper $albumMapper,
		private readonly IUserManager $userManager,
	) {
		parent::__construct();
	}

	/**
	 * Configure the command
	 */
	protected function configure(): void {
		$this->setName('photos:albums:create')
			->setDescription('Create a new album for a user')
			->addArgument('user', InputArgument::REQUIRED, 'User to own album')
			->addArgument('album', InputArgument::REQUIRED, 'Album name')
			->addOption('location', 'l', InputOption::VALUE_REQUIRED, 'Set album location (optional)', '');
	}

	/**
	 * Execute the command
	 */
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$userString = $input->getArgument('user');
		$albumString = $input->getArgument('album');
		$location = $input->getOption('location');

		$user = $this->userManager->get($userString);
		if ($user === null) {
			throw new \Exception("User $userString was not found");
		}
		$userID = $user->getUID();

		$album = $this->albumMapper->getByName($albumString, $userString);
		if ($album) {
			throw new \Exception("Album $albumString already exists and cannot be created.");
		}

		try {
			$this->albumMapper->create($userID, $albumString, $location);
		} catch (\Exception $ex) {
			$output->writeln('<error>Problem creating album</error>');
			$output->writeln($ex->getMessage());
			return 1;
		}

		return 0;
	}
}
