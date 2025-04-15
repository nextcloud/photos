module.exports = {
	extends: [
		'@nextcloud/eslint-config/typescript',
	],
	globals: {
		appName: true,
	},
	overrides: [
		{
			files: ['*.ts', '*.vue'],
			rules: {
				'jsdoc/require-jsdoc': 'off',
				'jsdoc/require-param': 'off',
			},
		},
	],
}
