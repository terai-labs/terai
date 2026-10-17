// Dependencies
import { generate } from '@terai/generator'
import { loadConfig, runtime } from '@terai/runtime'
import { logger } from '@terai/logger'
import { translateDictionary } from '@terai/translator'
import {
	stringify,
	groupDictionaryByChunks,
	resolveLocaleDictionary
} from '@terai/utils'

// Types
import type { CAC } from 'cac'
import type { Dictionary, BuildManifest, Locale } from '@terai/types'

export type TranslateOptions = {
	cwd: string
}

type LocaleFailure = {
	locale: Locale
	reason: string
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
		process.exitCode = 1
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
	const failures: LocaleFailure[] = []

	await Promise.all(
		config.outLocales.map(async (locale) => {
			try {
				const localeDirPath = runtime.path.resolve(outDirPath, locale)
				const localeCachePath = runtime.path.resolve(
					tmuDirPath,
					'cache',
					`${locale}.cache.json`
				)
				const cache: Dictionary = runtime.fs.exists(localeCachePath)
					? JSON.parse(runtime.fs.readFile(localeCachePath))
					: {}

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

				const { translated, untranslated } = resolveLocaleDictionary({
					manifest: buildManifest,
					locale,
					cache,
					readChunk
				})
				const localeCachedMsgs = Object.keys(translated).length
				const untranslatedMsgs = Object.keys(untranslated).length
				let localeTranslatedMsgs = 0
				const problems: string[] = []

				if (untranslatedMsgs > 0) {
					const result = await translateDictionary({
						...config,
						dictionary: untranslated,
						locale
					})

					Object.assign(translated, result.dictionary)
					localeTranslatedMsgs = Object.keys(result.dictionary).length

					if (result.failed.length) {
						const reasons = result.errors.map(describeError).join('; ')
						problems.push(
							`${result.failed.length} messages failed to translate (${reasons})`
						)
					}
					if (result.missing.length) {
						problems.push(
							`${result.missing.length} messages missing from the translator response (${result.missing.slice(0, 5).join(', ')}${result.missing.length > 5 ? ', …' : ''})`
						)
					}
				}

				// Save what was translated before touching the locale files, so a
				// later failure never throws away paid-for translations.
				runtime.fs.write(
					localeCachePath,
					stringify({ ...cache, ...translated })
				)

				runtime.fs.remove(localeDirPath)

				await generate({
					...config,
					dictionaries: groupDictionaryByChunks(
						translated,
						buildManifest,
						locale
					),
					locale,
					cwd
				})

				totalTranslatedMsgs += localeTranslatedMsgs
				totalCachedMsgs += localeCachedMsgs

				logger.info(
					`Locale ${locale.toUpperCase()}:`,
					`${localeTranslatedMsgs} new messages translated, ${localeCachedMsgs} recovered from cache`
				)

				if (problems.length) {
					const reason = problems.join(', ')
					failures.push({ locale, reason })
					logger.error(`${locale} translation:`, reason)
				}
			} catch (err) {
				const reason = describeError(err)
				failures.push({ locale, reason })
				logger.error(
					`${locale} translation:`,
					`Error translating to ${locale}: ${reason}\n`
				)
			}
		})
	)

	if (failures.length) {
		process.exitCode = 1
		return logger.error(
			'translate',
			`Translation incomplete for ${failures.length}/${config.outLocales.length} locales (${failures.map((f) => f.locale).join(', ')}). Translated ${totalTranslatedMsgs} messages; run "translate" again to retry the rest.`
		)
	}

	if (!totalTranslatedMsgs) {
		return done('Everything up-to-date')
	}

	done(
		`Translated ${totalTranslatedMsgs} messages, ${totalCachedMsgs} read from cache`
	)
}

function describeError(err: unknown): string {
	if (!(err instanceof Error)) return String(err)
	// Surface the root cause of wrapped errors, e.g. `new Error(msg, { cause })`
	return err.cause ? `${err.message}: ${describeError(err.cause)}` : err.message
}
