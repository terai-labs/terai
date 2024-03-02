import { defineConfig, createChatGptTranslator } from '@terai/dev'

// const translator = createChatGptTranslator({
// 	apiKey: process.env.OPENAI_API_KEY
// })

export default defineConfig({
	include: ['./src/**/*.{js,jsx,ts,tsx}'],
	exclude: [],
	projectLocale: 'en',
	outDir: './locale-system',
	outLocales: ['es', 'it']
	// translator
})
