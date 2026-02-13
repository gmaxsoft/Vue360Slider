/* eslint-env node */

const js = require('@eslint/js');
const vue = require('eslint-plugin-vue');

module.exports = [
  // Ignorowane katalogi (build i zależności)
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Główna konfiguracja dla plików źródłowych
  {
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      vue,
    },
    rules: {
      // Odpowiednik `extends: ['eslint:recommended']`
      ...js.configs.recommended.rules,

      // Odpowiednik `extends: ['plugin:vue/recommended']` dla Vue 2
      ...(vue.configs['vue2-recommended']
        ? vue.configs['vue2-recommended'].rules
        : vue.configs.recommended.rules),

      // Twoje własne reguły z `.eslintrc.cjs`
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
    },
  },
];

