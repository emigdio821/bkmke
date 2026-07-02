import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: ['**/src/routeTree.gen.ts'],
  tabWidth: 2,
  semi: false,
  useTabs: false,
  printWidth: 110,
  endOfLine: 'lf',
  singleQuote: true,
  sortImports: {
    newlinesBetween: false,
    groups: [
      'type-import',
      ['value-builtin', 'value-external'],
      'type-internal',
      'value-internal',
      ['type-parent', 'type-sibling', 'type-index'],
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown',
    ],
  },
  sortTailwindcss: {
    preserveWhitespace: false,
    stylesheet: './src/styles.css',
    functions: ['clsx', 'cva', 'tw', 'tw.*', 'cn'],
    attributes: ['className', 'iconClassName', 'class'],
  },
})
