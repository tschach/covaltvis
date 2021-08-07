module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "plugins": [
        "compat"
    ],
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        "compat/compat": "warn"
    },
    "globals": {
        "axios": true,
        "moment": true,
        "Chart": true
    }
};
