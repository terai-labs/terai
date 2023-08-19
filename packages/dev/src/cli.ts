// Dependencies
import { cac } from 'cac'
import { extract } from '@rosetta.js/extractor'
import { generate } from '@rosetta.js/generator'
import { loadConfig, runtime, setupConfig } from '@rosetta.js/node'
import { logger } from '@rosetta.js/logger'
import pkg from '../package.json'
import updateNotifier from 'update-notifier'
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
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(async (options: ExtractOptions) => {
      if (options.silent) logger.level = 'silent'
      const done = logger.time.info('✨ Rosetta extraction')

      const config = await loadConfig(options)

      logger.info('cli', `Rosetta v${pkg.version}\n`)

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
