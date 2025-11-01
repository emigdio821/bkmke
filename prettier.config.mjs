/** @type {import("prettier").Options} */
/**  @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */

export default {
  semi: false,
  tabWidth: 2,
  printWidth: 120,
  singleQuote: true,
  endOfLine: 'lf',
  bracketSpacing: true,
  trailingComma: 'all',
  tailwindFunctions: ['cva', 'cn'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrder: ['<TYPES>', '<TYPES>^[.]', '<BUILTIN_MODULES>', '<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  importOrderTypeScriptVersion: '5.0.0',
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
}
