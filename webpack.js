const path = require('path')
const webpackConfig = require('@nextcloud/webpack-vue-config')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackSPDXPlugin = require('./build-js/WebpackSPDXPlugin.js')
const webpackRules = require('@nextcloud/webpack-vue-config/rules')
const SassGridConfig = require('./src/utils/SassGridConfig.js')
const BabelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except')

const WorkboxPlugin = require('workbox-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

webpackConfig.entry = {
	main: path.join(__dirname, 'src', 'main.js'),
	public: path.join(__dirname, 'src', 'public.js'),
	sidebar: path.join(__dirname, 'src', 'sidebar.js'),
	dashboard: path.join(__dirname, 'src', 'dashboard.js'),
}

webpackRules.RULE_JS.exclude = BabelLoaderExcludeNodeModulesExcept([
	'@essentials/request-timeout',
	'@nextcloud/event-bus',
	'camelcase',
	'hot-patcher',
	'semver',
	'vue-virtual-grid',
	'webdav',
])
webpackRules.RULE_SCSS.use = [
	'style-loader',
	'css-loader',
	'postcss-loader',
	{
		loader: 'sass-loader',
		options: {
			additionalData: SassGridConfig,
		},
	},
]

// Load raw SVGs to be able to inject them via v-html
webpackRules.RULE_ASSETS.test = /\.(png|jpe?g|gif|woff2?|eot|ttf)$/
webpackRules.RULE_RAW_SVGS = {
	test: /\.svg$/,
	type: 'asset/source',
}

webpackConfig.module.rules = Object.values(webpackRules)

webpackConfig.plugins.push(
	new WorkboxPlugin.GenerateSW({
		swDest: 'photos-service-worker.js',
		clientsClaim: true,
		skipWaiting: true,
		exclude: [/.*/], // don't do precaching
		inlineWorkboxRuntime: true,
		sourcemap: false,

		// Define runtime caching rules.
		runtimeCaching: [{
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
		}],
	}),
)

if (!isDev) {
	// block creation of LICENSE.txt files now replaced with .license files
	webpackConfig.optimization.minimizer = [new TerserPlugin({
		extractComments: false,
		terserOptions: {
			format: {
				comments: false,
			},
		},
	})]

	webpackConfig.plugins = [
		...webpackConfig.plugins,
		// Generate reuse license files
		new WebpackSPDXPlugin({
			override: {
				// TODO: Remove if they fixed the license in the package.json
				'@nextcloud/axios': 'GPL-3.0-or-later',
				'@nextcloud/vue': 'AGPL-3.0-or-later',
				'nextcloud-vue-collections': 'AGPL-3.0-or-later',
			}
		}),
	]
}

module.exports = webpackConfig
