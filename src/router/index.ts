/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import Vue from 'vue'
import Router from 'vue-router'
import { imageMimes, videoMimes } from '../services/AllowedMimes.js'
import areTagsInstalled from '../services/AreTagsInstalled.js'
import isMapsInstalled from '../services/IsMapsInstalled.js'
import isRecognizeInstalled from '../services/IsRecognizeInstalled.js'

const FoldersView = () => import('../views/FoldersView.vue')
const AlbumsView = () => import('../views/AlbumsView.vue')
const AlbumContent = () => import('../views/AlbumContent.vue')
const SharedAlbums = () => import('../views/SharedAlbums.vue')
const SharedAlbumContent = () => import('../views/SharedAlbumContent.vue')
const PublicAlbumContent = () => import('../views/PublicAlbumContent.vue')
const PlacesView = () => import('../views/PlacesView.vue')
const PlaceContent = () => import('../views/PlaceContent.vue')
const TagsView = () => import('../views/TagsView.vue')
const TagContent = () => import('../views/TagContent.vue')
const TimelineView = () => import('../views/TimelineView.vue')
const FacesView = () => import('../views/FacesView.vue')
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
 * @param path
 */
function parsePathParams(path: string | string[]): string {
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
			component: TimelineView,
			name: 'all_media',
			props: () => ({
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
			component: TimelineView,
			name: 'photos',
			props: () => ({
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
			component: TimelineView,
			name: 'videos',
			props: () => ({
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
			component: AlbumsView,
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
			name: 'albumsContent',
			props: (route) => ({
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
			name: 'sharedAlbumsContent',
			props: (route) => ({
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
			props: (route) => ({
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
			component: PlacesView,
			name: 'places',
		},
		{
			path: '/places/:placeName*',
			component: PlaceContent,
			name: 'placesContent',
			props: (route) => ({
				placeName: route.params.placeName,
			}),
		},
		{
			path: '/folders/:path*',
			component: FoldersView,
			name: 'folders',
			props: (route) => ({
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
			component: FoldersView,
			name: 'shared',
			props: (route) => ({
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
			component: TimelineView,
			name: 'favorites',
			props: () => ({
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
			component: TagsView,
			name: 'tags',
			redirect: !areTagsInstalled ? { name: 'timeline' } : undefined,
			props: (route) => ({
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
			redirect: !areTagsInstalled ? { name: 'timeline' } : undefined,
			props: (route) => ({
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
			component: TimelineView,
			props: () => ({
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
			component: FacesView,
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
				rootTitle: () => {
					return t('photos', 'Unassigned faces')
				},
			},
		},
		{
			path: '/faces/:faceName',
			name: 'facecontent',
			component: FaceContent,
			props: (route) => ({
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

router.afterEach((to, from) => {
	// Update page title
	const rootTitle = to.meta?.rootTitle?.(to)
	if (rootTitle) {
		document.title = `${rootTitle} - ${baseTitle}`
	} else {
		document.title = baseTitle
	}

	// Close sidebar on view change
	const isSidebarOpen = !!window.OCA?.Files?.Sidebar?.file
	if (isSidebarOpen && to.name !== from.name) {
		window.OCA.Files.Sidebar.close()
	}
})

export default router
