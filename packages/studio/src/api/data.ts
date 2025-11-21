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

export type StudioData = {
	projectLocale: string
	outLocales: string[]
	messages: StudioMessage[]
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

	// Load manifest
	const manifest = JSON.parse(
		runtime.fs.readFile(manifestPath)
	) as BuildManifest

	// Get all locales (projectLocale + outLocales)
	const allLocales = [
		config.projectLocale,
		...config.outLocales.filter((l) => l !== config.projectLocale)
	]

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

	return {
		projectLocale: config.projectLocale,
		outLocales: config.outLocales,
		messages
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
		const defaultChunkPath = runtime.path.resolve(
			localeDirPath,
			`${locale}.json`
		)
		if (runtime.fs.exists(defaultChunkPath)) {
			try {
				const chunkData = JSON.parse(
					runtime.fs.readFile(defaultChunkPath)
				) as Dictionary
				Object.assign(translations, chunkData)
			} catch {
				// Skip invalid JSON
			}
		}

		// Load all named chunks
		for (const chunkId of allChunkIds) {
			if (chunkId === 'default') continue
			const chunkPath = runtime.path.resolve(localeDirPath, `${chunkId}.json`)
			if (runtime.fs.exists(chunkPath)) {
				try {
					const chunkData = JSON.parse(
						runtime.fs.readFile(chunkPath)
					) as Dictionary
					Object.assign(translations, chunkData)
				} catch {
					// Skip invalid JSON
				}
			}
		}

		result[locale] = translations
	}

	return result
}

function getTranslationsForMessage(
	messageId: string,
	locales: string[],
	localeTranslations: Record<string, Dictionary>
): Record<string, string> {
	const result: Record<string, string> = {}

	for (const locale of locales) {
		const translations = localeTranslations[locale]
		if (translations?.[messageId]) {
			result[locale] = translations[messageId]
		} else {
			result[locale] = ''
		}
	}

	return result
}
