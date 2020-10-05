<?php
// db/FileCacheMapper.php

namespace OCA\Photos\Db;

use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;
use OCP\AppFramework\Db\QBMapper;
use OCP\AppFramework\Db\DoesNotExistException;

class PhotoMetadataMapper extends QBMapper {

  private $table_name = 'photosmetadata';

  public function __construct(IDBConnection $db) {
    parent::__construct($db, $this->table_name,PhotoMetadata::class);
  }

  public function find(int $fileId){
    $qb = $this->db->getQueryBuilder();

    $qb->select('*')
       ->from($this->table_name)
       ->where(
         $qb->expr()->eq('file_id', $qb->createNamedParameter($fileId, IQueryBuilder::PARAM_INT))
       );
    try{
      return $this->findEntity($qb);
    }catch(DoesNotExistException $e){
      return null;
    }

  }
  /**
   * @throws \OCP\AppFramework\Db\DoesNotExistException if not found
   *
   *  @param array $fileIds
   */
  public function findAll(array $fileIds) {
    $qb = $this->db->getQueryBuilder();

    $qb->select('*')
       ->from($this->table_name);

		$filesMetadata = $this->findEntities($qb);
		return array_filter($filesMetadata, function($fileMetadata) use ($fileIds) {
			return in_array($fileMetadata->getFileId(),$fileIds);
		});
  }
}
