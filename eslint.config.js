import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["**/dist/", "dist-hosting/", "**/node_modules/", ".next/", ".vinext/"] },
  js.configs.recommended,
  {
    files: ["hosting/**/*.cjs"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  {
    files: ["backend/**/*.js", "scripts/**/*.mjs", "*.js"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["frontend/**/*.{js,jsx}", "pages/**/*.jsx"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Marks components used in JSX as used, so no-unused-vars only reports real leftovers.
      "react/jsx-uses-vars": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
