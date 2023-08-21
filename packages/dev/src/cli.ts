// Dependencies
import { cac } from 'cac'
import { debounce } from 'perfect-debounce'
import { extract } from '@rosetta.js/extractor'
import { generate } from '@rosetta.js/generator'
import { loadConfig, runtime, setupConfig } from '@rosetta.js/node'
import { logger } from '@rosetta.js/logger'
import pkg from '../package.json'
import updateNotifier from 'update-notifier'

// Types
import type { Config } from '@rosetta.js/types'

type InitOptions = Pick<Config, 'outExtension' | 'baseLocale'> & {
  cwd: string
  force?: boolean
  silent?: boolean
}

type ExtractOptions = {
  cwd: string
  force?: boolean
  silent?: boolean
  watch?: boolean
  outExtension?: string
}

export async function main() {
  updateNotifier({ pkg, distTag: 'latest' }).notify()

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

      logger.info('cli', `Rosetta v${pkg.version}\n`)
      const done = logger.time.info('✨ Rosetta initialized')

      await setupConfig(options)
      done()
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

      logger.info('cli:extract', `Rosetta v${pkg.version}\n`)

      const files = runtime.fs.glob({
        ...config,
        cwd: options.cwd
      })

      const messages = await extract(files)
      await generate(messages, {
        ...config,
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

            const messages = await extract(files)
            await generate(messages, {
              ...config,
              cwd: options.cwd
            })

            logger.info('cli:extract', 'translation files rebuilt ✅')
          })
        )

        // const contentWatcher = ctx.runtime.fs.watch(ctx.config)
        // contentWatcher.on(
        //   'all',
        //   debounce(async (event, file) => {
        //     logger.info(`file:${event}`, file)
        //     if (event === 'unlink') {
        //       ctx.project.removeSourceFile(ctx.runtime.path.abs(cwd, file))
        //     } else if (event === 'change') {
        //       ctx.project.reloadSourceFile(file)
        //       await cssgen(ctx)
        //     } else if (event === 'add') {
        //       ctx.project.createSourceFile(file)
        //       await cssgen(ctx)
        //     }
        //   })
        // )

        // logger.info('ctx:watch', ctx.messages.watch())
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
