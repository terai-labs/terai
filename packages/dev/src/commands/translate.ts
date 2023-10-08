// Dependencies
import { generate } from '@koi18n/generator'
import { loadConfig, runtime } from '@koi18n/runtime'
import { logger } from '@koi18n/logger'
import { translate } from '@koi18n/translator'
import { merge, stringify, groupDictionaryByChunks } from '@koi18n/utils'

// Types
import type { CAC } from 'cac'
import type { Dictionary, BuildManifest } from '@koi18n/types'

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
  const tmuDirPath = runtime.path.resolve(cwd, config.outDir, '.koi18n')
  const manifestPath = runtime.path.resolve(tmuDirPath, 'build-manifest.json')
  const existsManifest = runtime.fs.exists(manifestPath)
  if (!existsManifest) {
    return logger.error(
      'translate',
      `No build-manifest.json found in ${tmuDirPath}. Please run "extract" first.`
    )
  }

  const buildManifest = JSON.parse(
    runtime.fs.readFile(manifestPath)
  ) as BuildManifest

  let totalTranslatedMsgs = 0
  let totalCachedMsgs = 0

  await Promise.all(
    config.locales.map(async locale => {
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

        for (const id in buildManifest.messages) {
          const { value, chunksIds } = buildManifest.messages[id]
          const chnks = chunksIds.length ? chunksIds : [locale]

          for (const chunkId of chnks) {
            const chunkPath = runtime.path.resolve(
              localeDirPath,
              `${chunkId}.json`
            )
            const existsChunk = runtime.fs.exists(chunkPath)
            const chunk: Dictionary = existsChunk
              ? JSON.parse(runtime.fs.readFile(chunkPath))
              : {}
            const localeValue = chunk[id] ?? cache[id]

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
