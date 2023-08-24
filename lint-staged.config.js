const fn = exec => files => files.map(file => `'${exec} ${file}'`).join(' ')

const lint = fn('lint:check')
const format = fn('format:check')
const types = fn('types:check')

module.exports = {
  '*.{ts,tsx}': files => `pnpm ${lint(files)} ${format(files)} ${types(files)}`,
  '*.{json,md,css,graphql}': files => `pnpm ${lint(files)} ${format(files)}`
}
