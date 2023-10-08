import { defineConfig, createChatGptTranslator } from '@koi18n/dev'

const translator = createChatGptTranslator({
  apiKey: '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'
})

export default defineConfig({
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  projectLocale: 'en',
  outDir: './src/locale',
  locales: ['es'],
  translator
})
