// Dependencies
import { cac } from 'cac'
import { runtime } from '@rewordlabs/runtime'
import { logger } from '@rewordlabs/logger'
import updateNotifier from 'update-notifier'
import pkg from '../package.json'
import { createExtractCommand, createInitCommand } from './commands'

export async function main() {
  updateNotifier({ pkg, distTag: 'latest' }).notify()
  logger.info('cli', `Reword v${pkg.version}\n`)

  const cwd = runtime.cwd()
  const cli = cac('reword')

  createInitCommand(cli, cwd)
  createExtractCommand(cli, cwd)

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
