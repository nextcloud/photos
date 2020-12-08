module.exports = {
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-proposal-optional-chaining',
	],
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false
			}
		]
	]
}
