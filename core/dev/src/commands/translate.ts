// Dependencies
import { generate } from '@rewordlabs/generator'
import { loadConfig, runtime } from '@rewordlabs/runtime'
import { logger } from '@rewordlabs/logger'
import { mergeDictionaries } from '@rewordlabs/utils'
import { translate } from '@rewordlabs/translator'

// Types
import type { CAC } from 'cac'
import type { Dictionary, BuildManifest } from '@rewordlabs/types'

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
    `Translating using ${logger.colors.white(config.translationService)}`
  )
  logger.info(`Scan:`, `Looking for untranslated messages...`)

  const buildManifest = runtime.fs.readFile(
    runtime.path.resolve(options.cwd, config.outDir, 'build-manifest.json')
  )

  const { messages } = JSON.parse(buildManifest) as BuildManifest

  let totalTranslatedMsgs = 0

  await Promise.all(
    config.locales.map(async locale => {
      try {
        const msgsToTranslate: string[] = []
        const untranslatedDictionary: Dictionary = {}
        const translatedDictionary: Dictionary = {}

        const localeFolderPath = runtime.path.resolve(
          options.cwd,
          config.outDir,
          locale
        )

        for (const msgId in messages) {
          const { chunkId } = messages[msgId]
          const chunkPath = runtime.path.resolve(
            localeFolderPath,
            `${chunkId}.json`
          )

          if (runtime.fs.exists(chunkPath)) {
            const chunk = runtime.fs.readFile(chunkPath)
            const chunkMessages = JSON.parse(chunk) as Dictionary

            if (!chunkMessages[msgId]) {
              totalTranslatedMsgs++
              msgsToTranslate.push(msgId)
              untranslatedDictionary[chunkId] = {
                // @ts-ignore
                ...(untranslatedDictionary[chunkId] ?? {}),
                [msgId]: messages[msgId].value
              }
            } else {
              translatedDictionary[chunkId] = {
                // @ts-ignore
                ...(translatedDictionary[chunkId] ?? {}),
                [msgId]: chunkMessages[msgId]
              }
            }
          } else {
            totalTranslatedMsgs++
            msgsToTranslate.push(msgId)
            untranslatedDictionary[chunkId] = {
              // @ts-ignore
              ...(untranslatedDictionary[chunkId] ?? {}),
              [msgId]: messages[msgId].value
            }
          }
        }

        if (!msgsToTranslate.length) return

        logger.info(
          `${locale.toUpperCase()} Translator:`,
          `Translating ${msgsToTranslate.length} messages...`
        )

        const dictionary = await translate({
          ...config,
          dictionary: untranslatedDictionary,
          locale
        })

        await generate({
          ...config,
          dictionary: mergeDictionaries(translatedDictionary, dictionary),
          locale,
          cwd: options.cwd
        })
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
    return done('No messages translated, everything is up to date')
  }

  done(`Translated ${totalTranslatedMsgs} messages`)
}
