// Dependencies
import { cac } from 'cac'
import { runtime } from '@rosetta.js/node'
import { logger } from '@rosetta.js/logger'
import updateNotifier from 'update-notifier'

// Commands
import { extractCommand, initCommand } from './commands'

import pkg from '../package.json'

export async function main() {
  updateNotifier({ pkg, distTag: 'latest' }).notify()
  logger.info('cli', `Rosetta v${pkg.version}\n`)

  const cwd = runtime.cwd()
  const cli = cac('rosetta')

  initCommand(cli, cwd)
  extractCommand(cli, cwd)

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
