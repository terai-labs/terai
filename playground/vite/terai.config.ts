import { defineConfig } from '@terai/dev'

export default defineConfig({
	include: ['./src/**/*.{js,jsx,ts,tsx}'],
	exclude: [],
	projectLocale: 'en',
	outDir: './locale-system',
	outLocales: ['es', 'it'],
	translator: () => {}
})
