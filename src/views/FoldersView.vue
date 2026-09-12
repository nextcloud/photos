<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<!-- Errors handlers-->
	<NcEmptyContent v-if="error === 404" :name="t('photos', 'This folder does not exist')">
		<template #icon>
			<FolderOutline />
		</template>
	</NcEmptyContent>
	<NcEmptyContent v-else-if="error" :name="t('photos', 'An error occurred')" />
	<NcEmptyContent v-else-if="initializing" :name="t('photos', 'Loading folders…')">
		<template #icon>
			<NcLoadingIcon />
		</template>
	</NcEmptyContent>

	<!-- Folder content -->
	<div v-else-if="!initializing">
		<HeaderNavigation
			key="navigation"
			:class="{ 'photos-navigation--uploading': uploader.queue?.length > 0 }"
			:loading="loading"
			:path="path"
			:title="folder?.basename ?? rootTitle"
			:rootTitle="rootTitle"
			@refresh="onRefresh">
			<NcUploadPicker
				v-if="folder !== undefined"
				:accept="allowedMimes"
				:content="uploadDestinationContent"
				:destination="folder"
				:multiple="true"
				@upload:finished="onUpload" />
		</HeaderNavigation>

		<!-- Empty folder, should only happen via direct link -->
		<NcEmptyContent v-if="isEmpty" key="emptycontent" :name="t('photos', 'No photos in here')">
			<template #icon>
				<FolderOutline />
			</template>
		</NcEmptyContent>

		<TiledLayout
			v-else
			class="nodes-container"
			:sections="contentList"
			:baseHeight="220">
			<template #default="{ tiledSections }">
				<VirtualScrolling
					:containerElement="appContent"
					:headerHeight="0"
					:sections="tiledSections">
					<template #default="{ visibleSections }">
						<ul v-if="visibleSections.length === 1">
							<template v-for="(row, rowIndex) of visibleSections[0].rows">
								<!--
									We are subtracting 1 from flex-basis to compensate for rounding issues.
									The flex algo will then compensate with flex-grow.
									'last-tiled-row' prevents the last row's items from growing.
								-->
								<li
									v-for="item of row.items"
									:key="item.id"
									:class="{ 'last-tiled-row': rowIndex === visibleSections[0].rows.length - 1 }"
									:style="{ flexBasis: `${item.width - 1}px`, height: `${item.height}px` }">
									<FileComponent
										v-if="item.node.type === 'file'"
										:file="item.node"
										:allowSelection="false"
										:cropped="croppedLayout"
										@click="openViewer"
										@deleted="onPhotoDeleted" />
									<FolderComponent
										v-else
										:item="item.node"
										:showShared="showShared" />
								</li>
							</template>
						</ul>
					</template>
				</VirtualScrolling>
			</template>
		</TiledLayout>
	</div>
</template>

<script setup lang="ts">
import type { Folder, Node } from '@nextcloud/files'
import type { IUpload } from '@nextcloud/files/upload'
import type { Section, TiledItem } from '../services/TiledLayout.ts'
import type { PhotoFile } from '../store/files.ts'
import type { PhotoTarget } from '../utils/fileUtils.ts'

import { defaultRootPath } from '@nextcloud/files/dav'
import { getUploader } from '@nextcloud/files/upload'
import { t } from '@nextcloud/l10n'
import { isAxiosError } from 'axios'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import NcUploadPicker from '@nextcloud/vue/components/NcUploadPicker'
import FolderOutline from 'vue-material-design-icons/FolderOutline.vue'
import FileComponent from '../components/FileComponent.vue'
import FolderComponent from '../components/FolderComponent.vue'
import HeaderNavigation from '../components/HeaderNavigation.vue'
import TiledLayout from '../components/TiledLayout/TiledLayout.vue'
import VirtualScrolling from '../components/VirtualScrolling.vue'
import { useAbortController } from '../composables/useAbortController.ts'
import { allMimes as allowedMimes } from '../services/AllowedMimes.ts'
import { fetchFile } from '../services/fileFetcher.ts'
import { getFolderContent } from '../services/FolderContent.ts'
import { logger } from '../services/logger.ts'
import { closeViewer, openInViewer } from '../services/viewer.ts'
import { useFoldersStore } from '../store/folders.ts'
import { useUserConfigStore } from '../store/userConfig.ts'

// A laid out tile that still knows which folder or photo it stands for.
type NodeItem = TiledItem & { node: Folder | PhotoFile }

const props = withDefaults(defineProps<{
	rootTitle: string
	path?: string
	showShared?: boolean
}>(), {
	path: '/',
	showShared: false,
})

const route = useRoute()
const router = useRouter()
const foldersStore = useFoldersStore()
const userConfigStore = useUserConfigStore()
const { abortSignal } = useAbortController()

const error = ref<null | 404 | Error>(null)

const initializing = ref(true)
const loading = ref(false)

const appContent = document.getElementById('app-content-vue')

const uploader = getUploader()

const files = computed(() => foldersStore.files)

const folders = computed(() => foldersStore.folders)

// current folder id from current path
const folderId = computed(() => foldersStore.paths[props.path])

/** The folder that is open. */
const folder = computed(() => files.value[folderId.value] as Folder | undefined)

const folderContent = computed(() => folders.value[folderId.value] || [])

const fileList = computed(() => {
	const list = folderContent.value
		&& folderContent.value
			.map((id) => files.value[id] as PhotoFile | undefined)
			.filter((file) => file !== undefined)
	return list
})

/**
 * Whether a photo is cropped to its tile rather than shown whole inside it.
 * The tiles here are squares whatever shape the photos are, so there is
 * always something to crop away.
 */
const croppedLayout = computed(() => userConfigStore.croppedLayout)

// subfolders of the current folder
const subFolders = computed(() => folderId.value
	&& files.value[folderId.value]
	&& foldersStore.subFolders[folderId.value])

const folderList = computed(() => {
	const list = subFolders.value
		&& subFolders.value
			.map((id) => files.value[id] as Folder | undefined)
			.filter((folder) => folder !== undefined)
	return list
})

const contentList = computed<Section<NodeItem>[]>(() => [
	{
		id: '',
		items: [
			...(folderList.value || []).map(mapNodeToItem),
			...(fileList.value || []).map(mapNodeToItem),
		],
	},
])

const haveFiles = computed(() => !!fileList.value && fileList.value.length !== 0)

const haveFolders = computed(() => !!folderList.value && folderList.value.length !== 0)

// is current folder empty?
const isEmpty = computed(() => !haveFiles.value && !haveFolders.value)

watch(() => props.path, () => {
	fetchFolderContent()
})

watch(() => props.showShared, () => {
	fetchFolderContent()
})

/**
 * Open a photo in the viewer, with the whole folder as its gallery.
 *
 * @param fileid - Id of the photo to open
 */
function openViewer(fileid: number) {
	openInViewer(fileList.value, files.value[fileid] as PhotoFile, {
		onClose: () => window.OCA?.Files?.Sidebar?.close?.(),
	})
}

// Folders keep the ids of the files they hold, the listing skips the
// ones which are gone.
function onPhotoDeleted(photo: PhotoTarget) {
	foldersStore.deleteFolderFile(photo.fileid)
}

function onRefresh() {
	fetchFolderContent()
}

/**
 * TiledLayout justifies the rows from the `ratio` of the items, the given
 * width and height are only the untiled defaults.
 * Folders and photos are laid out as squares here, whatever shape the photos
 * are, so that a folder reads as a grid rather than as a timeline.
 *
 * The node is carried along rather than spread into the item: the layout
 * copies the items it lays out, which a node does not survive.
 *
 * @param node - The folder or file to lay out
 */
function mapNodeToItem(node: Folder | PhotoFile): NodeItem {
	return {
		node,
		id: `${node.type}-${node.fileid}`,
		width: 220,
		height: 220,
		ratio: 1,
	}
}

async function fetchFolderContent() {
	error.value = null
	loading.value = true

	// close any potential opened viewer & sidebar
	closeViewer()
	window.OCA?.Files?.Sidebar?.close?.()

	// if we don't already have some cached data let's show a loader
	if (!files.value[folderId.value] || !folders.value[folderId.value]) {
		initializing.value = true
	}

	try {
		// get content and current folder info
		const { folder, folders, files } = await getFolderContent(props.path, {
			shared: props.showShared,
			signal: abortSignal.value,
		})
		foldersStore.addPath(props.path, folder?.fileid)
		foldersStore.updateFolders(folder?.fileid, files, folders)
		foldersStore.updateFoldersFiles(folder, files, folders)
	} catch (error_) {
		if (isAxiosError(error_) && error_.response?.status) {
			if (error_.response.status === 404) {
				error.value = 404
				setTimeout(() => {
					router.push({ name: route.name ?? undefined })
				}, 3000)
			} else {
				error.value = error_
			}
		}
		// cancelled request, moving on...
		logger.error('Error fetching album data', { error: error_ })
	} finally {
		// done loading even with errors
		loading.value = false
		initializing.value = false
	}
}

/**
 * List the nodes of the destination folder, so the picker can spot conflicts.
 */
async function uploadDestinationContent(): Promise<Node[]> {
	const { folders, files } = await getFolderContent(props.path, { signal: abortSignal.value })
	return [...folders, ...files]
}

/**
 * Fetch file Info and add them into the store
 *
 * @param upload
 */
async function onUpload(upload: IUpload) {
	const relPath = upload.source.split(defaultRootPath).pop()
	const node = await fetchFile(defaultRootPath + relPath)
	if (node === null) {
		logger.error('Failed to fetch file', { relPath })
		return
	}

	foldersStore.appendFoldersFiles([node])
	foldersStore.addFilesToFolder(folderId.value, [node])
}

onBeforeMount(() => {
	fetchFolderContent()
})
</script>

<style lang="scss" scoped>
.nodes-container {
	padding: 0 64px 256px;

	@media only screen and (max-width: 1200px) {
		padding: 0 4px 256px;
	}

	ul {
		display: flex;
		flex-wrap: wrap;

		// The last row is not justified, so its items must not grow.
		li:not(.last-tiled-row) {
			flex-grow: 1;
		}
	}
}

.photos-navigation {
	position: relative;

	// Add space at the bottom for the progress bar.
	&--uploading {
		margin-bottom: 30px;
	}
}
</style>
