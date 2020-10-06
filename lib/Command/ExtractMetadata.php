<?php
declare(strict_types=1);


namespace OCA\Photos\Command;

use OCP\Encryption\IManager;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCP\Files\NotFoundException;
use OCP\IConfig;
use OCP\IUser;
use OCP\IUserManager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

use OCA\Photos\Db\PhotoMetadata;
use OCA\Photos\Db\PhotoMetadataMapper;
use OCA\Photos\Service\MetadataService;

class ExtractMetadata extends Command {

	/** @var IUserManager */
	protected $userManager;

	/** @var IRootFolder */
	protected $rootFolder;

	/** @var IConfig */
	protected $config;

	/** @var OutputInterface */
	protected $output;

	/** @var IManager */
	protected $encryptionManager;

	/** @var PhotoMetadataMapper */
	private $photoMetadataMapper;

	/** @var MetadataService */
	private $metadataService;

	public function __construct(IRootFolder $rootFolder,
		IUserManager $userManager,
		IConfig $config,
		IManager $encryptionManager,
		PhotoMetadataMapper $photoMetadataMapper,
		MetadataService $metadataService) {
		parent::__construct();

		$this->userManager = $userManager;
		$this->rootFolder = $rootFolder;
		$this->config = $config;
		$this->encryptionManager = $encryptionManager;
		$this->photoMetadataMapper = $photoMetadataMapper;
		$this->metadataService = $metadataService;
	}

	protected function configure() {
		$this
			->setName('photos:extractmetadata')
			->setDescription('extract metadata from image files: date taken, location...')
			->addArgument(
				'user_id',
				InputArgument::OPTIONAL,
				'extract photo metadata for the given user'
			)->addOption(
				'path',
				'p',
				InputOption::VALUE_OPTIONAL,
				'limit extraction to this photo folder(album), eg. --path="/alice/files/Photos/2020-3/", the user_id is determined by the path and the user_id parameter is ignored'
			);
	}

	protected function execute(InputInterface $input, OutputInterface $output): int {
		if ($this->encryptionManager->isEnabled()) {
			$output->writeln('Encryption is enabled. Aborted.');
			return 1;
		}

		$this->output = $output;

		$inputPath = $input->getOption('path');
		if ($inputPath) {
			$inputPath = '/' . trim($inputPath, '/');
			list (, $userId,) = explode('/', $inputPath, 3);
			$user = $this->userManager->get($userId);
			if ($user !== null) {
				$this->extractPathPhotosMetadata($user, $inputPath);
			}
		} else {
			$userId = $input->getArgument('user_id');
			if ($userId === null) {
				$this->userManager->callForSeenUsers(function (IUser $user) {
					$this->extractUserPhotosMetadata($user);
				});
			} else {
				$user = $this->userManager->get($userId);
				if ($user !== null) {
					$this->extractUserPhotosMetadata($user);
				}
			}
		}

		return 0;
	}

	private function extractPathPhotosMetadata(IUser $user, string $path) {
		\OC_Util::tearDownFS();
		\OC_Util::setupFS($user->getUID());
		$userFolder = $this->rootFolder->getUserFolder($user->getUID());
		try {
			$relativePath = $userFolder->getRelativePath($path);
		} catch (NotFoundException $e) {
			$this->output->writeln('Path not found');
			return;
		}
		$pathFolder = $userFolder->get($relativePath);
		$this->parseFolder($pathFolder);
	}

	private function extractUserPhotosMetadata(IUser $user) {
		\OC_Util::tearDownFS();
		\OC_Util::setupFS($user->getUID());

		$userFolder = $this->rootFolder->getUserFolder($user->getUID());
		$this->parseFolder($userFolder);

	}

	private function parseFolder(Folder $folder) {
		// Respect the '.nomedia' file. If present don't traverse the folder
		if ($folder->nodeExists('.nomedia')) {
			$this->output->writeln('Skipping folder ' . $folder->getPath());
			return;
		}

		$this->output->writeln('Scanning folder ' . $folder->getPath());

		$nodes = $folder->getDirectoryListing();

		foreach ($nodes as $node) {
			if ($node instanceof Folder) {
				$this->parseFolder($node);
			} else if ($node instanceof File) {
				$this->parseFile($node);
			}
		}
	}

	private function parseFile(File $file) {
		if ($this->output->getVerbosity() > OutputInterface::VERBOSITY_VERBOSE) {
			$this->output->writeln('Extracting metadata from  ' . $file->getPath());
		}
		$mimeType = \OC::$server->getMimeTypeDetector()->detectPath($file->getPath());
		if (in_array($mimeType, ['image/jpeg'])) {
			$fileStorage = $file->getStorage();
    	$tempStream = $fileStorage->fopen($file->getInternalPath(),'r');
			$photoMetadata = $this->metadataService->extractPhotoMetadata($tempStream,$file->getId());
			fclose($tempStream);
			$this->photoMetadataMapper->insert($photoMetadata);
		}
	}

}

