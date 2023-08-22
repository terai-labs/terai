import { defineConfig } from '@rosetta.js/dev'

export default defineConfig({
  // Where to look for your locale declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // The base locale used in your project
  projectLocale: 'en',

  // The output directory for your locale system
  outDir: './public/locale',

  // The output directory for your locale system
  outLocales: ['de', 'da_DK'],

  // The extension for the emitted JavaScript files
  outExtension: '.js'
})
