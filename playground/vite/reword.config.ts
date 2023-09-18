import { defineConfig } from '@rewordlabs/dev'

export default defineConfig({
  // Where to look for your locale declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // The base locale used in your project
  projectLocale: 'en',

  // The output directory for your locale system
  outDir: './src/locale',

  // Your OpenAI API key
  openaiApiKey: process.env.OPENAI_API_KEY as string,

  locales: ['es', 'it']
})
