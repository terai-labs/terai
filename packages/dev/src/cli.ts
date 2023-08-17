// Dependencies
import { cac } from 'cac'
import { extract } from '@rosseta/extractor'
import { generate } from '@rosseta/generator'
import { loadConfig, runtime, setupConfig } from '@rosseta/node'
import { logger } from '@rosseta/logger'
import pkg from '../package.json'
import updateNotifier from 'update-notifier'

type InitOptions = {
  cwd: string
  force?: boolean
  silent?: boolean
  outExtension?: string
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
  const cli = cac('rosseta')

  cli
    .command('init', "Initialize the Rosseta's config file")
    .option('-f, --force', 'Force overwrite existing config file')
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .option(
      '--out-extension <ext>',
      "The extension of the generated files (default: 'ts')"
    )
    .action(async (options: InitOptions) => {
      if (options.silent) logger.level = 'silent'

      logger.info('cli', `Rosseta v${pkg.version}\n`)
      const done = logger.time.info('✨ Rosseta initialized')

      await setupConfig(options)
      done()
    })

  cli
    .command('extract', "Initialize the Rosseta's extraction")
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(async (options: ExtractOptions) => {
      if (options.silent) logger.level = 'silent'
      const done = logger.time.info('✨ Rosseta extraction')

      const config = await loadConfig(options)

      logger.info('cli', `Rosseta v${pkg.version}\n`)

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
