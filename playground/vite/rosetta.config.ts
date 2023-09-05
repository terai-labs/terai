import { defineConfig } from '@rewordlabs/dev'

export default defineConfig({
  // Where to look for your locale declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // The base locale used in your project
  projectLocale: 'en',

  // The output directory for your locale system
  outDir: './locale',

  // The output locales
  locales: ['de', 'it'],

  // Your OpenAI API key
  openaiApiKey: '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'
})
