// Dependencies
import { processFile } from './process'
import { logger } from '@rosseta/logger'
import { runtime } from '@rosseta/node'
import outdent from 'outdent'

// Types
import type { ExtractCLIOptions, ExtractOpts } from './types'
import type { ExtractedMessage } from '@rosseta/types'

/**
 * Extract strings from source files
 * @param files list of files
 * @param extractOpts extract options
 * @returns messages serialized as JSON string since key order
 * matters for some `format`
 */
export async function extract(files: readonly string[], options: ExtractOpts) {
  const extractedMessages = new Map<string, ExtractedMessage>()
  
  const rawResults = await Promise.all(
    files.map(async fileName => {
      try {
        const source = runtime.fs.readFileSync(fileName)

        return processFile(source, fileName, options)
      } catch (e) {
        logger.warn('extract', String(e))
      }
    })
  )

  const extractionResults = rawResults.filter(
    (r): r is ExtractedMessage[] => !!r
  )

  for (const messages of extractionResults) {
    for (const message of messages) {
      // if (!id) {
      //   const error = new Error(
      //     `[FormatJS CLI] Missing message id for message: ${JSON.stringify(
      //       message,
      //       undefined,
      //       2
      //     )}`
      //   )

      //   logger.warn('extract', error.message)

      //   continue
      // }

      extractedMessages.set(message.id, message)
    }
  }

  const messages = Array.from(extractedMessages.values())

  return outdent`
    export default {
      ${messages.map(msg => `${msg.id}: '${msg.defaultMessage}'`).join(',\n')},
    } as const
  `
}

/**
 * Extract strings from source files, also writes to a file.
 * @param files list of files
 * @param extractOpts extract options
 * @returns A Promise that resolves if output file was written successfully
 */
export async function extractAndWrite(
  files: readonly string[],
  { outFile, ...opts }: ExtractCLIOptions
) {
  const result = await extract(files, opts)

  if (outFile) {
    // console.log('Writing output file:', outFile)
    return runtime.fs.writeFile(outFile, result)
  }
}
