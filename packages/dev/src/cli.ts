// Dependencies
import { cac } from 'cac'
import { extractAndWrite } from '@rosseta/extractor'
import { logger } from '@rosseta/logger'
import pkg from '../package.json'
import { resolve } from 'pathe'
import updateNotifier from 'update-notifier'

export async function main() {
  updateNotifier({ pkg, distTag: 'latest' }).notify()

  const cli = cac('rosseta')
  const cwd = process.cwd()

  cli
    .command('extract', "Initialize the rosseta's extraction")
    .action(async () => {
      const done = logger.time.info('✨ Rosseta extraction')
      const file = '/Users/hugocxl/repos/rosseta/test.tsx'

      logger.info('cli', `Rosseta v${pkg.version}\n`)
      logger.info('cli', `Rosseta v${cwd}\n`)

      extractAndWrite([file], {
        outFile: resolve(cwd, 'output.json')
        // extractSourceLocation: true
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
