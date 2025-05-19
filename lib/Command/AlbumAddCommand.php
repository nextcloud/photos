<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\Photos\Command;

use OCA\Photos\Album\AlbumMapper;
use OCP\Files\IRootFolder;
use OCP\IUserManager;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class AlbumAddCommand extends Command {

	public function __construct(
		private readonly AlbumMapper $albumMapper,
		private readonly IRootFolder $rootFolder,
		private readonly IUserManager $userManager,
	) {
		parent::__construct();
	}

	/**
	 * Configure the command
	 */
	protected function configure(): void {
		$this->setName('photos:albums:add')
			->setDescription('Add specified photo to album')
			->addArgument('user', InputArgument::REQUIRED, 'User owning the album')
			->addArgument('album', InputArgument::REQUIRED, 'Album name')
			->addArgument('file', InputArgument::REQUIRED,
				'Path of file to add to the album. It must already be scanned and available in NextCloud. Example: Photos/picture1.jpg');
	}

	/**
	 * Execute the command
	 */
	protected function execute(InputInterface $input, OutputInterface $output): int {
		$userString = $input->getArgument('user');
		$albumString = $input->getArgument('album');
		$filePath = $input->getArgument('file');

		$user = $this->userManager->get($userString);
		if ($user === null) {
			throw new \Exception("User $userString was not found");
		}
		$userID = $user->getUID();

		try {
			$pictureFileID = $this->rootFolder->getUserFolder($userID)->get($filePath)->getId();
		} catch (\Exception $ex) {
			$output->writeln('<error>Invalid file path</error>');
			$output->writeln($ex->getMessage());
			return 1;
		}

		$album = $this->albumMapper->getByName($albumString, $userString);
		if (!$album) {
			throw new \Exception("Album $albumString was not found");
		}

		try {
			$this->albumMapper->addFile($album->getId(), $pictureFileID, $userID);
		} catch (\Exception $ex) {
			$output->writeln("<error>Problem adding $filePath to $albumString</error>");
			$output->writeln($ex->getMessage());
			return 1;
		}

		return 0;
	}
}
