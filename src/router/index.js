/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { generateUrl } from '@nextcloud/router'
import Router from 'vue-router'
import Vue from 'vue'

import isMapsInstalled from '../services/IsMapsInstalled.js'
import areTagsInstalled from '../services/AreTagsInstalled.js'
import { imageMimes, videoMimes } from '../services/AllowedMimes.js'

import isRecognizeInstalled from '../services/IsRecognizeInstalled.js'

const Folders = () => import('../views/Folders.vue')
const Albums = () => import('../views/Albums.vue')
const AlbumContent = () => import('../views/AlbumContent.vue')
const SharedAlbums = () => import('../views/SharedAlbums.vue')
const SharedAlbumContent = () => import('../views/SharedAlbumContent.vue')
const PublicAlbumContent = () => import('../views/PublicAlbumContent.vue')
const Places = () => import('../views/Places.vue')
const PlaceContent = () => import('../views/PlaceContent.vue')
const Tags = () => import('../views/Tags.vue')
const TagContent = () => import('../views/TagContent.vue')
const Timeline = () => import('../views/Timeline.vue')
const Faces = () => import('../views/Faces.vue')
const FaceContent = () => import('../views/FaceContent.vue')

const UnassignedFaces = () => import('../views/UnassignedFaces.vue')

const baseTitle = document.title

Vue.use(Router)

let mapsPath = generateUrl('/apps/maps')
if (!isMapsInstalled) {
	mapsPath = generateUrl('/settings/apps/integration/maps')
}

/**
 * Parse the path of a route : join the elements of the array and return a single string with slashes
 * + always lead current path with a slash
 *
 * @param {string | Array} path path arguments to parse
 * @return {string}
 */
const parsePathParams = (path) => {
	return `/${Array.isArray(path) ? path.join('/') : path || ''}`
}

const router = new Router({
	mode: 'history',
	// if index.php is in the url AND we got this far, then it's working:
	// let's keep using index.php in the url
	base: generateUrl('/apps/photos'),
	linkActiveClass: 'active',
	routes: [
		{
			path: '/',
			component: Timeline,
			name: 'all_media',
			props: route => ({
				rootTitle: t('photos', 'All your media'),
			}),
			meta: {
				rootTitle: () => {
					return t('photos', 'All your media')
				},
			},
		},
		{
			path: '/photos',
			component: Timeline,
			name: 'photos',
			props: route => ({
				rootTitle: t('photos', 'Photos'),
				mimesType: imageMimes,
			}),
			meta: {
				rootTitle: () => {
					return t('photos', 'Photos')
				},
			},
		},
		{
			path: '/videos',
			component: Timeline,
			name: 'videos',
			props: route => ({
				rootTitle: t('photos', 'Videos'),
				mimesType: videoMimes,
			}),
			meta: {
				rootTitle: () => {
					return t('photos', 'Videos')
				},
			},
		},
		{
			path: '/albums',
			component: Albums,
			name: 'albums',
			meta: {
				rootTitle: () => {
					return t('photos', 'Albums')
				},
			},
		},
		{
			path: '/albums/:albumName*',
			component: AlbumContent,
			name: 'albums',
			props: route => ({
				albumName: route.params.albumName,
			}),
			meta: {
				rootTitle: (to) => {
					return t('photos', 'Album {title}', { title: to.params.albumName })
				},
			},
		},
		{
			path: '/sharedalbums',
			component: SharedAlbums,
			name: 'sharedAlbums',
			meta: {
				rootTitle: () => {
					return t('photos', 'Shared Albums')
				},
			},
		},
		{
			path: '/sharedalbums/:albumName*',
			component: SharedAlbumContent,
			name: 'sharedAlbums',
			props: route => ({
				albumName: route.params.albumName,
			}),
			meta: {
				rootTitle: (to) => {
					return t('photos', 'Shared album {title}', { title: to.params.albumName })
				},
			},
		},
		{
			path: '/public/:token',
			component: PublicAlbumContent,
			name: 'publicAlbums',
			props: route => ({
				token: route.params.token,
			}),
			meta: {
				rootTitle: (to) => {
					return t('photos', 'Public album {title}', { title: to.params.token })
				},
			},
		},
		{
			path: '/places',
			component: Places,
			name: 'places',
		},
		{
			path: '/places/:placeName*',
			component: PlaceContent,
			name: 'places',
			props: route => ({
				placeName: route.params.placeName,
			}),
		},
		{
			path: '/folders/:path*',
			component: Folders,
			name: 'folders',
			props: route => ({
				path: parsePathParams(route.params.path),
				// if path is empty
				isRoot: !route.params.path,
				rootTitle: t('photos', 'Folders'),
			}),
			meta: {
				rootTitle: () => {
					return t('photos', 'Folders')
				},
			},
		},
		{
			path: '/shared/:path*',
			component: Folders,
			name: 'shared',
			props: route => ({
				path: parsePathParams(route.params.path),
				// if path is empty
				isRoot: !route.params.path,
				rootTitle: t('photos', 'Shared with you'),
				showShared: true,
			}),
			meta: {
				rootTitle: () => {
					return t('photos', 'Shared with you')
				},
			},
		},
		{
			path: '/favorites',
			component: Timeline,
			name: 'favorites',
			props: route => ({
				rootTitle: t('photos', 'Favorites'),
				onlyFavorites: true,
			}),
			meta: {
				rootTitle: () => {
					return t('photos', 'Favorites')
				},
			},
		},
		{
			path: '/tags/',
			component: Tags,
			name: 'tags',
			redirect: !areTagsInstalled ? { name: 'timeline' } : null,
			props: route => ({
				path: '',
				isRoot: !route.params.path,
				rootTitle: t('photos', 'Tagged photos'),
			}),
			meta: {
				rootTitle: () => {
					return t('photos', 'Tagged photos')
				},
			},
		},
		{
			path: '/tags/:path',
			component: TagContent,
			name: 'tagcontent',
			redirect: !areTagsInstalled ? { name: 'timeline' } : null,
			props: route => ({
				path: `${route.params.path ? route.params.path : ''}`,
			}),
			meta: {
				rootTitle: (to) => {
					return t('photos', 'Tagged photo {title}', { title: to.params.path })
				},
			},
		},
		{
			path: '/maps',
			name: 'maps',
			// router-link doesn't support external url, let's force the redirect
			beforeEnter() {
				window.open(mapsPath, '_blank')
			},
		},
		{
			path: '/thisday',
			name: 'thisday',
			component: Timeline,
			props: route => ({
				rootTitle: t('photos', 'On this day'),
				onThisDay: true,
			}),
			meta: {
				rootTitle: () => {
					return t('photos', 'On this day')
				},
			},
		},
		{
			path: '/faces',
			name: 'faces',
			component: Faces,
			...((!isRecognizeInstalled) && {
				beforeEnter() {
					const recognizeInstallLink = generateUrl('/settings/apps/installed/recognize')
					window.open(recognizeInstallLink, '_blank')
				},
			}),
		},
		{
			path: '/faces/unassigned',
			name: 'unassignedfaces',
			component: UnassignedFaces,
			meta: {
				rootTitle: (to) => {
					return t('photos', 'Unassigned faces')
				},
			},
		},
		{
			path: '/faces/:faceName',
			name: 'facecontent',
			component: FaceContent,
			props: route => ({
				rootTitle: route.params.faceName,
				faceName: route.params.faceName,
			}),
			meta: {
				rootTitle: (to) => {
					return t('photos', "{title}'s face", { title: to.params.faceName })
				},
			},
		},
	],
})

router.afterEach((to) => {
	const rootTitle = to.meta.rootTitle?.(to)
	if (rootTitle) {
		document.title = `${rootTitle} - ${baseTitle}`
	} else {
		document.title = baseTitle
	}
})

export default router
