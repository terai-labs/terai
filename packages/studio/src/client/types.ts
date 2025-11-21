export type StudioMessage = {
	id: string
	value: string
	files: string[]
	context: string
	chunks: string[]
	translations: Record<string, string>
}

export type StudioData = {
	projectLocale: string
	outLocales: string[]
	messages: StudioMessage[]
}
