// Dependencies
import { logger } from '@rewordlabs/logger'
import { translate } from '@rewordlabs/translator'
import { loadConfig, runtime } from '@rewordlabs/runtime'

// Types
import type { CAC } from 'cac'
import type { Dictionary } from '@rewordlabs/types'
import { generate } from '@rewordlabs/generator'

export type TranslateOptions = {
  cwd: string
  force?: boolean
  silent?: boolean
  watch?: boolean
}

export function createTranslateCommand(cli: CAC, cwd: string) {
  return cli
    .command('translate', "Initialize Reword's translation")
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('-w, --watch', 'Watch files and rebuild')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(translateCmd)
}

export async function translateCmd(options: TranslateOptions) {
  if (options.silent) logger.level = 'silent'
  const done = logger.time.info('✨ Reword translation')

  const config = await loadConfig(options)
  const buildManifest = runtime.fs.readFile(
    runtime.path.resolve(options.cwd, config.outDir, 'build-manifest.json')
  )

  const { messages } = JSON.parse(buildManifest)
  let totalMessagesTranslated = 0

  await Promise.all(
    config.locales.map(async locale => {
      try {
        const untranslatedKeys: string[] = []
        const untranslatedDictionary: Dictionary = {}
        const localeFolderPath = runtime.path.resolve(
          options.cwd,
          config.outDir,
          locale
        )

        for (const messageKey in messages) {
          const messagePath = runtime.path.resolve(
            localeFolderPath,
            `${messageKey}.json`
          )

          if (!runtime.fs.exists(messagePath)) {
            untranslatedKeys.push(messageKey)
            untranslatedDictionary[messageKey] = messages[messageKey].value
            totalMessagesTranslated++
          }
        }

        if (!untranslatedKeys.length) return

        logger.info(
          'cli:translate',
          `Translating the following keys to ${locale}:\n${untranslatedKeys.join(
            ', '
          )}`
        )

        const dictionary = await translate({
          dictionary: untranslatedDictionary,
          projectLocale: config.projectLocale,
          locale,
          openaiApiKey: config.openaiApiKey
        })

        await generate({
          ...config,
          dictionary,
          locale,
          cwd: options.cwd
        })
      } catch (err) {
        logger.info('cli:translate', `Error translating to ${locale} ❌`)
      }
    })
  )

  if (totalMessagesTranslated > 0) {
    logger.info('cli:translate', 'Translated messages ✅')
    done()
  } else {
    logger.info(
      'cli:translate',
      'No messages translated, everything is up to date ✅'
    )
  }
}
