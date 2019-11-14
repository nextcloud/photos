/**
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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

import Albums from '../views/Albums'
import Tags from '../views/Tags'

Vue.use(Router)

export default new Router({
	mode: 'history',
	// if index.php is in the url AND we got this far, then it's working:
	// let's keep using index.php in the url
	base: generateUrl('/apps/photos', ''),
	linkActiveClass: 'active',
	routes: [
		{
			path: '/',
			component: Albums,
			name: 'root',
		},
		{
			path: '/albums',
			component: Albums,
			name: 'albums',
			props: route => ({
				// always lead current path with a slash
				path: `/${route.params.path ? route.params.path : ''}`,
			}),
			children: [
				{
					path: ':path*',
					name: 'albumspath',
					component: Albums,
				},
			],
		},
		{
			path: '/shared',
			component: Albums,
			name: 'shared',
			props: route => ({
				// always lead current path with a slash
				path: `/${route.params.path ? route.params.path : ''}`,
				showShared: true,
			}),
			children: [
				{
					path: ':path*',
					name: 'sharedpath',
					component: Albums,
				},
			],
		},
		{
			path: '/favorites',
			component: Tags,
			name: 'favorites',
		},
		{
			path: '/tags',
			component: Tags,
			name: 'tags',
			props: route => ({
				tagname: route.params.tagname,
			}),
			children: [
				{
					path: ':tagname',
					name: 'tagname',
					component: Tags,
				},
			],
		},
		{
			path: '/maps',
			name: 'maps',
			redirect: '',
		},
	],
})
