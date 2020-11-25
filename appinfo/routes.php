<?php
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

return [
	'routes' => [
		['name' => 'api#setUserConfig', 'url' => '/api/v1/config/{key}', 'verb' => 'PUT'],
		['name' => 'api#serviceWorker', 'url' => '/service-worker.js', 'verb' => 'GET'],

		['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
		['name' => 'page#index', 'url' => '/videos', 'verb' => 'GET', 'postfix' => 'videos'],
		['name' => 'page#index', 'url' => '/favorites', 'verb' => 'GET', 'postfix' => 'favorites'],
		['name' => 'page#index', 'url' => '/albums/{path}', 'verb' => 'GET', 'postfix' => 'albums',
			'requirements' => [
				'path' => '.*',
			],
			'defaults' => [
				'path' => '',
			]
		],
		['name' => 'page#index', 'url' => '/shared/{path}', 'verb' => 'GET', 'postfix' => 'shared',
			'requirements' => [
				'path' => '.*',
			],
			'defaults' => [
				'path' => '',
			]
		],
		['name' => 'page#index', 'url' => '/tags/{path}', 'verb' => 'GET', 'postfix' => 'tags',
			'requirements' => [
				'path' => '.*',
			],
			'defaults' => [
				'path' => '',
			]
		],
		 
		// apis
		[
			'name' => 'albums#myAlbums',
			'url' => '/api/v1/albums/{path}',
			'verb' => 'GET',
			'requirements' => [
				'path' => '.*',
			],
			'defaults' => [
				'path' => '',
			],
		],
		[
			'name' => 'albums#sharedAlbums',
			'url' => '/api/v1/shared/{path}',
			'verb' => 'GET',
			'requirements' => [
				'path' => '.*',
			],
			'defaults' => [
				'path' => '',
			],
		],
	]
];
