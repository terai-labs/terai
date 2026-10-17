import { defineConfig, createAiTranslator } from '@terai/dev'
import { createGroq } from '@ai-sdk/groq'

const groq = createGroq({
	apiKey: process.env.GROQ_API_KEY
})

const model = groq('openai/gpt-oss-120b')

const aiTranslator = createAiTranslator({
	model
})

export default defineConfig({
	include: ['./src/**/*.{js,jsx,ts,tsx}'],
	exclude: [],
	projectLocale: 'en-US',
	outDir: './locale',
	outLocales: ['en-US', 'es-ES'],
	translator: aiTranslator
})
