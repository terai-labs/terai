// Dependencies
import { generate } from '@rewordlabs/generator'
import { logger } from '@rewordlabs/logger'
import { loadConfig, runtime } from '@rewordlabs/runtime'
import { debounce } from 'perfect-debounce'
import { extract } from '@rewordlabs/extractor'
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
    .command('extract', "Initialize Reword's extraction")
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('-w, --watch', 'Watch files and rebuild')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(extractCmd)
}

export async function extractCmd(options: ExtractOptions) {
  if (options.silent) logger.level = 'silent'
  const done = logger.time.info('✨ Reword extraction')

  const config = await loadConfig(options)
  const filesPaths = runtime.fs.glob({
    ...config,
    cwd: options.cwd
  })

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
  }

  logger.info('cli:extract', 'Extracting messages from project...')
  await extractor()

  logger.info('cli:extract', 'Extracted messages ✅')
  done()

  if (options.watch) {
    logger.info('cli:extract', 'Watching files...')
    const configWatcher = runtime.fs.watch({
      ...config,
      ...options
    })

    configWatcher.on(
      'change',
      debounce(async () => {
        const done = logger.time.info('✨ Reword extraction')
        logger.info('cli:extract', 'Files changed, extracting messages...')
        await extractor()

        logger.info('cli:extract', 'Extracted messages ✅')
        done()
      })
    )
  }
}
