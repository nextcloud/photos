/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Collection } from '../services/collectionFetcher.ts'

import { showConfirmation, showError } from '@nextcloud/dialogs'
import { t } from '@nextcloud/l10n'
import { isAxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { davClient } from '../services/DavClient.ts'
import { logger } from '../services/logger.ts'
import { SemaphoreWithPriority as Semaphore } from '../utils/semaphoreWithPriority.ts'
import { useFilesStore } from './files.ts'

export const collectionFilesExtraProps = ['<nc:photos-collection-file-original-filename />']

/**
 * Collections are indexed by their `filename`.
 */
export const useCollectionsStore = defineStore('collections', () => {
	// "photos/{userName}/{collection}/{collectionName}": Collection
	const collections = ref<Record<string, Collection>>({})
	// "photos/{userName}/{collection}/{collectionName}": ["1", "2", ...]
	const collectionsFiles = ref<Record<string, string[]>>({})

	/**
	 * @param prefix - Root the collections live under
	 */
	function collectionsWithPrefix(prefix: string): Record<string, Collection> {
		return Object.values(collections.value)
			.filter((collection) => collection.root === prefix)
			.reduce((collections, collection) => ({ ...collections, [collection.root + collection.path]: collection }), {} as Record<string, Collection>)
	}

	/**
	 * @param newCollections - Collections to index
	 */
	function addCollections(newCollections: Collection[]): void {
		collections.value = {
			...collections.value,
			...newCollections.reduce((collections, collection) => ({ ...collections, [collection.root + collection.path]: collection }), {}),
		}
	}

	/**
	 * @param collection - Collection to replace
	 */
	function updateCollectionState(collection: Collection): void {
		collections.value[collection.root + collection.path] = collection
	}

	/**
	 * @param collectionFileNames - Collections to forget
	 */
	function removeCollections(collectionFileNames: string[]): void {
		collectionFileNames.forEach((collectionFileName) => {
			delete collections.value[collectionFileName]
			delete collectionsFiles.value[collectionFileName]
		})
	}

	/**
	 * @param collectionFileName - Collection to fill
	 * @param fileIds - Files it holds
	 */
	function setCollectionFiles(collectionFileName: string, fileIds: string[] = []): void {
		collectionsFiles.value = {
			...collectionsFiles.value,
			[collectionFileName]: fileIds,
		}

		const collection = collections.value[collectionFileName]
		if (collection !== undefined) {
			collection.attributes.nbItems = fileIds.length
			collection.attributes['last-photo'] = Number.parseInt(fileIds[fileIds.length - 1])
		}
	}

	/**
	 * @param collectionFileName - Collection to add to
	 * @param fileIdsToAdd - Files to add
	 */
	function addFileIdsToCollection(collectionFileName: string, fileIdsToAdd: string[]): void {
		const collectionFiles = collectionsFiles.value[collectionFileName] || []
		collectionsFiles.value = {
			...collectionsFiles.value,
			[collectionFileName]: [...new Set([...collectionFiles, ...fileIdsToAdd])],
		}

		const collection = collections.value[collectionFileName]
		collection.attributes.nbItems += fileIdsToAdd.length
		collection.attributes['last-photo'] = Number.parseInt(fileIdsToAdd[fileIdsToAdd.length - 1])
	}

	/**
	 * @param collectionFileName - Collection to remove from
	 * @param fileIdsToRemove - Files to remove
	 */
	function removeFileIdsFromCollection(collectionFileName: string, fileIdsToRemove: string[]): void {
		collectionsFiles.value = {
			...collectionsFiles.value,
			[collectionFileName]: collectionsFiles.value[collectionFileName].filter((fileId) => !fileIdsToRemove.includes(fileId)),
		}

		const collection = collections.value[collectionFileName]
		collection.attributes.nbItems -= fileIdsToRemove.length
		if (fileIdsToRemove.includes(collection.attributes['last-photo'].toString())) {
			const remaining = collectionsFiles.value[collectionFileName]
			collection.attributes['last-photo'] = Number.parseInt(remaining[remaining.length])
		}
	}

	/**
	 * Copy files into a collection, and take them back out if the server refuses
	 *
	 * @param collectionFileName - Collection to add to
	 * @param fileIdsToAdd - Files to add
	 */
	async function addFilesToCollection(collectionFileName: string, fileIdsToAdd: string[]): Promise<unknown[]> {
		const semaphore = new Semaphore(5)

		addFileIdsToCollection(collectionFileName, fileIdsToAdd)

		const promises = fileIdsToAdd
			.map(async (fileId) => {
				const file = useFilesStore().files[fileId]
				const collection = collections.value[collectionFileName]
				const symbol = await semaphore.acquire()

				try {
					await davClient.copyFile(
						file.root + file.path,
						`${collection.root + collection.path}/${file.basename}`,
					)
				} catch (error) {
					if (isAxiosError(error) && error.response?.status !== 409) { // Already in the collection.
						removeFileIdsFromCollection(collectionFileName, [fileId])

						logger.error(t('photos', 'Failed to add {fileBaseName} to collection {collectionFileName}', { fileBaseName: file.basename, collectionFileName }), { error })
						showError(t('photos', 'Failed to add {fileBaseName} to collection {collectionFileName}', { fileBaseName: file.basename, collectionFileName }))
					}
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	}

	/**
	 * Delete files of a collection, and put them back if the server refuses
	 *
	 * @param collectionFileName - Collection to remove from
	 * @param fileIdsToRemove - Files to remove
	 */
	async function removeFilesFromCollection(collectionFileName: string, fileIdsToRemove: string[]): Promise<unknown[]> {
		const semaphore = new Semaphore(5)

		removeFileIdsFromCollection(collectionFileName, fileIdsToRemove)

		const promises = fileIdsToRemove
			.map(async (fileId) => {
				const file = useFilesStore().files[fileId]
				const symbol = await semaphore.acquire()

				try {
					await davClient.deleteFile(file.root + file.path)
				} catch (error) {
					addFileIdsToCollection(collectionFileName, [fileId])

					logger.error(t('photos', 'Failed to delete {fileBaseName}', { fileBaseName: file.basename }), { error })
					showError(t('photos', 'Failed to delete {fileBaseName}', { fileBaseName: file.basename }))
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	}

	/**
	 * @param collection - Collection to create
	 */
	async function createCollection(collection: Collection): Promise<Collection | undefined> {
		try {
			await davClient.createDirectory(collection.root + collection.path)
			addCollections([collection])
			return collection
		} catch (error) {
			logger.error(t('photos', 'Failed to create {collectionFileName}', { collectionFileName: collection.path }), { error })
			showError(t('photos', 'Failed to create {collectionFileName}', { collectionFileName: collection.path }))
		}
	}

	/**
	 * @param collectionFileName - Collection to rename
	 * @param newBaseName - Name to give it
	 */
	async function renameCollection(collectionFileName: string, newBaseName: string): Promise<Collection> {
		const collection = collections.value[collectionFileName]
		const newCollection = collection.clone()
		newCollection.rename(newBaseName)

		try {
			addCollections([newCollection])
			setCollectionFiles(newCollection.root + newCollection.path, collectionsFiles.value[collectionFileName])
			await davClient.moveFile(collection.root + collection.path, collection.root + newCollection.path, { overwrite: false })
			removeCollections([collectionFileName])
			return newCollection
		} catch (error) {
			removeCollections([collection.root + newCollection.path])
			logger.error(t('photos', 'Failed to rename {currentCollectionFileName} to {newCollectionFileName}', { currentCollectionFileName: collectionFileName, newCollectionFileName: newCollection.path }), { error })
			showError(t('photos', 'Failed to rename {currentCollectionFileName} to {newCollectionFileName}', { currentCollectionFileName: collectionFileName, newCollectionFileName: newCollection.path }))
			return collection
		}
	}

	/**
	 * @param collectionFileName - Collection to update
	 * @param properties - Properties to set on it
	 */
	async function updateCollection(collectionFileName: string, properties: object): Promise<Collection> {
		const collection = collections.value[collectionFileName]

		const updatedCollection = collection.clone()
		updatedCollection.update(properties)

		const stringifiedProperties = Object
			.entries(properties)
			.map(([name, value]) => {
				switch (typeof value) {
					case 'string':
						return `<nc:${name}>${value}</nc:${name}>`
					case 'object':
						return `<nc:${name}>${JSON.stringify(value)}</nc:${name}>`
					default:
						return ''
				}
			})
			.join()

		try {
			updateCollectionState(updatedCollection)

			await davClient.customRequest(
				collection.root + collection.path,
				{
					method: 'PROPPATCH',
					data: `<?xml version="1.0"?>
							<d:propertyupdate xmlns:d="DAV:"
								xmlns:oc="http://owncloud.org/ns"
								xmlns:nc="http://nextcloud.org/ns"
								xmlns:ocs="http://open-collaboration-services.org/ns">
							<d:set>
								<d:prop>
									${stringifiedProperties}
								</d:prop>
							</d:set>
							</d:propertyupdate>`,
				},
			)

			return updatedCollection
		} catch (error) {
			updateCollectionState(collection)
			logger.error(t('photos', 'Failed to update properties of {collectionFileName} with {properties}', { collectionFileName, properties: JSON.stringify(properties) }), { error })
			showError(t('photos', 'Failed to update properties of {collectionFileName} with {properties}', { collectionFileName, properties: JSON.stringify(properties) }))
			return collection
		}
	}

	/**
	 * @param collectionFileName - Collection to delete
	 */
	async function deleteCollection(collectionFileName: string): Promise<boolean> {
		try {
			// Collection file name looks like that: "/photos/<user-id>/albums/<album-name>"
			const collectionRoot = collectionFileName.split('/')[3]
			const collectionName = collectionFileName.split('/').splice(4).join('/')

			let confirmTitle = t('photos', 'Delete collection')

			switch (collectionRoot) {
				case 'albums':
					confirmTitle = t('photos', 'Delete album')
					break
				case 'sharedalbums':
					confirmTitle = t('photos', 'Leave shared album')
					break
			}
			const result = await confirmOperation(
				confirmTitle,
				t('photos', 'Are you sure you want to delete {collectionName}? This action cannot be undone.', { collectionName }),
			)

			if (!result) {
				return false
			}

			const collection = collections.value[collectionFileName]
			await davClient.deleteFile(collection.root + collection.path)
			removeCollections([collectionFileName])
			return true
		} catch (error) {
			logger.error(t('photos', 'Failed to delete {collectionFileName}', { collectionFileName }), { error })
			showError(t('photos', 'Failed to delete {collectionFileName}', { collectionFileName }))
			return false
		}
	}

	return {
		collections,
		collectionsFiles,
		collectionsWithPrefix,
		addCollections,
		addFileIdsToCollection,
		removeFileIdsFromCollection,
		removeCollections,
		setCollectionFiles,
		addFilesToCollection,
		removeFilesFromCollection,
		createCollection,
		renameCollection,
		updateCollection,
		deleteCollection,
	}
})

/**
 * @param name - Title of the confirmation dialog
 * @param text - Body of the confirmation dialog
 */
export async function confirmOperation(name: string, text: string): Promise<boolean> {
	const result = await showConfirmation({
		name,
		text,
		severity: 'warning',
	})
	return result
}
