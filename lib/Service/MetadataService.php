<?php
namespace OCA\Photos\Service;

use OCA\Photos\Db\PhotoMetadata;
use OCP\Files\File;

class MetadataService {
	
	public function __construct() {
	}

	public function extractPhotoMetadata($stream, int $fileId=-1): PhotoMetadata {
		$metadata = exif_read_data($stream);
		$metadata = [
			'DateTimeOriginal' => $metadata['DateTimeOriginal'] ?? "",
			'GPSLatitude' => implode('-',$metadata['GPSLatitude']) ?? "",
			'GPSLongitude' => implode('-',$metadata['GPSLongitude']) ?? "",
			'GPSLatitudeRef' => $metadata['GPSLatitudeRef'] ?? "",
			'GPSLongitudeRef' => $metadata['GPSLongitudeRef'] ?? ""
		];
		// save metadatat to database
		$photoMetadata = new PhotoMetadata();
		$photoMetadata->setFileId($fileId);
		$photoMetadata->setDateTimeOriginal($metadata['DateTimeOriginal']);
		$photoMetadata->setGpsLatitude($metadata['GPSLatitude']);
		$photoMetadata->setGpsLongitude($metadata['GPSLongitude']);
		$photoMetadata->setGpsLatitudeRef($metadata['GPSLatitudeRef']);
		$photoMetadata->setGpsLongitudeRef($metadata['GPSLongitudeRef']);
		return $photoMetadata;
	}
}


?>
