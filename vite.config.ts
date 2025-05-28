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

					// Define runtime caching rules.
					runtimeCaching: [
						{
						// Match any preview file request
							urlPattern: /^.*\/apps\/photos\/api\/v1\/preview\/.*/,

							// Apply a strategy.
							handler: 'CacheFirst',

							options: {
							// Use a custom cache name.
								cacheName: 'images',

								// Only cache 10000 images.
								expiration: {
									maxAgeSeconds: 3600 * 24 * 7, // one week
									maxEntries: 10000,
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
