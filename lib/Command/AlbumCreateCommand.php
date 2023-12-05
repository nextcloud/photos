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

use OCP\IUserManager;
use OCA\Photos\Album\AlbumMapper;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;


class AlbumCreateCommand extends Command {
        private IUserManager $userManager;
        private AlbumMapper $albumMapper;

        public function __construct(
                AlbumMapper $albumMapper,
                IUserManager $userManager,
        ) {
                $this->userManager = $userManager;
                $this->albumMapper = $albumMapper;
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
                        ->addOption('location', 'l', InputOption::VALUE_REQUIRED, 'Set album location (optional)', "");
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

                $album = $this->albumMapper->getByName($albumString);
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