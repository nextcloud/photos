<?php
namespace OCA\Photos\Service;

use OCA\Photos\Db\PhotoMetadata;
use OCP\Files\File;

class MetadataService {
	
	public function __construct() {
	}

	public function extractPhotoMetadata(File $file): PhotoMetadata {
    $fileStorage = $file->getStorage();
    $tempStream = $fileStorage->fopen($file->getInternalPath(),'r');
		$metadata = exif_read_data($tempStream);
		fclose($tempStream);
		$metadata = [
			'DateTimeOriginal' => $metadata['DateTimeOriginal'] ?? "",
			'GPSLatitude' => implode('-',$metadata['GPSLatitude']) ?? "",
			'GPSLongitude' => implode('-',$metadata['GPSLongitude']) ?? "",
			'GPSLatitudeRef' => $metadata['GPSLatitudeRef'] ?? "",
			'GPSLongitudeRef' => $metadata['GPSLongitudeRef'] ?? ""
		];
		// save metadatat to database
		$photoMetadata = new PhotoMetadata();
		$photoMetadata->setFileId($file->getId());
		$photoMetadata->setDateTimeOriginal($metadata['DateTimeOriginal']);
		$photoMetadata->setGpsLatitude($metadata['GPSLatitude']);
		$photoMetadata->setGpsLongitude($metadata['GPSLongitude']);
		$photoMetadata->setGpsLatitudeRef($metadata['GPSLatitudeRef']);
		$photoMetadata->setGpsLongitudeRef($metadata['GPSLongitudeRef']);
		return $photoMetadata;
	}
}


?>
