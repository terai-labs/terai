// Dependencies
import { debounce } from 'perfect-debounce'
import { extract } from '@rosetta.js/extractor'
import { loadConfig, runtime } from '@rosetta.js/node'
import { generate } from '@rosetta.js/generator'
import { logger } from '@rosetta.js/logger'

// Types
import type { CAC } from 'cac'

type ExtractOptions = {
  cwd: string
  force?: boolean
  silent?: boolean
  watch?: boolean
  outExtension?: string
}

export function extractCommand(cli: CAC, cwd: string) {
  cli
    .command('extract', "Initialize the Rosetta's extraction")
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('-w, --watch', 'Watch files and rebuild')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(async (options: ExtractOptions) => {
      if (options.silent) logger.level = 'silent'
      const done = logger.time.info('✨ Rosetta extraction')

      const config = await loadConfig(options)
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
      }
    })
}
