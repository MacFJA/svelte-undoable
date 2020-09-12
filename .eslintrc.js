module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": ["eslint:recommended", "plugin:import/errors"],
    "parserOptions": {
        "ecmaVersion": 2019,
        "sourceType": "module"
    },
    plugins: [
        "import"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "never"
        ],
        "import/export": ["error"],
        "import/order": ["error", {"newlines-between": "always", "alphabetize": {"order": "asc", "caseInsensitive": true}}],
        "import/newline-after-import": ["error"],
        "import/no-absolute-path": ["error"]
    },
    "settings": {
        "import/extensions": [".js"],
    }
}
