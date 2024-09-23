import eslintConfigLove from 'eslint-config-love'
import prettierConfig from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  eslintConfigLove,
  jsxA11y.flatConfigs.recommended,
  prettierConfig,
  {
    ignores: [
      '.next',
      'build',
      'components/ui',
      'next.config.mjs',
      'eslint.config.mjs',
      'postcss.config.mjs',
      'types/database.*.*',
      'prettier.config.mjs',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      ...reactHooks.configs.recommended.rules,
    },
  },
]
