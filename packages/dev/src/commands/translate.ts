// Dependencies
import { generate } from '@terai/generator'
import { loadConfig, runtime } from '@terai/runtime'
import { logger } from '@terai/logger'
import { translate } from '@terai/translator'
import { merge, stringify, groupDictionaryByChunks } from '@terai/utils'

// Types
import type { CAC } from 'cac'
import type { Dictionary, BuildManifest } from '@terai/types'

export type TranslateOptions = {
	cwd: string
}

export function createTranslateCommand(cli: CAC, cwd: string) {
	return cli
		.command('translate', 'Translate messages from your project')
		.option('--cwd <cwd>', 'Current working directory', { default: cwd })
		.action(translateCmd)
}

export async function translateCmd({ cwd }: TranslateOptions) {
	logger.heading('translate', 'Translate messages from your project')
	const done = logger.time.success()

	const config = await loadConfig({ cwd })

	const outDirPath = runtime.path.resolve(cwd, config.outDir)
	const tmuDirPath = runtime.path.resolve(cwd, config.outDir, '.terai')
	const manifestPath = runtime.path.resolve(tmuDirPath, 'locale-manifest.json')
	const existsManifest = runtime.fs.exists(manifestPath)
	if (!existsManifest) {
		return logger.error(
			'translate',
			`No locale-manifest.json found in ${tmuDirPath}. Please run "extract" first.`
		)
	}

	const buildManifest = JSON.parse(
		runtime.fs.readFile(manifestPath)
	) as BuildManifest

	let totalTranslatedMsgs = 0
	let totalCachedMsgs = 0

	await Promise.all(
		config.outLocales.map(async (locale) => {
			try {
				let translatedDictionary: Dictionary = {}
				const untranslatedDictionary: Dictionary = {}
				const localeDirPath = runtime.path.resolve(outDirPath, locale)
				const localeCachePath = runtime.path.resolve(
					tmuDirPath,
					'cache',
					`${locale}.cache.json`
				)
				const cacheExists = runtime.fs.exists(localeCachePath)
				let cache: Dictionary = cacheExists
					? JSON.parse(runtime.fs.readFile(localeCachePath))
					: {}

				let localeCachedMsgs = 0
				let localeTranslatedMsgs = 0

				// Parse each chunk file once per locale: re-reading it for every
				// message made this loop O(messages × chunk size).
				const chunks = new Map<string, Dictionary>()
				const readChunk = (chunkId: string): Dictionary => {
					const cached = chunks.get(chunkId)
					if (cached) return cached

					const chunkPath = runtime.path.resolve(
						localeDirPath,
						`${chunkId}.json`
					)
					const chunk: Dictionary = runtime.fs.exists(chunkPath)
						? JSON.parse(runtime.fs.readFile(chunkPath))
						: {}
					chunks.set(chunkId, chunk)
					return chunk
				}

				for (const id in buildManifest.messages) {
					const { value, chunksIds } = buildManifest.messages[id]
					// `chunksIds` holds one entry per file the message appears in.
					const chnks = new Set(chunksIds.length ? chunksIds : [locale])

					for (const chunkId of chnks) {
						const localeValue = readChunk(chunkId)[id] ?? cache[id]

						if (!localeValue) {
							untranslatedDictionary[id] = value
							localeTranslatedMsgs++
						} else {
							translatedDictionary[id] = localeValue
							// Update cache in case local value is different
							cache[id] = localeValue
							localeCachedMsgs++
						}
					}
				}

				if (localeTranslatedMsgs > 0) {
					const translation = await translate({
						...config,
						dictionary: untranslatedDictionary,
						locale
					})

					translatedDictionary = merge(translation, translatedDictionary)
				}

				cache = {
					...cache,
					...translatedDictionary
				}

				runtime.fs.remove(localeDirPath)

				const dictionaries = groupDictionaryByChunks(
					translatedDictionary,
					buildManifest,
					locale
				)

				await generate({
					...config,
					dictionaries: dictionaries,
					locale,
					cwd
				})

				runtime.fs.write(localeCachePath, stringify(cache))

				totalTranslatedMsgs += localeTranslatedMsgs
				totalCachedMsgs += localeCachedMsgs

				logger.info(
					`Locale ${locale.toUpperCase()}:`,
					`${localeTranslatedMsgs} new messages translated, ${localeCachedMsgs} recovered from cache`
				)
			} catch (err) {
				if (err instanceof Error) {
					logger.error(
						`${locale} translation:`,
						`Error translating to ${locale}: ${err.message}\n`
					)
				}
			}
		})
	)

	if (!totalTranslatedMsgs) {
		return done('Everything up-to-date')
	}

	done(
		`Translated ${totalTranslatedMsgs} messages, ${totalCachedMsgs} read from cache`
	)
}
