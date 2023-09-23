// Dependencies
import { debounce } from 'perfect-debounce'
import { extract } from '@rewordlabs/extractor'
import { generate } from '@rewordlabs/generator'
import { loadConfig, runtime } from '@rewordlabs/runtime'
import { logger } from '@rewordlabs/logger'
import { toDictionary, stringify } from '@rewordlabs/utils'

// Types
import type { CAC } from 'cac'
import type { BuildManifest, DictionaryPlain } from '@rewordlabs/types'

export type ExtractOptions = {
  cwd: string
  force?: boolean
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

  const outDirPath = runtime.path.resolve(options.cwd, config.outDir)
  const projectLocalePath = runtime.path.resolve(
    outDirPath,
    config.projectLocale
  )
  const manifestPath = runtime.path.resolve(
    outDirPath,
    '.tmu',
    `build-manifest.json`
  )

  logger.info('Scan:', `Processing files...`)

  async function extractor() {
    const extractedMessages = await extract({
      ...config,
      filesPaths,
      cwd: options.cwd
    })
    const dictionary = toDictionary(extractedMessages)

    runtime.fs.remove(runtime.path.resolve(projectLocalePath))

    await generate({
      ...config,
      dictionary,
      locale: config.projectLocale,
      cwd: options.cwd
    })

    const manifest: BuildManifest = {
      messages: extractedMessages
    }

    runtime.fs.write(manifestPath, stringify(manifest))

    const jsonLocale: DictionaryPlain = {}
    Object.keys(extractedMessages).map(key => {
      jsonLocale[key] = extractedMessages[key].value
    })

    runtime.fs.write(
      runtime.path.resolve(projectLocalePath, `${config.projectLocale}.json`),
      stringify(jsonLocale)
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
