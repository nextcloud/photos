/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { showError } from '@nextcloud/dialogs'
import { translate } from '@nextcloud/l10n'

import client from '../services/DavClient.js'
import logger from '../services/logger.js'
import Semaphore from '../utils/semaphoreWithPriority.js'

/**
 * Collections are indexed by their `filename`.
 */
const state = {
	/**
	 * @type {Object<string, import('../services/collectionFetcher').Collection>}
	 */
	collections: {
		// "photos/{userName}/{collection}/{collectionName}": Collection,
		// ...
	},
	/**
	 * @type {Object<string, string[]>}
	 */
	collectionsFiles: {
		// "photos/{userName}/{collection}/{collectionName}": ["1", "2", ...],
		// ...
	},
}

/** @type {import('vuex').MutationTree<state, any>} */
const mutations = {
	/**
	 * Add new collections.
	 *
	 * @param state vuex state
	 * @param {object} data destructuring object
	 * @param {import('../services/collectionFetcher').Collection[]} data.collections list of collections
	 */
	addCollections(state, { collections }) {
		state.collections = {
			...state.collections,
			...collections.reduce((collections, collection) => ({ ...collections, [collection.filename]: collection }), {}),
		}
	},

	/**
	 * Add collections to the collection collection.
	 *
	 * @param state vuex state
	 * @param {object} data destructuring object
	 * @param {import('../services/collectionFetcher').Collection} data.collection the collection to update
	 */
	updateCollection(state, { collection }) {
		state.collections[collection.filename] = collection
	},

	/**
	 * Remove collections from the collection collection.
	 *
	 * @param state vuex state
	 * @param {object} data destructuring object
	 * @param {string[]} data.collectionFileNames list of collections ids
	 */
	removeCollections(state, { collectionFileNames }) {
		collectionFileNames.forEach(collectionFileName => delete state.collections[collectionFileName])
		collectionFileNames.forEach(collectionFileName => delete state.collectionsFiles[collectionFileName])
	},

	/**
	 * Add files to an collection.
	 *
	 * @param state vuex state
	 * @param {object} data destructuring object
	 * @param {string} data.collectionFileName the collection id
	 * @param {string[]} data.fileIds list of files
	 */
	setCollectionFiles(state, { collectionFileName, fileIds = [] }) {
		const collectionFiles = state.collectionsFiles[collectionFileName] || []
		state.collectionsFiles = {
			...state.collectionsFiles,
			[collectionFileName]: [...new Set([...collectionFiles, ...fileIds])],
		}

		if (state.collections[collectionFileName] !== undefined) {
			state.collections[collectionFileName].nbItems = fileIds.length
			state.collections[collectionFileName].lastPhoto = Number.parseInt(fileIds[fileIds.length - 1])
		}
	},

	/**
	 * Add files to an collection.
	 *
	 * @param state vuex state
	 * @param {object} data destructuring object
	 * @param {string} data.collectionFileName the collection id
	 * @param {string[]} data.fileIdsToAdd list of files
	 */
	addFilesToCollection(state, { collectionFileName, fileIdsToAdd }) {
		const collectionFiles = state.collectionsFiles[collectionFileName] || []
		state.collectionsFiles = {
			...state.collectionsFiles,
			[collectionFileName]: [...new Set([...collectionFiles, ...fileIdsToAdd])],
		}

		state.collections[collectionFileName].nbItems += fileIdsToAdd.length
		state.collections[collectionFileName].lastPhoto = Number.parseInt(fileIdsToAdd[fileIdsToAdd.length - 1])
	},

	/**
	 * Remove files from a collection.
	 *
	 * @param state vuex state
	 * @param {object} data destructuring object
	 * @param {string} data.collectionFileName the collection id
	 * @param {string[]} data.fileIdsToRemove list of files
	 */
	removeFilesFromCollection(state, { collectionFileName, fileIdsToRemove }) {
		state.collectionsFiles = {
			...state.collectionsFiles,
			[collectionFileName]: state.collectionsFiles[collectionFileName].filter(fileId => !fileIdsToRemove.includes(fileId)),
		}

		state.collections[collectionFileName].nbItems -= fileIdsToRemove.length
		if (fileIdsToRemove.includes(state.collections[collectionFileName].lastPhoto.toString())) {
			state.collections[collectionFileName].lastPhoto = Number.parseInt(state.collectionsFiles[collectionFileName][state.collectionsFiles[collectionFileName].length])
		}
	},
}

/** @type {import('vuex').GetterTree<state, any>} */
const getters = {
	collections: state => state.collections,
	collectionsFiles: state => state.collectionsFiles,
	collectionsWithPrefix: state => function(prefix) {
		return Object.values(state.collections)
			.filter(collections => collections.filename.startsWith(prefix))
			.reduce((collections, collection) => ({ ...collections, [collection.filename]: collection }), {})
	},
}

/** @type {import('vuex').ActionTree<state, any>} */
const actions = {
	/**
	 * Update files and collections
	 *
	 * @param context vuex context
	 * @param {object} data destructuring object
	 * @param {import('../services/collectionFetcher').Collection[]} data.collections list of collections
	 */
	addCollections(context, { collections }) {
		context.commit('addCollections', { collections })
	},

	/**
	 * Add files to an collection.
	 *
	 * @param context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.collectionFileName the collection name
	 * @param {string[]} data.fileIdsToAdd list of files ids to add
	 */
	async addFilesToCollection(context, { collectionFileName, fileIdsToAdd }) {
		const semaphore = new Semaphore(5)

		context.commit('addFilesToCollection', { collectionFileName, fileIdsToAdd })

		const promises = fileIdsToAdd
			.map(async (fileId) => {
				const file = context.getters.files[fileId]
				const collection = context.getters.collections[collectionFileName]
				const symbol = await semaphore.acquire()

				try {
					await client.copyFile(
						file.filename,
						`${collection.filename}/${file.basename}`,
					)
				} catch (error) {
					if (error.response.status !== 409) { // Already in the collection.
						context.commit('removeFilesFromCollection', { collectionFileName, fileIdsToRemove: [fileId] })

						logger.error(translate('photos', 'Failed to add {fileBaseName} to collection {collectionFileName}.', { fileBaseName: file.basename, collectionFileName }), { error })
						showError(translate('photos', 'Failed to add {fileBaseName} to collection {collectionFileName}.', { fileBaseName: file.basename, collectionFileName }))
					}
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Remove files to an collection.
	 *
	 * @param context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.collectionFileName the collection name
	 * @param {string[]} data.fileIdsToRemove list of files ids to remove
	 */
	async removeFilesFromCollection(context, { collectionFileName, fileIdsToRemove }) {
		const semaphore = new Semaphore(5)

		context.commit('removeFilesFromCollection', { collectionFileName, fileIdsToRemove })

		const promises = fileIdsToRemove
			.map(async (fileId) => {
				const file = context.getters.files[fileId]
				const symbol = await semaphore.acquire()

				try {
					await client.deleteFile(file.filename)
				} catch (error) {
					context.commit('addFilesToCollection', { collectionFileName, fileIdsToAdd: [fileId] })

					logger.error(translate('photos', 'Failed to delete {fileBaseName}.', { fileBaseName: file.basename }), { error })
					showError(translate('photos', 'Failed to delete {fileBaseName}.', { fileBaseName: file.basename }))
				} finally {
					semaphore.release(symbol)
				}
			})

		return Promise.all(promises)
	},

	/**
	 * Create an collection.
	 *
	 * @param context vuex context
	 * @param {object} data destructuring object
	 * @param {import('../services/collectionFetcher').Collection} data.collection the collection
	 */
	async createCollection(context, { collection }) {
		try {
			await client.createDirectory(collection.filename)
			context.commit('addCollections', { collections: [collection] })
			return collection
		} catch (error) {
			logger.error(translate('photos', 'Failed to create {collectionFileName}.', { collectionFileName: collection.filename }), { error })
			showError(translate('photos', 'Failed to create {collectionFileName}.', { collectionFileName: collection.filename }))
		}
	},

	/**
	 * Rename an collection.
	 *
	 * @param context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.collectionFileName - The current name of the collection.
	 * @param {string} data.newBaseName - The wanted name for the collection.
	 */
	async renameCollection(context, { collectionFileName, newBaseName }) {
		const collection = state.collections[collectionFileName]
		const newCollection = {
			...collection,
			basename: newBaseName,
			filename: collection.filename.replace(new RegExp(`${collection.basename}$`), newBaseName),
		}

		try {
			context.commit('addCollections', { collections: [newCollection] })
			context.commit('setCollectionFiles', { collectionFileName: newCollection.filename, fileIds: context.state.collectionsFiles[collectionFileName] })
			await client.moveFile(collection.filename, newCollection.filename)
			context.commit('removeCollections', { collectionFileNames: [collectionFileName] })
			return newCollection
		} catch (error) {
			context.commit('removeCollections', { collectionFileNames: [newCollection.filename] })
			logger.error(translate('photos', 'Failed to rename {currentCollectionFileName} to {newCollectionFileName}.', { currentCollectionFileName: collectionFileName, newCollectionFileName: newCollection.filename }), { error })
			showError(translate('photos', 'Failed to rename {currentCollectionFileName} to {newCollectionFileName}.', { currentCollectionFileName: collectionFileName, newCollectionFileName: newCollection.filename }))
			return collection
		}
	},

	/**
	 * Update an collection's properties.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.collectionFileName - The name of the collection.
	 * @param {object} data.properties - The properties to update.
	 */
	async updateCollection(context, { collectionFileName, properties }) {
		const collection = context.state.collections[collectionFileName]

		const updatedCollection = { ...collection, ...properties }

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

			await client.customRequest(
				collection.filename,
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
				}
			)

			return updatedCollection
		} catch (error) {
			context.commit('updateCollection', { collection })
			logger.error(translate('photos', 'Failed to update properties of {collectionFileName} with {properties}.', { collectionFileName, properties: JSON.stringify(properties) }), { error })
			showError(translate('photos', 'Failed to update properties of {collectionFileName} with {properties}.', { collectionFileName, properties: JSON.stringify(properties) }))
			return collection
		}
	},

	/**
	 * Delete an collection.
	 *
	 * @param {object} context vuex context
	 * @param {object} data destructuring object
	 * @param {string} data.collectionFileName the id of the collection
	 */
	async deleteCollection(context, { collectionFileName }) {
		try {
			const collection = context.getters.collections[collectionFileName]
			await client.deleteFile(collection.filename)
			context.commit('removeCollections', { collectionFileNames: [collectionFileName] })
		} catch (error) {
			logger.error(translate('photos', 'Failed to delete {collectionFileName}.', { collectionFileName }), { error })
			showError(translate('photos', 'Failed to delete {collectionFileName}.', { collectionFileName }))
		}
	},
}

export default { state, mutations, getters, actions }
