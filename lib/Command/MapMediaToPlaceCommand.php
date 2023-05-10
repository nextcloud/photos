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

use OCP\IConfig;
use OCP\IUserManager;
use OCP\Files\IRootFolder;
use OCP\Files\Folder;
use OCA\Photos\Service\MediaPlaceManager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class MapMediaToPlaceCommand extends Command {
	public function __construct(
		private IRootFolder $rootFolder,
		private MediaPlaceManager $mediaPlaceManager,
		private IConfig $config,
		private IUserManager $userManager,
	) {
		parent::__construct();
	}

	/**
	 * Configure the command
	 */
	protected function configure(): void {
		$this->setName('photos:map-media-to-place')
			->setDescription('Reverse geocode media coordinates.')
			->addOption('user', 'u', InputOption::VALUE_REQUIRED, 'Limit the mapping to a user.', null);
	}

	/**
	 * Execute the command
	 */
	protected function execute(InputInterface $input, OutputInterface $output): int {
		if (!$this->config->getSystemValueBool('enable_file_metadata', true)) {
			throw new \Exception('File metadata is not enabled.');
		}

		$userId = $input->getOption('user');
		if ($userId === null) {
			$this->scanForAllUsers($output);
		} else {
			$this->scanFilesForUser($userId, $output);
		}

		return 0;
	}

	private function scanForAllUsers(OutputInterface $output): void {
		$users = $this->userManager->search('');

		$output->writeln("Scanning all users:");
		foreach ($users as $user) {
			$this->scanFilesForUser($user->getUID(), $output);
		}
	}

	private function scanFilesForUser(string $userId, OutputInterface $output): void {
		$userFolder = $this->rootFolder->getUserFolder($userId);
		$output->write(" - Scanning files for $userId");
		$startTime = time();
		$count = $this->scanFolder($userFolder);
		$timeElapse = time() - $startTime;
		$output->writeln(" - $count files, $timeElapse sec");
	}

	private function scanFolder(Folder $folder): int {
		$count = 0;

		// Do not scan share and other moveable mounts.
		if ($folder->getMountPoint() instanceof \OC\Files\Mount\MoveableMount) {
			return $count;
		}

		foreach ($folder->getDirectoryListing() as $node) {
			if ($node instanceof Folder) {
				$count += $this->scanFolder($node);
				continue;
			}

			if (!str_starts_with($node->getMimeType(), 'image')) {
				continue;
			}

			$this->mediaPlaceManager->setPlaceForFile($node->getId());
			$count++;
		}

		return $count;
	}
}
