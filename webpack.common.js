const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const StyleLintPlugin = require('stylelint-webpack-plugin')

const SassGetGridConfig = require('./src/utils/SassGetGridConfig')
const ModuleReplaceWebpackPlugin = require('module-replace-webpack-plugin');

const packageJson = require('./package.json')
const appName = packageJson.name

module.exports = {
	entry: path.join(__dirname, 'src', 'main.js'),
	output: {
		path: path.resolve(__dirname, './js'),
		publicPath: '/js/',
		filename: `${appName}.js`,
		chunkFilename: 'chunks/[name]-[hash].js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['vue-style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
					'css-loader',
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							functions: {
								'get($keys)': SassGetGridConfig,
							},
						},
					},
				],
			},
			{
				test: /\.(js|vue)$/,
				use: 'eslint-loader',
				exclude: /node_modules/,
				enforce: 'pre',
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules(?!(\/|\\)(hot-patcher|webdav)(\/|\\))/,
			},
			{
				test: /\.svg$/,
				// illustrations
				loader: 'svg-inline-loader',
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
		new StyleLintPlugin(),
		// patch webdav/dist/request.js
		new ModuleReplaceWebpackPlugin({
			modules: [{
				test: /request.js/,
				replace: './src/patchedRequest.js',
				exclude: [/patchedRequest.js$/],
			}],
		}),
	],
	resolve: {
		extensions: ['*', '.js', '.vue'],
		symlinks: false,
	},
}
