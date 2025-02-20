<?php

/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

return [
	'routes' => [
		['name' => 'api#setUserConfig', 'url' => '/api/v1/config/{key}', 'verb' => 'PUT'],
		['name' => 'api#serviceWorker', 'url' => '/service-worker.js', 'verb' => 'GET'],

		['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
		['name' => 'page#index', 'url' => '/thisday', 'verb' => 'GET', 'postfix' => 'thisday'],
		['name' => 'page#index', 'url' => '/photos', 'verb' => 'GET', 'postfix' => 'photos'],
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
		['name' => 'page#index', 'url' => '/sharedalbums/{path}', 'verb' => 'GET', 'postfix' => 'sharedalbums',
			'requirements' => [
				'path' => '.*',
			],
			'defaults' => [
				'path' => '',
			]
		],
		['name' => 'page#index', 'url' => '/places/{path}', 'verb' => 'GET', 'postfix' => 'places',
			'requirements' => [
				'path' => '.*',
			],
			'defaults' => [
				'path' => '',
			]
		],
		[ 'name' => 'publicAlbum#get', 'url' => '/public/{token}', 'verb' => 'GET',
			'requirements' => [
				'token' => '.*',
			],
		],
		['name' => 'page#index', 'url' => '/folders/{path}', 'verb' => 'GET', 'postfix' => 'folders',
			'requirements' => [
				'path' => '.*',
			],
			'defaults' => [
				'path' => '',
			]
		],
		['name' => 'page#index', 'url' => '/folders/{path}', 'verb' => 'GET', 'postfix' => 'folders',
			'requirements' => [
				'path' => '.*',
			],
			'defaults' => [
				'path' => '',
			]
		],
		['name' => 'page#index', 'url' => '/faces/{path}', 'verb' => 'GET', 'postfix' => 'faces',
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
		],
		['name' => 'page#index', 'url' => '/tags/{path}', 'verb' => 'GET', 'postfix' => 'tags',
			'requirements' => [
				'path' => '.*',
			],
			'defaults' => [
				'path' => '',
			]
		],
		['name' => 'page#index', 'url' => '/categories/{path}', 'verb' => 'GET', 'postfix' => 'categories',
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

		[
			'name' => 'preview#index',
			'url' => '/api/v1/preview/{fileId}',
			'verb' => 'GET',
			'requirements' => [
				'fileId' => '.*',
			]
		],

		[
			'name' => 'publicPreview#index',
			'url' => '/api/v1/publicPreview/{fileId}',
			'verb' => 'GET',
			'requirements' => [
				'fileId' => '.*',
			]
		],
	]
];
