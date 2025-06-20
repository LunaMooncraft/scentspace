import js from '@eslint/js';
import eslintPluginVue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';

const customRules = {
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
  ...eslintPluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: customRules,
  }
);
