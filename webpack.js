const { merge } = require('webpack-merge')
const webpackConfig = require('@nextcloud/webpack-vue-config')

const SassGetGridConfig = require('./src/utils/SassGetGridConfig')
const ModuleReplaceWebpackPlugin = require('module-replace-webpack-plugin');
const BabelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except')

const config = {
	module: {
		rules: [
			{
				test: /\.svg$/,
				// illustrations
				loader: 'raw-loader',
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								functions: {
									'get($keys)': SassGetGridConfig,
								},
							},
						},
					},
				],
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: BabelLoaderExcludeNodeModulesExcept([
					'@essentials/request-timeout',
					'@nextcloud/event-bus',
					'camelcase',
					'hot-patcher',
					'semver',
					'webdav',
				]),
			},
		],
	},
	plugins: [
		// patch webdav/dist/request.js
		new ModuleReplaceWebpackPlugin({
			modules: [{
				test: /request.js/,
				replace: './src/patchedRequest.js',
				exclude: [/patchedRequest.js$/],
			}],
		}),
	],
}

// Remove svg from default url-loader
const svgRule = webpackConfig.module.rules.find(rule => rule.test && rule.test.toString().indexOf('|svg') !== -1)
svgRule.test = new RegExp(svgRule.test.toString().replace('|svg', ''))

// Merge configs
const mergedConfigs = merge(config, webpackConfig)

// Remove duplicate rules by the `test` key
mergedConfigs.module.rules = mergedConfigs.module.rules
	.filter((v, i, a) => a.findIndex(t => (t.test.toString() === v.test.toString())) === i)

// Merge rules by replacing existing tests
module.exports = mergedConfigs
