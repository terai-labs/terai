module.exports = {
  'packages/**/*': [
    'pnpm --reporter=silent lint:fix',
    'pnpm --reporter=silent format:fix'
  ],
  'packages/**/*.css': ['pnpm --reporter=silent styles:fix'],
  'packages/**/*.{ts,tsx}': "bash -c 'pnpm types:check'"
}
