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

import client from '../services/DavClient.js'
import logger from '../services/logger.js'
import Semaphore from '../utils/semaphoreWithPriority.js'
import { translate } from '@nextcloud/l10n'

/**
 * @param {string} collectionName - The name of the collection/
 */
export default function collectionStoreFactory(collectionName) {
	const capitalizedCollectionName = collectionName[0].toUpperCase() + collectionName.substr(1)

	const state = {
		[`${collectionName}s`]: {},
		[`${collectionName}sFiles`]: {},
	}

	const mutations = {
		/**
		 * Add a list of collections.
		 *
		 * @param {object} state vuex state
		 * @param {object} data destructuring object
		 * @param {Array} data.collections list of collections
		 */
		[`add${capitalizedCollectionName}s`](state, { collections }) {
			state[`${collectionName}s`] = {
				...state[`${collectionName}s`],
				...collections.reduce((collections, collection) => ({ ...collections, [collection.basename]: collection }), {}),
			}
		},

		/**
		 * Remove a list of collections.
		 *
		 * @param {object} state vuex state
		 * @param {object} data destructuring object
		 * @param {Array} data.collectionIds list of collection ids
		 */
		[`remove${capitalizedCollectionName}s`](state, { collectionIds }) {
			collectionIds.forEach(collectionId => delete state[`${collectionName}s`][collectionId])
			collectionIds.forEach(collectionId => delete state[`${collectionName}sFiles`][collectionId])
		},

		/**
		 * Add files to a collection.
		 *
		 * @param {object} state vuex state
		 * @param {object} data destructuring object
		 * @param {string} data.collectionId the collection id
		 * @param {string[]} data.fileIdsToAdd list of files
		 */
		[`addFilesTo${capitalizedCollectionName}`](state, { collectionId, fileIdsToAdd }) {
			const collectionFiles = state[`${collectionName}sFiles`][collectionId] || []
			state[`${collectionName}sFiles`] = {
				...state[`${collectionName}sFiles`],
				[collectionId]: [
					...collectionFiles,
					...fileIdsToAdd.filter(fileId => !collectionFiles.includes(fileId)), // Filter to prevent duplicate fileId.
				],
			}
			state[`${collectionName}s`][collectionId].nbItems += fileIdsToAdd.length
		},

		/**
		 * Remove files to an collection.
		 *
		 * @param {object} state vuex state
		 * @param {object} data destructuring object
		 * @param {string} data.collectionId the collection id
		 * @param {string[]} data.fileIdsToRemove list of files
		 */
		[`removeFilesFrom${capitalizedCollectionName}`](state, { collectionId, fileIdsToRemove }) {
			state[`${collectionName}sFiles`] = {
				...state[`${collectionName}sFiles`],
				[collectionId]: state[`${collectionName}sFiles`][collectionId].filter(fileId => !fileIdsToRemove.includes(fileId)),
			}
			state[`${collectionName}s`][collectionId].nbItems -= fileIdsToRemove.length
		},
	}

	const getters = {
		[`${collectionName}s`]: state => state[`${collectionName}s`],
		[`${collectionName}sFiles`]: state => state[`${collectionName}sFiles`],
	}

	const actions = {
		/**
		 * Update files and collections
		 *
		 * @param {object} context vuex context
		 * @param {object} data destructuring object
		 * @param {Array} data.collections list of collections
		 */
		[`add${capitalizedCollectionName}s`](context, { collections }) {
			context.commit(`add${capitalizedCollectionName}s`, { collections })
		},

		/**
		 * Add files to an collection.
		 *
		 * @param {object} context vuex context
		 * @param {object} data destructuring object
		 * @param {string} data.collectionId the collection name
		 * @param {string[]} data.fileIdsToAdd list of files ids to add
		 */
		async [`addFilesTo${capitalizedCollectionName}`](context, { collectionId, fileIdsToAdd }) {
			const semaphore = new Semaphore(5)

			context.commit(`addFilesTo${capitalizedCollectionName}`, { collectionId, fileIdsToAdd })

			const promises = fileIdsToAdd
				.map(async (fileId) => {
					const file = context.getters.files[fileId]
					const collection = context.getters[`${collectionName}s`][collectionId]
					const symbol = await semaphore.acquire()

					try {
						await client.copyFile(
							file.filename,
							`${collection.filename}/${file.basename}`,
						)
					} catch (error) {
						if (error.response.status !== 409) { // Already in the collection.
							context.commit(`removeFilesFrom${capitalizedCollectionName}`, { collectionId, fileIdsToRemove: [fileId] })

							logger.error(translate('photos', 'Failed to add {fileBaseName} to {collectionId}.', { fileBaseName: file.basename, collectionId }), error)
							showError(translate('photos', 'Failed to add {fileBaseName} to {collectionId}.', { fileBaseName: file.basename, collectionId }))
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
		 * @param {object} context vuex context
		 * @param {object} data destructuring object
		 * @param {string} data.collectionId the collection name
		 * @param {string[]} data.fileIdsToRemove list of files ids to remove
		 */
		async [`removeFilesFrom${capitalizedCollectionName}`](context, { collectionId, fileIdsToRemove }) {
			const semaphore = new Semaphore(5)

			context.commit(`removeFilesFrom${capitalizedCollectionName}`, { collectionId, fileIdsToRemove })

			const promises = fileIdsToRemove
				.map(async (fileId) => {
					const file = context.getters.files[fileId]
					const symbol = await semaphore.acquire()

					try {
						await client.deleteFile(file.filename)
					} catch (error) {
						context.commit(`addFilesTo${capitalizedCollectionName}`, { collectionId, fileIdsToAdd: [fileId] })

						logger.error(translate('photos', 'Failed to delete {fileBaseName}.', { fileBaseName: file.basename }), error)
						showError(translate('photos', 'Failed to delete {fileBaseName}.', { fileBaseName: file.basename }))
					} finally {
						semaphore.release(symbol)
					}
				})

			return Promise.all(promises)
		},

		/**
		 * Delete a collection.
		 *
		 * @param {object} context vuex context
		 * @param {object} data destructuring object
		 * @param {string} data.collectionId the id of the collection
		 */
		async [`delete${capitalizedCollectionName}`](context, { collectionId }) {
			try {
				const collection = context.getters[`${collectionName}s`][collectionId]
				await client.deleteFile(collection.filename)
				context.commit(`remove${capitalizedCollectionName}s`, { collectionIds: [collectionId] })
			} catch (error) {
				logger.error(translate('photos', 'Failed to delete {collectionId}.', { collectionId }), error)
				showError(translate('photos', 'Failed to delete {collectionId}.', { collectionId }))
			}
		},
	}

	return { state, mutations, getters, actions }
}
