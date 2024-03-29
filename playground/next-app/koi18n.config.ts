import { defineConfig, createChatGptTranslator } from '@terai/dev'

const translator = createChatGptTranslator()

export default defineConfig({
	include: ['./src/**/*.{js,jsx,ts,tsx}'],
	exclude: [],
	projectLocale: 'en',
	outDir: './src/locale',
	outLocales: ['es'],
	translator
})
