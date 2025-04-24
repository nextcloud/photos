/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { isAxiosError } from 'axios'

import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'

import { davClient } from '../services/DavClient.ts'
import logger from '../services/logger.js'
import Semaphore from '../utils/semaphoreWithPriority.js'
import type { Collection } from '../services/collectionFetcher.ts'
import type { PhotosContext } from './index.ts'
import { resultToNode } from '@nextcloud/files/dav'

/**
 * Collections are indexed by their `filename`.
 */
const state = {
	collections: {
		// "photos/{userName}/{collection}/{collectionName}": Collection,
		// ...
	} as Record<string, Collection>,
	collectionsFiles: {
		// "photos/{userName}/{collection}/{collectionName}": ["1", "2", ...],
		// ...
	} as Record<string, string[]>,
}

export type CollectionState = typeof state

const mutations = {
	/**
	 * Add new collections.
	 */
	addCollections(state: CollectionState, { collections }: { collections: Collection[]}) {
		state.collections = {
			...state.collections,
			...collections.reduce((collections, collection) => ({ ...collections, [collection.root + collection.path]: collection }), {}),
		}
	},

	/**
	 * Add collections to the collection collection.
	 */
	updateCollection(state: CollectionState, { collection }: { collection: Collection}) {
		state.collections[collection.root + collection.path] = collection
	},

	/**
	 * Remove collections from the collection collection.
	 */
	removeCollections(state: CollectionState, { collectionFileNames }: { collectionFileNames: string[]}) {
		collectionFileNames.forEach(collectionFileName => delete state.collections[collectionFileName])
		collectionFileNames.forEach(collectionFileName => delete state.collectionsFiles[collectionFileName])
	},

	/**
	 * Add files to an collection.
	 */
	setCollectionFiles(state: CollectionState, { collectionFileName, fileIds = [] }: { collectionFileName: string, fileIds: string[]}) {
		const collectionFiles = state.collectionsFiles[collectionFileName] || []
		state.collectionsFiles = {
			...state.collectionsFiles,
			[collectionFileName]: [...new Set([...collectionFiles, ...fileIds])],
		}

		if (state.collections[collectionFileName] !== undefined) {
			state.collections[collectionFileName].attributes.nbItems = fileIds.length
			state.collections[collectionFileName].attributes['last-photo'] = Number.parseInt(fileIds[fileIds.length - 1])
		}
	},

	/**
	 * Add files to an collection.
	 */
	addFilesToCollection(state: CollectionState, { collectionFileName, fileIdsToAdd }: { collectionFileName: string, fileIdsToAdd: string[]}) {
		const collectionFiles = state.collectionsFiles[collectionFileName] || []
		state.collectionsFiles = {
			...state.collectionsFiles,
			[collectionFileName]: [...new Set([...collectionFiles, ...fileIdsToAdd])],
		}

		state.collections[collectionFileName].attributes.nbItems += fileIdsToAdd.length
		state.collections[collectionFileName].attributes['last-photo'] = Number.parseInt(fileIdsToAdd[fileIdsToAdd.length - 1])
	},

	/**
	 * Remove files from a collection.
	 */
	removeFilesFromCollection(state: CollectionState, { collectionFileName, fileIdsToRemove }: { collectionFileName: string, fileIdsToRemove: string[]}) {
		state.collectionsFiles = {
			...state.collectionsFiles,
			[collectionFileName]: state.collectionsFiles[collectionFileName].filter(fileId => !fileIdsToRemove.includes(fileId)),
		}

		state.collections[collectionFileName].attributes.nbItems -= fileIdsToRemove.length
		if (fileIdsToRemove.includes(state.collections[collectionFileName].attributes['last-photo'].toString())) {
			state.collections[collectionFileName].attributes['last-photo'] = Number.parseInt(state.collectionsFiles[collectionFileName][state.collectionsFiles[collectionFileName].length])
		}
	},
}

const getters = {
	collections: (state: CollectionState) => state.collections,
	collectionsFiles: (state: CollectionState) => state.collectionsFiles,
	collectionsWithPrefix: (state: CollectionState) => function(prefix: string) {
		return Object.values(state.collections)
			.filter(collection => collection.root === prefix)
			.reduce((collections, collection) => ({ ...collections, [collection.root + collection.path]: collection }), {})
	},
}

const actions = {
	/**
	 * Update files and collections
	 */
	addCollections(context: PhotosContext<CollectionState>, { collections }: { collections: Collection[]}) {
		context.commit('addCollections', { collections })
	},

	/**
	 * Add files to an collection.
	 */
	async addFilesToCollection(context: PhotosContext<CollectionState>, { collectionFileName, fileIdsToAdd }: { collectionFileName: string, fileIdsToAdd: string[] }) {
		const semaphore = new Semaphore(5)

		context.commit('addFilesToCollection', { collectionFileName, fileIdsToAdd })

		const promises = fileIdsToAdd
			.map(async (fileId) => {
				const file = context.rootState.files.files[fileId]
				const collection = context.state.collections[collectionFileName]
				const symbol = await semaphore.acquire()

				try {
					await davClient.copyFile(
						file.root + file.path,
						`${collection.root + collection.path}/${file.basename}`,
					)
				} catch (error) {
					if (isAxiosError(error) && error.response?.status !== 409) { // Already in the collection.
						context.commit('removeFilesFromCollection', { collectionFileName, fileIdsToRemove: [fileId] })

						logger.error(t('photos', 'Failed to add {fileBaseName} to collection {collectionFileName}', { fileBaseName: file.basename, collectionFileName }), { error })
						showError(t('photos', 'Failed to add {fileBaseName} to collection {collectionFileName}', { fileBaseName: file.basename, collectionFileName }))
					}
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Remove files to an collection.
	 */
	async removeFilesFromCollection(context: PhotosContext<CollectionState>, { collectionFileName, fileIdsToRemove }: { collectionFileName: string, fileIdsToRemove: string[] }) {
		const semaphore = new Semaphore(5)

		context.commit('removeFilesFromCollection', { collectionFileName, fileIdsToRemove })

		const promises = fileIdsToRemove
			.map(async (fileId) => {
				const file = context.rootState.files.files[fileId]
				const symbol = await semaphore.acquire()

				try {
					await davClient.deleteFile(file.root + file.path)
				} catch (error) {
					context.commit('addFilesToCollection', { collectionFileName, fileIdsToAdd: [fileId] })

					logger.error(t('photos', 'Failed to delete {fileBaseName}', { fileBaseName: file.basename }), { error })
					showError(t('photos', 'Failed to delete {fileBaseName}', { fileBaseName: file.basename }))
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Create an collection.
	 */
	async createCollection(context: PhotosContext<CollectionState>, { collection }: { collection: Collection }) {
		try {
			await davClient.createDirectory(collection.root + collection.path)
			context.commit('addCollections', { collections: [collection] })
			return collection
		} catch (error) {
			logger.error(t('photos', 'Failed to create {collectionFileName}', { collectionFileName: collection.path }), { error })
			showError(t('photos', 'Failed to create {collectionFileName}', { collectionFileName: collection.path }))
		}
	},

	/**
	 * Rename an collection.
	 */
	async renameCollection(context: PhotosContext<CollectionState>, { collectionFileName, newBaseName }: { collectionFileName: string, newBaseName: string}) {
		const collection = state.collections[collectionFileName]
		const newCollection = collection.clone()
		newCollection.rename(newBaseName)

		try {
			context.commit('addCollections', { collections: [newCollection] })
			context.commit('setCollectionFiles', { collectionFileName: newCollection.root + newCollection.path, fileIds: context.state.collectionsFiles[collectionFileName] })
			await davClient.moveFile(collection.root + collection.path, collection.root + newCollection.path)
			context.commit('removeCollections', { collectionFileNames: [collectionFileName] })
			return newCollection
		} catch (error) {
			context.commit('removeCollections', { collectionFileNames: [newCollection.path] })
			logger.error(t('photos', 'Failed to rename {currentCollectionFileName} to {newCollectionFileName}', { currentCollectionFileName: collectionFileName, newCollectionFileName: newCollection.path }), { error })
			showError(t('photos', 'Failed to rename {currentCollectionFileName} to {newCollectionFileName}', { currentCollectionFileName: collectionFileName, newCollectionFileName: newCollection.path }))
			return collection
		}
	},

	/**
	 * Update an collection's properties.
	 */
	async updateCollection(context: PhotosContext<CollectionState>, { collectionFileName, properties }: { collectionFileName: string, properties: object }) {
		const collection = context.state.collections[collectionFileName]

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
			context.commit('updateCollection', { collection: updatedCollection })

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
			context.commit('updateCollection', { collection })
			logger.error(t('photos', 'Failed to update properties of {collectionFileName} with {properties}', { collectionFileName, properties: JSON.stringify(properties) }), { error })
			showError(t('photos', 'Failed to update properties of {collectionFileName} with {properties}', { collectionFileName, properties: JSON.stringify(properties) }))
			return collection
		}
	},

	/**
	 * Delete an collection.
	 */
	async deleteCollection(context: PhotosContext<CollectionState>, { collectionFileName }: { collectionFileName: string}) {
		try {
			const collection = context.state.collections[collectionFileName]
			await davClient.deleteFile(collection.root + collection.path)
			context.commit('removeCollections', { collectionFileNames: [collectionFileName] })
		} catch (error) {
			logger.error(t('photos', 'Failed to delete {collectionFileName}', { collectionFileName }), { error })
			showError(t('photos', 'Failed to delete {collectionFileName}', { collectionFileName }))
		}
	},
}

export default { state, mutations, getters, actions }
