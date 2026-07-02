import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript', 'unicorn', 'oxc', 'react', 'react-perf'],
  rules: {
    'object-shorthand': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/consistent-type-imports': 'error',
  },
  categories: {
    correctness: 'error',
  },
  env: {
    builtin: true,
  },
  options: {
    typeAware: true,
    typeCheck: true,
  },
})
