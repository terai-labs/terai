import { loadConfig, runtime } from '@terai/runtime'
import type { BuildManifest, Dictionary } from '@terai/types'

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

export type GetStudioDataOptions = {
	cwd: string
}

export async function getStudioData(
	options: GetStudioDataOptions
): Promise<StudioData> {
	const config = await loadConfig(options)
	const outDirPath = runtime.path.resolve(options.cwd, config.outDir)
	const manifestPath = runtime.path.resolve(
		outDirPath,
		'.terai',
		'locale-manifest.json'
	)

	// Check if manifest exists
	if (!runtime.fs.exists(manifestPath)) {
		throw new Error(
			`No locale-manifest.json found in ${outDirPath}/.terai. Please run "terai extract" first.`
		)
	}

	// Load and validate manifest
	let manifest: BuildManifest
	try {
		const manifestContent = runtime.fs.readFile(manifestPath)
		manifest = JSON.parse(manifestContent) as BuildManifest

		if (!manifest.messages || typeof manifest.messages !== 'object') {
			throw new Error('Invalid manifest format: missing messages object')
		}
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new Error(`Invalid JSON in locale-manifest.json: ${error.message}`)
		}
		throw error
	}

	// Get all locales (projectLocale + outLocales, deduplicated)
	const targetLocales = config.outLocales.filter(
		(l) => l !== config.projectLocale
	)
	const allLocales = [config.projectLocale, ...targetLocales]

	// Load translations for all locales
	const localeTranslations = loadAllLocaleTranslations(
		outDirPath,
		allLocales,
		manifest
	)

	// Build messages array
	const messages: StudioMessage[] = Object.values(manifest.messages).map(
		(msg) => ({
			id: msg.id,
			value: msg.value,
			files: msg.files,
			context: msg.context,
			chunks: msg.chunksIds,
			translations: getTranslationsForMessage(
				msg.id,
				allLocales,
				localeTranslations
			)
		})
	)

	// Calculate stats
	const stats = calculateStats(messages, targetLocales)

	return {
		projectLocale: config.projectLocale,
		outLocales: config.outLocales,
		messages,
		stats
	}
}

function calculateStats(
	messages: StudioMessage[],
	targetLocales: string[]
): StudioData['stats'] {
	const totalMessages = messages.length
	const byLocale: Record<string, TranslationStats> = {}

	let totalTranslations = 0
	let missingTranslations = 0

	for (const locale of targetLocales) {
		let translated = 0
		let missing = 0

		for (const msg of messages) {
			if (msg.translations[locale]) {
				translated++
				totalTranslations++
			} else {
				missing++
				missingTranslations++
			}
		}

		const percentage =
			totalMessages > 0 ? Math.round((translated / totalMessages) * 100) : 0

		byLocale[locale] = {
			total: totalMessages,
			translated,
			missing,
			percentage
		}
	}

	const expectedTotal = totalMessages * targetLocales.length
	const coveragePercentage =
		expectedTotal > 0
			? Math.round((totalTranslations / expectedTotal) * 100)
			: 100

	return {
		totalMessages,
		totalTranslations,
		missingTranslations,
		coveragePercentage,
		byLocale
	}
}

function loadAllLocaleTranslations(
	outDirPath: string,
	locales: string[],
	manifest: BuildManifest
): Record<string, Dictionary> {
	const result: Record<string, Dictionary> = {}

	// Get all unique chunk IDs from manifest
	const allChunkIds = new Set<string>()
	for (const msg of Object.values(manifest.messages)) {
		for (const id of msg.chunksIds) {
			allChunkIds.add(id)
		}
	}

	for (const locale of locales) {
		const localeDirPath = runtime.path.resolve(outDirPath, locale)
		const translations: Dictionary = {}

		// Check if locale directory exists
		if (!runtime.fs.exists(localeDirPath)) {
			result[locale] = translations
			continue
		}

		// Load default chunk (named after locale)
		loadChunkFile(
			runtime.path.resolve(localeDirPath, `${locale}.json`),
			translations
		)

		// Load all named chunks
		for (const chunkId of allChunkIds) {
			if (chunkId === 'default') continue
			loadChunkFile(
				runtime.path.resolve(localeDirPath, `${chunkId}.json`),
				translations
			)
		}

		result[locale] = translations
	}

	return result
}

function loadChunkFile(chunkPath: string, target: Dictionary): void {
	if (!runtime.fs.exists(chunkPath)) return

	try {
		const content = runtime.fs.readFile(chunkPath)
		const chunkData = JSON.parse(content) as Dictionary

		// Validate that it's an object with string values
		if (typeof chunkData === 'object' && chunkData !== null) {
			for (const [key, value] of Object.entries(chunkData)) {
				if (typeof value === 'string') {
					target[key] = value
				}
			}
		}
	} catch {
		// Skip invalid JSON files silently
	}
}

function getTranslationsForMessage(
	messageId: string,
	locales: string[],
	localeTranslations: Record<string, Dictionary>
): Record<string, string> {
	const result: Record<string, string> = {}

	for (const locale of locales) {
		const translations = localeTranslations[locale]
		result[locale] = translations?.[messageId] || ''
	}

	return result
}
