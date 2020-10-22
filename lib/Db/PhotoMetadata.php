<?php
namespace OCA\Photos\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class PhotoMetadata extends Entity implements JsonSerializable {

    protected $fileId;
    protected $dateTimeOriginal;
		protected $gpsLatitude;
		protected $gpsLongitude;
		protected $gpsLatitudeRef;
		protected $gpsLongitudeRef;
		protected $path;

    public function __construct() {
			$this->addType('id','integer');
			$this->addType('fileId','integer');
     }

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'dateTimeOriginal' => $this->dateTimeOriginal,
            'gpsLatitude' => $this->gpsLatitude,
						'gpsLongitude' => $this->gpsLongitude,
						'gpsLatitudeRefl' => $this->gpsLatitudeRef,
						'gpsLongitudeRef'  => $this->gpsLongitudeRef,
						'path' => $this->path,
        ];
    }
}

?>
