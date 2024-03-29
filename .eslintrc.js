module.exports = {
	"env": {
		"browser": true,
		"es2021":  true,
		"jquery":  true
	},
	"extends": ["eslint:recommended", "plugin:userscripts/recommended"],
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly",
	},
	"overrides": [],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true,
		},
		"ecmaVersion": "latest"
	},
	"rules": {
		// "accessor-pairs": "error",
		// "array-bracket-newline": "error",
		// "array-bracket-spacing": ["error", "never"],
		// "array-callback-return": "error",
		// "array-element-newline": "off",
		// "arrow-body-style": "off",
		// "arrow-parens": ["error", "always"],
		// "arrow-spacing": [
		// 	"error",
		// 	{
		// 		after: true,
		// 		before: true,
		// 	},
		// ],
		// "block-scoped-var": "error",
		// "block-spacing": "error",
		// "brace-style": "off",
		// "callback-return": "error",
		// camelcase: "off",
		// "capitalized-comments": "off",
		// "class-methods-use-this": "off",
		// "comma-dangle": "off",
		// "comma-spacing": [
		// 	"error",
		// 	{
		// 		after: true,
		// 		before: false,
		// 	},
		// ],
		// "comma-style": ["error", "last"],
		// complexity: "error",
		// "computed-property-spacing": ["error", "never"],
		// "consistent-return": "error",
		// "consistent-this": "off",
		// curly: "error",
		// "default-case": "off",
		// "default-param-last": "error",
		// "dot-location": ["error", "property"],
		// "dot-notation": "error",
		// "eol-last": "error",
		// eqeqeq: "error",
		// "func-call-spacing": "error",
		// "func-name-matching": "error",
		// "func-names": "off",
		// "func-style": "error",
		// "function-call-argument-newline": ["error", "consistent"],
		// "function-paren-newline": "off",
		// "generator-star-spacing": "error",
		// "global-require": "error",
		// "grouped-accessor-pairs": "error",
		// "guard-for-in": "error",
		// "handle-callback-err": "error",
		// "id-blacklist": "error",
		// "id-length": "off",
		// "id-match": "error",
		// "implicit-arrow-linebreak": ["error", "beside"],
		// indent: "off",
		// "indent-legacy": "off",
		// "init-declarations": "error",
		// "jsx-quotes": "error",
		// "key-spacing": "error",
		// "keyword-spacing": [
		// 	"error",
		// 	{
		// 		after: true,
		// 		before: true,
		// 	},
		// ],
		// "line-comment-position": "off",
		// "linebreak-style": ["error", "windows"],
		// "lines-around-comment": "error",
		// "lines-around-directive": "off",
		// "lines-between-class-members": "off",
		// "max-classes-per-file": "error",
		// "max-depth": "error",
		// "max-len": "off",
		// "max-lines": "off",
		// "max-lines-per-function": "off",
		// "max-nested-callbacks": "error",
		// "max-params": "off",
		// "max-statements": "off",
		// "max-statements-per-line": "error",
		// "multiline-comment-style": "off",
		// "multiline-ternary": ["error", "always-multiline"],
		// "new-parens": "error",
		// "newline-after-var": "off",
		// "newline-before-return": "off",
		// "newline-per-chained-call": "off",
		// "no-alert": "off",
		// "no-array-constructor": "error",
		// "no-await-in-loop": "error",
		// "no-bitwise": "error",
		// "no-buffer-constructor": "error",
		// "no-caller": "error",
		// "no-catch-shadow": "error",
		// "no-confusing-arrow": "error",
		// "no-console": "off",
		// "no-constructor-return": "error",
		// "no-continue": "error",
		// "no-div-regex": "off",
		// "no-dupe-else-if": "error",
		// "no-duplicate-imports": "error",
		// "no-else-return": "off",
		// "no-empty-function": "error",
		// "no-eq-null": "error",
		// "no-eval": "error",
		// "no-extend-native": "error",
		// "no-extra-bind": "error",
		// "no-extra-label": "error",
		// "no-extra-parens": "error",
		// "no-floating-decimal": "error",
		// "no-implicit-coercion": "error",
		// "no-implicit-globals": "off",
		// "no-implied-eval": "error",
		// "no-import-assign": "error",
		// "no-inline-comments": "off",
		// "no-invalid-this": "off",
		// "no-iterator": "error",
		// "no-label-var": "error",
		// "no-labels": "error",
		// "no-lone-blocks": "error",
		// "no-lonely-if": "off",
		// "no-loop-func": "error",
		// "no-magic-numbers": "off",
		// "no-mixed-operators": "error",
		// "no-mixed-requires": "error",
		// "no-multi-assign": "error",
		// "no-multi-spaces": "error",
		// "no-multi-str": "error",
		// "no-multiple-empty-lines": "error",
		// "no-native-reassign": "error",
		// "no-negated-condition": "off",
		// "no-negated-in-lhs": "error",
		// "no-nested-ternary": "off",
		// "no-new": "error",
		// "no-new-func": "error",
		// "no-new-object": "error",
		// "no-new-require": "error",
		// "no-new-wrappers": "error",
		// "no-octal-escape": "error",
		// "no-param-reassign": "off",
		// "no-path-concat": "error",
		// "no-plusplus": "error",
		// "no-process-env": "error",
		// "no-process-exit": "error",
		// "no-proto": "error",
		// "no-restricted-globals": "error",
		// "no-restricted-imports": "error",
		// "no-restricted-modules": "error",
		// "no-restricted-properties": "error",
		// "no-restricted-syntax": "error",
		// "no-return-assign": "error",
		// "no-return-await": "error",
		// "no-script-url": "error",
		// "no-self-compare": "off",
		// "no-sequences": "error",
		// "no-setter-return": "error",
		// "no-shadow": "error",
		// "no-spaced-func": "error",
		// "no-sync": "error",
		// "no-tabs": [
		// 	"error",
		// 	{
		// 		allowIndentationTabs: true,
		// 	},
		// ],
		// "no-template-curly-in-string": "error",
		// "no-ternary": "off",
		// "no-throw-literal": "off",
		// "no-trailing-spaces": "error",
		// "no-undef-init": "error",
		// "no-undefined": "error",
		// "no-underscore-dangle": "off",
		// "no-unmodified-loop-condition": "error",
		// "no-unneeded-ternary": "error",
		// "no-unused-expressions": "error",
		// "no-use-before-define": "error",
		// "no-useless-call": "error",
		// "no-useless-computed-key": "error",
		// "no-useless-concat": "error",
		// "no-useless-constructor": "error",
		// "no-useless-rename": "error",
		// "no-useless-return": "error",
		// "no-var": "off",
		// "no-void": "error",
		// "no-warning-comments": "off",
		// "no-whitespace-before-property": "error",
		// "nonblock-statement-body-position": "error",
		// "object-curly-newline": "error",
		// "object-curly-spacing": ["error", "always"],
		// "object-shorthand": "off",
		// "one-var": "off",
		// "one-var-declaration-per-line": "error",
		// "operator-assignment": ["error", "always"],
		// "operator-linebreak": ["error", null],
		// "padded-blocks": "off",
		// "padding-line-between-statements": "error",
		// "prefer-arrow-callback": "off",
		// "prefer-const": "off",
		// "prefer-destructuring": "off",
		// "prefer-exponentiation-operator": "error",
		// "prefer-named-capture-group": "off",
		// "prefer-numeric-literals": "error",
		// "prefer-object-spread": "error",
		// "prefer-promise-reject-errors": "error",
		// "prefer-reflect": "off",
		// "prefer-regex-literals": "error",
		// "prefer-rest-params": "error",
		// "prefer-spread": "error",
		// "prefer-template": "off",
		// "quote-props": "off",
		// quotes: "off",
		// radix: ["error", "as-needed"],
		// "require-await": "error",
		// "require-jsdoc": "error",
		// "require-unicode-regexp": "off",
		// "rest-spread-spacing": "error",
		// semi: "error",
		// "semi-spacing": "error",
		// "semi-style": ["error", "last"],
		// "sort-imports": "error",
		// "sort-keys": "off",
		// "sort-vars": "off",
		// "space-before-blocks": "error",
		// "space-before-function-paren": "off",
		// "space-in-parens": ["error", "never"],
		// "space-infix-ops": "error",
		// "space-unary-ops": "error",
		// "spaced-comment": "off",
		// strict: ["error", "global"],
		// "switch-colon-spacing": "error",
		// "symbol-description": "error",
		// "template-curly-spacing": ["error", "never"],
		// "template-tag-spacing": "error",
		// "unicode-bom": ["error", "never"],
		// "valid-jsdoc": "error",
		// "vars-on-top": "off",
		// "wrap-regex": "error",
		// "yield-star-spacing": "error",
		// yoda: ["error", "never"],
	}
}
