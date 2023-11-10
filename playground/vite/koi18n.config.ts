import { defineConfig, createGoogleCloudTranslator } from '@koi18n/dev'

const translator = createGoogleCloudTranslator()

export default defineConfig({
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  projectLocale: 'en',
  outDir: './public/locale',
  outLocales: ['es', 'it'],
  translator
})
