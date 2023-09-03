// Dependencies
import { cac } from 'cac'
import { debounce } from 'perfect-debounce'
import { extract } from '@rosetta.js/extractor'
import { generate } from '@rosetta.js/generator'
import { translate } from '@rosetta.js/translator'
import { loadConfig, runtime, setupConfig } from '@rosetta.js/node'
import { logger } from '@rosetta.js/logger'
import { outdent } from 'outdent'
import { toPlainDictionary } from '@rosetta.js/utils'
import updateNotifier from 'update-notifier'
import { input } from '@inquirer/prompts'

// Types
import type { ExtractOptions, InitOptions } from './types'

import pkg from '../package.json'
import type { Dictionary, Locale } from '@rosetta.js/types'

export async function main() {
  updateNotifier({ pkg, distTag: 'latest' }).notify()
  logger.info('cli', `Rosetta v${pkg.version}\n`)

  const cwd = runtime.cwd()
  const cli = cac('rosetta')

  cli
    .command('init', "Initialize Rosetta's config file")
    .option('-f, --force', 'Force overwrite existing config file')
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(async (options: InitOptions) => {
      const projectLocale = (await input({
        message: 'What locale do you use for development?',
        default: 'en'
      })) as Locale
      const locales = (await input({
        message: 'What locales will you be using? (e.g: fr,de)',
        default: ''
      }).then(res => res.replaceAll(' ', '').split(','))) as Locale[]
      const outDir = await input({
        message: 'Where do you want to place your generated files?',
        default: './locale'
      })

      logger.clear()

      if (options.silent) logger.level = 'silent'

      const done = logger.time.info('🔥 Rosetta initialized')
      await setupConfig({ ...options, projectLocale, locales, outDir })

      done()

      logger.log(outdent`
      ❤️ Thanks for choosing Rosetta.
      🚀 You are set up to start using it!
    `)
    })

  cli
    .command('extract', "Initialize Rosetta's extraction")
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('-w, --watch', 'Watch files and rebuild')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(async (options: ExtractOptions) => {
      if (options.silent) logger.level = 'silent'
      const done = logger.time.info('✨ Rosetta extraction')

      const config = await loadConfig(options)
      const filesPaths = runtime.fs.glob({
        ...config,
        cwd: options.cwd
      })
      const extractedMessages = await extract({ filesPaths })
      const dictionary = toPlainDictionary(extractedMessages)
      await generate({
        ...config,
        locale: config.projectLocale,
        dictionary,
        cwd: options.cwd
      })

      runtime.fs.write(
        runtime.path.resolve(cwd, config.outDir, `build-manifest.json`),
        JSON.stringify({ messages: extractedMessages }, null, 2)
      )

      done()

      if (options.watch) {
        logger.info('cli:extract', 'Watching files...')
        const configWatcher = runtime.fs.watch({
          ...config,
          ...options
        })

        configWatcher.on(
          'change',
          debounce(async () => {
            logger.info('cli:extract', 'Files changed, extracting messages...')

            const extractedMessages = await extract({ filesPaths })
            const dictionary = toPlainDictionary(extractedMessages)
            await generate({
              ...config,
              locale: config.projectLocale,
              dictionary,
              cwd: options.cwd
            })

            logger.info('cli:extract', 'Extracted messages ✅')
          })
        )
      }
    })

  cli
    .command('translate', "Initialize Rosetta's translation")
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(async (options: ExtractOptions) => {
      if (options.silent) logger.level = 'silent'
      const done = logger.time.info('✨ Rosetta translation')

      const config = await loadConfig(options)
      const dictionary = await runtime.import<Dictionary>({
        cwd: options.cwd,
        filePath: runtime.path.resolve(
          options.cwd,
          config.outDir,
          `${config.projectLocale}.json`
        )
      })

      logger.info('cli:translate', `Initializing translation...`)

      await Promise.all(
        config.locales.map(async locale => {
          const tMessages = await translate({
            ...config,
            locale,
            dictionary
          })

          await generate({
            ...config,
            locale,
            dictionary: tMessages,
            cwd: options.cwd
          })

          logger.info(
            'cli:translate',
            `Translated files for locale: ${locale} ✅`
          )
        })
      )

      done()
    })

  cli.help()
  cli.version(pkg.version)
  cli.parse(process.argv, { run: false })

  try {
    await cli.runMatchedCommand()
  } catch (error) {
    logger.error('cli', error)

    if (logger.isDebug) {
      console.error(error)
    }

    process.exit(1)
  }
}
