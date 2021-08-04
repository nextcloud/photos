const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('@nextcloud/webpack-vue-config')
const webpackRules = require('@nextcloud/webpack-vue-config/rules')

const SassGridConfig = require('./src/utils/SassGridConfig')
const BabelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except')

const WorkboxPlugin = require('workbox-webpack-plugin')

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

webpackConfig.plugins.push(
	// patch webdav/dist/request.js
	new webpack.NormalModuleReplacementPlugin(
		/request.js/,
		function(resource) {
			if (resource.context.indexOf('webdav/dist') > -1) {
				resource.request = path.join(__dirname, 'src/patchedRequest.js')
			}
		},
	),
	new WorkboxPlugin.GenerateSW({
		swDest: 'photos-service-worker.js',
		clientsClaim: true,
		skipWaiting: true,
		exclude: [new RegExp('.*')], // don't do precaching
		inlineWorkboxRuntime: true,
		sourcemap: false,

		// Define runtime caching rules.
		runtimeCaching: [{
			// Match any preview file request
			urlPattern: /^.*\/core\/preview\?fileId=.*/,

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
	})
)

module.exports = webpackConfig
