// Dependencies
import { debounce } from 'perfect-debounce'
import { extract } from '@rewordlabs/extractor'
import { generate } from '@rewordlabs/generator'
import { loadConfig, runtime } from '@rewordlabs/runtime'
import { logger } from '@rewordlabs/logger'
import { toPlainDictionary } from '@rewordlabs/utils'

// Types
import type { CAC } from 'cac'

export type ExtractOptions = {
  cwd: string
  force?: boolean
  silent?: boolean
  watch?: boolean
}

export function createExtractCommand(cli: CAC, cwd: string) {
  return cli
    .command('extract', 'Statically extract messages from your project')
    .option('-w, --watch', 'Watch files and rebuild')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(extractCmd)
}

export async function extractCmd(options: ExtractOptions) {
  logger.heading('extract', 'Statically extract messages from your project')
  const done = logger.time.success()

  const config = await loadConfig(options)
  const filesPaths = runtime.fs.glob({
    ...config,
    cwd: options.cwd
  })

  logger.info('Scan:', `Processing files...`)

  async function extractor() {
    const extractedMessages = await extract({
      ...config,
      filesPaths,
      cwd: options.cwd
    })
    const dictionary = toPlainDictionary(extractedMessages)

    runtime.fs.remove(
      runtime.path.resolve(options.cwd, config.outDir, config.projectLocale)
    )

    await generate({
      ...config,
      dictionary,
      locale: config.projectLocale,
      cwd: options.cwd
    })

    runtime.fs.write(
      runtime.path.resolve(options.cwd, config.outDir, `build-manifest.json`),
      JSON.stringify({ messages: extractedMessages }, null, 2)
    )

    return Object.keys(dictionary).length
  }

  logger.info('Extraction:', 'Extracting messages...')

  const msgCount = await extractor()

  done(`Extracted ${msgCount} messages`)

  if (options.watch) {
    logger.log('')
    logger.info('Watch:', 'Watching files for changes...\n')
    const configWatcher = runtime.fs.watch({
      ...config,
      ...options
    })

    configWatcher.on(
      'change',
      debounce(async () => {
        const done = logger.time.success()
        logger.info('Extraction:', 'Files changed, processing messages...')
        const msgCount = await extractor()

        done(`Extracted ${msgCount} messages`)
        logger.log('')
      })
    )
  }
}
