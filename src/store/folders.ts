/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Folder, Node } from '@nextcloud/files'

import { defaultRootPath } from '@nextcloud/files/dav'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { compareModificationTime } from '../utils/fileUtils.ts'
import { useFilesStore } from './files.ts'

export const useFoldersStore = defineStore('folders', () => {
	const paths = ref<Record<string, number>>({})
	const folders = ref<Record<string, number[]>>({})
	const files = ref<Record<string, Node>>({})
	const subFolders = ref<Record<string, number[]>>({})

	/**
	 * Set the subfolders of a folder, if that folder is known
	 *
	 * @param fileid - Id of the parent folder
	 * @param newFolders - Subfolders of that folder
	 */
	function setSubFolders(fileid: number | undefined, newFolders: Folder[]): void {
		if (fileid === undefined) {
			return
		}

		if (folders.value[fileid]) {
			subFolders.value[fileid] = newFolders
				.map((folder) => folder.fileid as number)
				// some invalid folders have an id of -1 (ext storage)
				.filter((id) => id >= 0)
		}
	}

	/**
	 * Append or update given files
	 *
	 * @param newFiles - Nodes to index
	 */
	function appendFoldersFiles(newFiles: Node[] = []): void {
		const { nomediaPaths } = useFilesStore()
		const indexed = {}
		newFiles
			// TODO: Is this needed? .filter(file => !file.hidden)
			.forEach((file) => {
				// Ignore the file if the path is excluded
				// TODO: Check that it works
				if (nomediaPaths.some((nomediaPath) => file.path.startsWith(nomediaPath)
					|| file.path.startsWith(`${defaultRootPath}${nomediaPath}`))) {
					return
				}

				indexed[file.fileid as number] = file
			})

		files.value = {
			...files.value,
			...indexed,
		}
	}

	/**
	 * Update a folder, its files and its subfolders
	 *
	 * @param folder - Folder that was listed
	 * @param newFiles - Files it holds
	 * @param newFolders - Folders it holds
	 */
	function updateFoldersFiles(folder: Folder | undefined, newFiles: Node[] = [], newFolders: Folder[] = []): void {
		if (folder === undefined) {
			return
		}

		// we want all the FileInfo! Folders included!
		appendFoldersFiles([folder, ...newFiles, ...newFolders])
		setSubFolders(folder.fileid, newFolders)
	}

	/**
	 * Delete a file
	 *
	 * The folders keep the ids of the files they hold, but the listings skip
	 * the ones which are gone.
	 *
	 * @param fileId - Id of the file
	 */
	function deleteFolderFile(fileId: number): void {
		delete files.value[fileId]
	}

	/**
	 * Mark a file of a folder as a favorite, or take that mark off again
	 *
	 * A photo is only known here once the folder holding it was browsed.
	 *
	 * @param fileId - Id of the file
	 * @param favoriteState - 1 to favorite, 0 to unfavorite
	 */
	function favoriteFolderFile(fileId: number, favoriteState: 0 | 1): void {
		const attributes = files.value[fileId]?.attributes
		if (attributes === undefined) {
			return
		}

		attributes.favorite = favoriteState
	}

	/**
	 * Index a folder path and its id
	 *
	 * @param path - Path of the folder
	 * @param fileid - Id of the folder
	 */
	function addPath(path: string, fileid: number | undefined): void {
		if (fileid !== undefined && fileid >= 0) {
			paths.value[path] = fileid
		}
	}

	/**
	 * Index the content of a folder and the paths of its subfolders
	 *
	 * @param fileid - Id of the folder
	 * @param newFiles - Files it holds
	 * @param newFolders - Folders it holds
	 */
	function updateFolders(fileid: number | undefined, newFiles: Node[], newFolders: Folder[]): void {
		if (fileid === undefined) {
			return
		}

		// sort by last modified
		folders.value[fileid] = newFiles
			.sort(compareModificationTime)
			.filter((file) => (file.fileid ?? -1) >= 0)
			.map((file) => file.fileid as number)

		// then add each folders path indexes
		newFolders.forEach((folder) => addPath(folder.path, folder.fileid))
	}

	/**
	 * Prepend files to a folder listing
	 *
	 * @param fileid - Id of the folder
	 * @param newFiles - Files to add
	 */
	function addFilesToFolder(fileid: number | undefined, newFiles: Node[]): void {
		if (fileid !== undefined && fileid >= 0 && newFiles.length > 0) {
			// and sort by last modified
			const list = newFiles
				.sort(compareModificationTime)
				.filter((file) => (file.fileid ?? -1) >= 0)
				.map((file) => file.fileid as number)
			folders.value[fileid] = [...list, ...folders.value[fileid]]
		}
	}

	return {
		paths,
		folders,
		files,
		subFolders,
		setSubFolders,
		appendFoldersFiles,
		updateFoldersFiles,
		deleteFolderFile,
		favoriteFolderFile,
		addPath,
		updateFolders,
		addFilesToFolder,
	}
})
