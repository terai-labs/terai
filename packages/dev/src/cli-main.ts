import { logger } from '@rosseta/logger'
import { cac } from 'cac'
import { resolve } from 'pathe'
import updateNotifier from 'update-notifier'
import { name, version } from '../package.json'

export async function main() {
  updateNotifier({ pkg: { name, version }, distTag: 'latest' }).notify()

  const cli = cac('rosseta')
  const cwd = process.cwd()

  cli
    .command('init', "Initialize the rosseta's config file")
    .option('-f, --force', 'Force overwrite existing config file')
    .option('-c, --config <path>', 'Path to rosseta config file')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .option('--silent', 'Suppress all messages except errors')
    .option('--no-gitignore', "Don't update the .gitignore")
    .option('--out-extension <ext>', "The extension of the generated js files (default: 'mjs')")
    .option('--jsx-framework <framework>', 'The jsx framework to use')
    .action(
      async (
        flags:  {
          cwd?: string
          force?: boolean
          postcss?: boolean
          silent?: boolean
          config?: string
        } = {},
      ) => {
        const { silent } = flags

        const cwd = resolve(flags.cwd ?? '')

        if (silent) {
          logger.level = 'silent'
        }

        logger.info('cli', `Rosseta v${version}\n`)
        logger.info('cli', `Rosseta v${cwd}\n`)

        const done = logger.time.info('✨ Rosseta initialized')

        done()
      },
    )

 

  cli.help()

  cli.version(version)

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
