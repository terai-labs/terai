// Dependencies
import { cac } from 'cac'
import { debounce } from 'perfect-debounce'
import { extract } from '@rosetta.js/extractor'
import { generate } from '@rosetta.js/generator'
import { loadConfig, runtime, setupConfig } from '@rosetta.js/node'
import { logger } from '@rosetta.js/logger'
import { outdent } from 'outdent'
import { toPlainMessages } from '@rosetta.js/utils'
import updateNotifier from 'update-notifier'

// Types
import type { ExtractOptions, InitOptions } from './types'

import pkg from '../package.json'

export async function main() {
  updateNotifier({ pkg, distTag: 'latest' }).notify()
  logger.info('cli', `Rosetta v${pkg.version}\n`)

  const cwd = runtime.cwd()
  const cli = cac('rosetta')

  cli
    .command('init', "Initialize the Rosetta's config file")
    .option('-b, --base-locale', 'Base locale used in your project')
    .option('-f, --force', 'Force overwrite existing config file')
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .option(
      '--out-extension <ext>',
      "The extension of the generated files (default: 'ts')"
    )
    .action(async (options: InitOptions) => {
      if (options.silent) logger.level = 'silent'
      const done = logger.time.info('✨ Rosetta initialized')
      await setupConfig(options)

      done()

      logger.log(outdent`
      ❤️ Thanks for choosing Rosetta.
      🚀 You are set up to start using it!
    `)
    })

  cli
    .command('extract', "Initialize the Rosetta's extraction")
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
      const messages = toPlainMessages(extractedMessages)
      await generate({
        ...config,
        locale: config.projectLocale,
        messages,
        cwd: options.cwd
      })

      done()

      if (options.watch) {
        logger.info('cli:extract', 'watching files...')
        const configWatcher = runtime.fs.watch({
          ...config,
          ...options
          // poll
        })

        configWatcher.on(
          'change',
          debounce(async () => {
            logger.info('cli:extract', 'files changed, extracting messages...')

            const extractedMessages = await extract({ filesPaths })
            const messages = toPlainMessages(extractedMessages)
            await generate({
              ...config,
              locale: config.projectLocale,
              messages,
              cwd: options.cwd
            })

            logger.info('cli:extract', 'translation files rebuilt ✅')
          })
        )
      }
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
