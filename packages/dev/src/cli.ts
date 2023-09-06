// Dependencies
import { cac } from 'cac'
import { extract } from '@rewordlabs/extractor'
import { generate } from '@rewordlabs/generator'
import { loadConfig, runtime, setupConfig } from '@rewordlabs/node'
import { logger } from '@rewordlabs/logger'
import { outdent } from 'outdent'
import updateNotifier from 'update-notifier'
import { input } from '@inquirer/prompts'

// Types
import type { ExtractOptions, InitOptions } from './types'

import pkg from '../package.json'
import type { Locale } from '@rewordlabs/types'
import { debounce } from 'perfect-debounce'

export async function main() {
  updateNotifier({ pkg, distTag: 'latest' }).notify()
  logger.info('cli', `Reword v${pkg.version}\n`)

  const cwd = runtime.cwd()
  const cli = cac('reword')

  cli
    .command('init', "Initialize Reword's config file")
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

      const done = logger.time.info('🔥 Reword initialized')
      await setupConfig({ ...options, projectLocale, locales, outDir })

      done()

      logger.log(outdent`
      Thanks for choosing Reword.
      🚀 You are set up to start using it!
    `)
    })

  cli
    .command('extract', "Initialize Reword's extraction")
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('-w, --watch', 'Watch files and rebuild')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(async (options: ExtractOptions) => {
      if (options.silent) logger.level = 'silent'
      const done = logger.time.info('✨ Reword extraction')

      const config = await loadConfig(options)
      const filesPaths = runtime.fs.glob({
        ...config,
        cwd: options.cwd
      })

      async function extractor() {
        const extractedMessages = await extract({
          ...config,
          filesPaths,
          cwd: options.cwd
        })

        runtime.fs.remove(
          runtime.path.resolve(cwd, config.outDir, config.projectLocale)
        )

        await generate({
          ...config,
          locale: config.projectLocale,
          extractedMessages,
          cwd: options.cwd
        })

        runtime.fs.write(
          runtime.path.resolve(cwd, config.outDir, `build-manifest.json`),
          JSON.stringify({ messages: extractedMessages }, null, 2)
        )
      }

      logger.info('cli:extract', 'Extracting messages from project...')
      await extractor()

      logger.info('cli:extract', 'Extracted messages ✅')
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
            const done = logger.time.info('✨ Reword extraction')
            logger.info('cli:extract', 'Files changed, extracting messages...')
            await extractor()

            logger.info('cli:extract', 'Extracted messages ✅')
            done()
          })
        )
      }
    })

  // cli
  //   .command('translate', "Initialize Reword's translation")
  //   .option('-s, --silent', 'Suppress all messages except errors')
  //   .option('--cwd <cwd>', 'Current working directory', { default: cwd })
  //   .action(async (options: ExtractOptions) => {
  //     if (options.silent) logger.level = 'silent'
  //     const done = logger.time.info('✨ Reword translation')

  //     const config = await loadConfig(options)
  //     const dictionary = await runtime.import<Dictionary>({
  //       cwd: options.cwd,
  //       filePath: runtime.path.resolve(
  //         options.cwd,
  //         config.outDir,
  //         `${config.projectLocale}.json`
  //       )
  //     })

  //     logger.info('cli:translate', `Initializing translation...`)

  //     await Promise.all(
  //       config.locales.map(async locale => {
  //         const tMessages = await translate({
  //           ...config,
  //           locale,
  //           dictionary
  //         })

  //         await generate({
  //           ...config,
  //           locale,
  //           dictionary: tMessages,
  //           cwd: options.cwd
  //         })

  //         logger.info(
  //           'cli:translate',
  //           `Translated files for locale: ${locale} ✅`
  //         )
  //       })
  //     )

  //     done()
  //   })

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
