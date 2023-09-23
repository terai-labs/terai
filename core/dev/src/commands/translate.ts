// Dependencies
import { generate } from '@rewordlabs/generator'
import { loadConfig, runtime } from '@rewordlabs/runtime'
import { logger } from '@rewordlabs/logger'
import { translate } from '@rewordlabs/translator'
import { merge, stringify } from '@rewordlabs/utils'

// Types
import { type CAC } from 'cac'
import type {
  Dictionary,
  BuildManifest,
  DictionaryCache,
  DictionaryPlain,
  DictionaryChunk
} from '@rewordlabs/types'

export type TranslateOptions = {
  cwd: string
  watch?: boolean
}

export function createTranslateCommand(cli: CAC, cwd: string) {
  return cli
    .command('translate', 'Translate messages from your project')
    .option('-w, --watch', 'Watch files and rebuild')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(translateCmd)
}

export async function translateCmd(options: TranslateOptions) {
  logger.heading('translate', 'Translate messages from your project')
  const done = logger.time.success()

  const config = await loadConfig(options)

  logger.info(
    `Provider:`,
    `Translating using ${logger.colors.white(config.translationService)}...`
  )

  const outDirPath = runtime.path.resolve(options.cwd, config.outDir)
  const tmuDirPath = runtime.path.resolve(options.cwd, config.outDir, '.tmu')
  const buildManifest = runtime.fs.readFile(
    runtime.path.resolve(tmuDirPath, 'build-manifest.json')
  )

  const { messages } = JSON.parse(buildManifest) as BuildManifest

  let totalTranslatedMsgs = 0

  await Promise.all(
    config.locales.map(async locale => {
      try {
        const idsToTranslate: string[] = []
        const outDictionary: Dictionary = {}
        const localeJson: DictionaryPlain = {}
        const untranslatedMessages: DictionaryPlain = {}
        let translatedMessages: DictionaryPlain = {}
        const localeDirPath = runtime.path.resolve(outDirPath, locale)
        const localeCachePath = runtime.path.resolve(
          tmuDirPath,
          'cache',
          `${locale}.cache.json`
        )
        const cacheExists = runtime.fs.exists(localeCachePath)
        const cache: DictionaryCache = JSON.parse(
          cacheExists ? runtime.fs.readFile(localeCachePath) : '{}'
        )

        let totalCacheMsgs = 0

        for (const id in messages) {
          const { value, chunkId } = messages[id]
          const chunkPath = runtime.path.resolve(
            localeDirPath,
            `${chunkId}.json`
          )
          const existsChunk = runtime.fs.exists(chunkPath)
          const chunk: DictionaryChunk = existsChunk
            ? JSON.parse(runtime.fs.readFile(chunkPath))
            : {}
          const localeValue = chunk[id] ?? cache[id]

          if (!localeValue) {
            untranslatedMessages[id] = value
            idsToTranslate.push(id)
            totalTranslatedMsgs++
          } else {
            translatedMessages[id] = localeValue
            // Update cache in case local value is different
            cache[id] = localeValue
            totalCacheMsgs++
          }
        }

        if (idsToTranslate.length > 0) {
          const translation = await translate({
            ...config,
            dictionary: untranslatedMessages,
            locale
          })

          translatedMessages = merge(translation, translatedMessages)
        }

        for (const id in messages) {
          const { chunkId } = messages[id]
          const stringOrChunk = outDictionary[chunkId]
          const isChunk = typeof stringOrChunk !== 'string'

          if (isChunk) {
            outDictionary[chunkId] = {
              ...stringOrChunk,
              [id]: translatedMessages[id]
            }
          } else {
            outDictionary[chunkId] = translatedMessages[id]
          }

          localeJson[id] = translatedMessages[id]
        }

        runtime.fs.remove(localeDirPath)

        await generate({
          ...config,
          dictionary: outDictionary,
          locale,
          cwd: options.cwd
        })

        runtime.fs.write(localeCachePath, stringify(cache))
        runtime.fs.write(
          runtime.path.resolve(localeDirPath, `${locale}.json`),
          stringify(localeJson)
        )

        logger.info(
          `Locale ${locale.toUpperCase()}:`,
          `${idsToTranslate.length} new messages translated, ${totalCacheMsgs} recovered from cache`
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

  done(`Translated ${totalTranslatedMsgs} messages`)
}
