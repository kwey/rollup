const path = require("path");
module.exports = {
	parser: "@typescript-eslint/parser",
	extends: [
		"plugin:@typescript-eslint/recommended",
	],
	parserOptions: {
		project: path.resolve(__dirname, "./tsconfig.json"),
		tsconfigRootDir: __dirname,
		ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
		sourceType: "module", // Allows for the use of imports
	},
	rules: {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. "@typescript-eslint/explicit-function-return-type": "off",
        "camelcase": [2, {"properties": "always"}] ,
        '@typescript-eslint/explicit-member-accessibility': 0,
        // '@typescript-eslint/camelcase': 'error',
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/ban-ts-comment": "off"
	},
};
