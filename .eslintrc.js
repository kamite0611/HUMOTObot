module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2021,
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "unused-imports", "import"],
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: "./tsconfig.json",
      },
    },
  },
  rules: {
    "no-var": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "class",
        format: ["PascalCase"],
      },
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "function",
        format: ["camelCase", "PascalCase"],
      },
      {
        selector: "method",
        format: ["camelCase"],
      },
      {
        selector: "interface",
        format: ["PascalCase"],
        // TODO: どこかのタイミングで適応して一括修正
        // custom: {
        //   regex: '^I[A-Z]',
        //   match: true,
        // },
      },
    ],
    // quotes: [
    //   'warn',
    //   'single',
    //   {
    //     avoidEscape: true,
    //     allowTemplateLiterals: true,
    //   },
    // ],
    "import/order": 0,
    "arrow-body-style": 1,
    "import/no-duplicates": 1,
    "import/no-useless-path-segments": 1,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-unused-vars": [
      1,
      {
        vars: "all",
        args: "none",
      },
    ],
    "@typescript-eslint/ban-types": 0,
  },
  overrides: [
    {
      // TypeScript 用に設定を上書く
      files: ["*.ts"],
      rules: {
        "unused-imports/no-unused-imports": "warn",
        "import/order": [
          "warn",
          {
            groups: [
              "builtin",
              "external",
              "internal",
              ["parent", "sibling"],
              "index",
              "object",
              "type",
            ],
            pathGroupsExcludedImportTypes: ["builtin"],
            alphabetize: { order: "asc", caseInsensitive: false },
            "newlines-between": "always",
          },
        ],
      },
    },
  ],
};
