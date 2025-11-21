export type StudioMessage = {
	id: string
	value: string
	files: string[]
	context: string
	chunks: string[]
	translations: Record<string, string>
}

export type TranslationStats = {
	total: number
	translated: number
	missing: number
	percentage: number
}

export type StudioData = {
	projectLocale: string
	outLocales: string[]
	messages: StudioMessage[]
	stats: {
		totalMessages: number
		totalTranslations: number
		missingTranslations: number
		coveragePercentage: number
		byLocale: Record<string, TranslationStats>
	}
}
