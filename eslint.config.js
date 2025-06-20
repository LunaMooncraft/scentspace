import js from '@eslint/js';
import ts from 'typescript-eslint';
import eslint from 'eslint-plugin-vue';
import stylistic from '@stylistic/eslint-plugin';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import globals from "globals";

const customRules = {
  // Stylistic
  'stylistic/comma-spacing': ['error', { before: false, after: true }],
  'stylistic/semi': ['error', 'always'],
  'stylistic/object-curly-spacing': ['error', 'always'],
  'stylistic/quotes': ['error', 'single'],
  // TypeScript
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/no-explicit-any': 'warn',
  // TypeScript
  'vue/attribute-hyphenation': 'off',
  'vue/multi-word-component-names': 'off',
  'vue/no-mutating-props': 'error',
  'vue/no-v-html': 'warn',
  // Generic
  'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
};

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...eslint.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: { eslint, stylistic },
    rules: customRules,
  }
);
