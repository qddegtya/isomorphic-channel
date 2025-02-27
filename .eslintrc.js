const babelParser = require("@babel/eslint-parser");

module.exports = [{
  languageOptions: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      requireConfigFile: false,
      babelOptions: {
        plugins: ["@babel/plugin-proposal-class-properties"]
      }
    },
    globals: {
      process: "readonly",
      window: "readonly",
      document: "readonly",
      console: "readonly",
      module: "readonly",
      require: "readonly"
    },
    ecmaVersion: 2022,
    sourceType: "module"
  },
  rules: {
    indent: [2, 2],
    quotes: [2, "single"],
    "linebreak-style": [2, "unix"],
    semi: [2, "never"]
  },
  files: ["src/**/*.js"]
}]
