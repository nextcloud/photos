/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Tag } from '../../store/systemtags.ts'
import type { PhotosFilter } from './PhotosFilter.ts'

import tagOutlineSvg from '@mdi/svg/svg/tag-outline.svg?raw'
import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import TagOption from '../../components/PhotosFilters/TagOption.vue'
import { useSystemTagsStore } from '../../store/systemtags.ts'
import { areTagsInstalled } from '../AreTagsInstalled.ts'

export type TagsValueType = string

export const tagsFilterId = 'tags'

/**
 * @param tag - System tag
 */
function tagName(tag: Tag): string {
	return String(tag.attributes['display-name'])
}

/**
 * @param names - Names of the system tags
 */
function getTagsNamed(names: string[]): Tag[] {
	return Object.values(useSystemTagsStore().tags).filter((tag) => names.includes(tagName(tag)))
}

/**
 * Filter matching the photos carrying any of the selected system tags,
 * like the objects and scenes the Recognize app detects.
 *
 * The values are tag names, which the server matches for albums.
 * The timeline search cannot filter by system tag, so the files of the
 * selected tags are fetched when picking one and searched by file id.
 */
export const tagsFilter: PhotosFilter<TagsValueType> = {
	id: tagsFilterId,
	icon: tagOutlineSvg,
	renderOptionComponent: TagOption,
	async getOptions() {
		if (!areTagsInstalled) {
			return []
		}

		const systemTagsStore = useSystemTagsStore()
		if (Object.keys(systemTagsStore.tags).length === 0) {
			await systemTagsStore.fetchAllTags(new AbortController().signal)
		}

		const tagsByName = new Map(Object.values(systemTagsStore.tags).map((tag) => [tagName(tag), tag]))

		return [...tagsByName].map(([name, tag]) => ({
			filterId: tagsFilterId,
			label: t('recognize', name),
			value: name,
			imgSrc: tag.attributes['reference-fileid']
				? generateUrl(`/core/preview?fileId=${tag.attributes['reference-fileid']}&x=${64}&y=${64}&forceIcon=0&a=1`)
				: undefined,
			async getValue() {
				const signal = new AbortController().signal
				await Promise.all(getTagsNamed([name]).map((tag) => systemTagsStore.fetchTagFiles(tag.id, signal)))
				return name
			},
		})).sort((a, b) => a.label.localeCompare(b.label))
	},
	getQuery(tagNames: TagsValueType[]): string {
		const systemTagsStore = useSystemTagsStore()
		const fileIds = new Set(getTagsNamed(tagNames).flatMap((tag) => systemTagsStore.tagsFiles[tag.id] ?? []))

		// No file has the id 0: nothing matches until the tagged files are known.
		const dav = [...(fileIds.size > 0 ? fileIds : [0])].map((fileId) => `
			<d:eq>
				<d:prop><oc:fileid/></d:prop>
				<d:literal>${fileId}</d:literal>
			</d:eq>`)

		return `<d:or>${dav.join('')}</d:or>`
	},
}
