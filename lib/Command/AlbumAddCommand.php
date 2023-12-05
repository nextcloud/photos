<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2022 Christian McHugh <mchugh19@hotmail.com>
 *
 * @author Christian McHugh <mchugh19@hotmail.com>
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

use OCP\Files\IRootFolder;
use OCP\IUserManager;
use OCA\Photos\Album\AlbumMapper;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;


class AlbumAddCommand extends Command {
        private IRootFolder $rootFolder;
        private IUserManager $userManager;
        private AlbumMapper $albumMapper;

        public function __construct(
                AlbumMapper $albumMapper,
                IRootFolder $rootFolder,
                IUserManager $userManager,
        ) {
                $this->rootFolder = $rootFolder;
                $this->userManager = $userManager;
                $this->albumMapper = $albumMapper;
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

                $album = $this->albumMapper->getByName($albumString);
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
