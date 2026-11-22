<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Photos\Xmp;

use DateTimeImmutable;
use OCP\Files\File;
use OCP\Files\Folder;
use OCP\Files\NotFoundException;
use OCP\IDateTimeZone;
use OCP\ITagManager;
use OCP\ITags;
use OCP\SystemTag\ISystemTagManager;
use OCP\SystemTag\ISystemTagObjectMapper;
use Psr\Log\LoggerInterface;

/**
 * Reads and writes the XMP sidecar files of photos.
 *
 * The sidecar of IMG_1234.jpg is IMG_1234.jpg.xmp, the name darktable,
 * digiKam and Immich write, which cannot be shared with a raw file of the
 * same shot. IMG_1234.xmp, the name Lightroom writes and which digiKam and
 * Immich read as well, is used when it is the only sidecar there is.
 */
class XmpSidecarManager {
	/** Sidecars above this size are left alone. */
	private const MAX_SIZE = 4 * 1024 * 1024;

	public function __construct(
		private readonly IDateTimeZone $dateTimeZone,
		private readonly ITagManager $tagManager,
		private readonly ISystemTagObjectMapper $systemTagObjectMapper,
		private readonly ISystemTagManager $systemTagManager,
		private readonly LoggerInterface $logger,
	) {
	}

	/**
	 * @return list<string> Names of the sidecar of a file, by preference
	 */
	public static function getSidecarNames(string $name): array {
		$names = [$name . '.xmp'];
		$baseName = pathinfo($name, PATHINFO_FILENAME);
		if ($baseName !== '' && $baseName !== $name) {
			$names[] = $baseName . '.xmp';
		}

		return $names;
	}

	public function findSidecar(File $photo): ?File {
		try {
			$folder = $photo->getParent();
		} catch (NotFoundException) {
			return null;
		}

		foreach (self::getSidecarNames($photo->getName()) as $name) {
			try {
				$sidecar = $folder->get($name);
			} catch (NotFoundException) {
				continue;
			}
			if ($sidecar instanceof File) {
				return $sidecar;
			}
		}

		return null;
	}

	public function read(File $photo): ?XmpPacket {
		$sidecar = $this->findSidecar($photo);
		if ($sidecar === null || $sidecar->getSize() > self::MAX_SIZE) {
			return null;
		}

		try {
			return XmpPacket::fromString($sidecar->getContent());
		} catch (\Exception $e) {
			$this->logger->info('Could not read the XMP sidecar of ' . $photo->getId(), ['exception' => $e]);
			return null;
		}
	}

	/**
	 * Store the corrected values of a photo in its sidecar, merged into the
	 * existing one if there is one. The favorite mark and the visible tags of
	 * the photo are added as a rating of 5 and as keywords.
	 *
	 * @param array{takenAt?: ?int, gps?: ?array{latitude: float, longitude: float}} $changes
	 *                                                                                        Values to write, NULL to remove one
	 * @return bool Whether the sidecar was written
	 */
	public function write(File $photo, string $userId, array $changes): bool {
		try {
			$folder = $photo->getParent();
			// A photo shared on its own has no folder of its owner to write to.
			if (!$folder->isCreatable() || $folder->getMountPoint()->getMountPoint() !== $photo->getMountPoint()->getMountPoint()) {
				return false;
			}

			$sidecar = $this->findSidecar($photo);
			if ($sidecar === null) {
				$name = $photo->getName() . '.xmp';
				$packet = XmpPacket::create();
			} elseif ($sidecar->isUpdateable() && $sidecar->getSize() <= self::MAX_SIZE) {
				$name = $sidecar->getName();
				// A sidecar which cannot be read is never replaced.
				$packet = XmpPacket::fromString($sidecar->getContent());
			} else {
				return false;
			}

			if (array_key_exists('takenAt', $changes)) {
				$takenAt = $changes['takenAt'];
				$packet->setDateTimeOriginal($takenAt === null
					? null
					: (new DateTimeImmutable('@' . $takenAt))->setTimezone($this->dateTimeZone->getTimeZone($takenAt, $userId)));
			}
			if (array_key_exists('gps', $changes)) {
				$packet->setCoordinates($changes['gps']);
			}
			if ($this->isFavorite($photo, $userId)) {
				$packet->setRating(5);
			}
			$packet->addSubjects($this->getTagNames($photo));

			$this->replaceFile($folder, $name, $packet->toString());
			return true;
		} catch (\Exception $e) {
			$this->logger->warning('Could not write the XMP sidecar of ' . $photo->getId(), ['exception' => $e]);
			return false;
		}
	}

	private function isFavorite(File $photo, string $userId): bool {
		$tags = $this->tagManager->load('files', [], false, $userId)?->getTagsForObjects([$photo->getId()]);

		return is_array($tags) && in_array(ITags::TAG_FAVORITE, $tags[$photo->getId()] ?? [], true);
	}

	/**
	 * @return list<string>
	 */
	private function getTagNames(File $photo): array {
		$fileId = (string)$photo->getId();
		$tagIds = $this->systemTagObjectMapper->getTagIdsForObjects([$fileId], 'files')[$fileId] ?? [];
		if ($tagIds === []) {
			return [];
		}

		$names = [];
		foreach ($this->systemTagManager->getTagsByIds($tagIds) as $tag) {
			if ($tag->isUserVisible()) {
				$names[] = $tag->getName();
			}
		}

		return $names;
	}

	/**
	 * Write a file through a temporary part file renamed over it, so that
	 * readers never see it half written. Part files are ignored by the file
	 * cache, the renamed file keeps the id of the file it replaces.
	 *
	 * @throws \RuntimeException
	 */
	private function replaceFile(Folder $folder, string $name, string $content): void {
		$storage = $folder->getStorage();
		$directory = $folder->getInternalPath() === '' ? '' : $folder->getInternalPath() . '/';
		$target = $directory . $name;
		$temporary = $directory . '.' . $name . '.' . bin2hex(random_bytes(6)) . '.part';

		if ($storage->file_put_contents($temporary, $content) === false) {
			throw new \RuntimeException('Could not write ' . $temporary);
		}
		if (!$storage->rename($temporary, $target)) {
			$storage->unlink($temporary);
			throw new \RuntimeException('Could not replace ' . $target);
		}

		$storage->getUpdater()->update($target);
	}
}
