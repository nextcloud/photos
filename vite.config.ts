import type { UserConfig } from 'vitest/node'

import { createAppConfig } from '@nextcloud/vite-config'
import { join } from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import SassGridConfig from './src/utils/SassGridConfig.js'

// replaced by vite
declare const __dirname: string

export default createAppConfig({
	main: join(__dirname, 'src', 'main.js'),
	public: join(__dirname, 'src', 'public.js'),
	sidebar: join(__dirname, 'src', 'sidebar.js'),
	dashboard: join(__dirname, 'src', 'dashboard.js'),
}, {
	thirdPartyLicense: false,
	extractLicenseInformation: true,
	createEmptyCSSEntryPoints: true,
	emptyOutputDirectory: {
		// also clear the css directory
		additionalDirectories: ['css'],
	},
	config: {
		build: {
			rollupOptions: {
				output: {
					manualChunks(id: string) {
						if (id.includes('vue-material-design-icon')) {
							return 'icons'
						}
					},
				},
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: SassGridConfig,
				},
			},
		},
		plugins: [
			VitePWA({
				manifest: false,
				injectRegister: false,

				workbox: {
					swDest: 'js/photos-service-worker.js',
					clientsClaim: true,
					skipWaiting: true,
					// don't do precaching
					globDirectory: undefined,
					globPatterns: undefined,
					globIgnores: undefined,
					inlineWorkboxRuntime: true,
					sourcemap: false,

					// Runtime caching rules. Order matters — the first
					// pattern that matches wins, so put narrow rules
					// (segments, status) before broad ones (timeline).
					runtimeCaching: [
						{
							// Preview thumbnails — content-addressed by
							// `?etag=…`, so safe to cache aggressively.
							// CacheFirst returns instantly for repeat
							// scrolls and skips even the SW's own
							// network probe.
							urlPattern: /^.*\/apps\/photos\/api\/v1\/(public)?[Pp]review\/.*/,
							handler: 'CacheFirst',
							options: {
								cacheName: 'photos-previews',
								expiration: {
									maxAgeSeconds: 3600 * 24 * 7, // one week
									maxEntries: 10000,
								},
							},
						},
						{
							// HLS transcode segments — also
							// content-addressed (segment N is immutable
							// once the manifest references it). Long
							// TTL because re-fetching is expensive.
							urlPattern: /^.*\/apps\/photos\/api\/v1\/transcode\/\d+\/seg-\d+\.ts$/,
							handler: 'CacheFirst',
							options: {
								cacheName: 'photos-transcode-segments',
								expiration: {
									maxAgeSeconds: 3600 * 24 * 30, // one month
									maxEntries: 2000,
								},
							},
						},
						{
							// Index status — frequent updates while the
							// migration runs, so NetworkFirst with a
							// short SW timeout fall-back to cache.
							urlPattern: /^.*\/apps\/photos\/api\/v1\/index\/status$/,
							handler: 'NetworkFirst',
							options: {
								cacheName: 'photos-index-status',
								networkTimeoutSeconds: 3,
								expiration: {
									maxAgeSeconds: 60,
									maxEntries: 4,
								},
							},
						},
						{
							// Search — interactive, freshness matters
							// more than offline behaviour. Tiny cache
							// window so a stale result doesn't linger
							// when a new photo lands and the query
							// would now include it.
							urlPattern: /^.*\/apps\/photos\/api\/v1\/index\/search/,
							handler: 'NetworkFirst',
							options: {
								cacheName: 'photos-search',
								networkTimeoutSeconds: 4,
								expiration: {
									maxAgeSeconds: 30,
									maxEntries: 50,
								},
							},
						},
						{
							// Indexed timeline — the hot path on
							// navigation between Photos / Videos /
							// Favorites tabs. StaleWhileRevalidate
							// returns the previous response instantly
							// (sub-50ms feel) while the SW kicks off a
							// network fetch in the background; if the
							// new response differs the cache updates
							// for the next visit. Tabs feel "instant".
							urlPattern: /^.*\/apps\/photos\/api\/v1\/index\/timeline/,
							handler: 'StaleWhileRevalidate',
							options: {
								cacheName: 'photos-timeline',
								expiration: {
									maxAgeSeconds: 3600 * 6, // 6 hours
									maxEntries: 200,
								},
							},
						},
					],
				},
			}),
		],
		// Setup for vitest unit tests
		test: {
			environment: 'happy-dom',
			coverage: {
				all: true,
				clean: true,
				extension: ['.js', '.ts', '.vue'],
				provider: 'v8',
			},
			root: 'src/',
			deps: {
				moduleDirectories: ['node_modules', '../node_modules'],
			},
			cache: {
				dir: '../node_modules/.vitest',
			},
			server: {
				deps: {
					inline: [/@nextcloud\/vue/, /@mdi\/svg/],
				},
			},
		} as UserConfig,
	},

})
