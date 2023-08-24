// Dependencies
import { logger } from '@rosetta.js/logger'
import { setupConfig } from '@rosetta.js/node'
import { outdent } from 'outdent'

// Types
import type { Config } from '@rosetta.js/types'
import type { CAC } from 'cac'

type InitOptions = Pick<Config, 'outExtension' | 'projectLocale'> & {
  cwd: string
  force?: boolean
  silent?: boolean
}

export function initCommand(cli: CAC, cwd: string) {
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
}
