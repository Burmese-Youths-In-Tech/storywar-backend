// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["**.js", "/dist/**"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {},
  settings: {
    "import/resolver": {
      typescript: {
        project: ["packages/types/tsconfig.json", "src/tsconfig.json"],
      },
    },
  },
};
