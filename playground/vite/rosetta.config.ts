import { defineConfig } from '@rosetta.js/dev'

export default defineConfig({
  // Where to look for your locale declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Your openai API key
  openaiApiKey: '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',

  // The base locale used in your project
  projectLocale: 'en',

  // The output directory for your locale system
  outDir: 'locale',

  // The output locales
  outLocales: ['es'],

  // The extension for the emitted locale files
  outExtension: '.ts'
})
