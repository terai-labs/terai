// Dependencies
import { processFile } from './process'
import { logger } from '@rosseta/logger'
import { runtime } from '@rosseta/node'
import { toHash } from '@rosseta/utils'

// Types
import type { ExtractOpts } from './types'
import type { ExtractedMessage } from '@rosseta/types'

/**
 * Extract strings from source files
 * @param files list of files
 * @param extractOpts extract options
 * @returns messages serialized as JSON string since key order
 * matters for some `format`
 */
export async function extract(files: readonly string[], options?: ExtractOpts) {
  const extractedMessages = new Map<string, ExtractedMessage>()

  await Promise.all(
    files.map(async fileName => {
      try {
        const source = runtime.fs.readFile(fileName)

        const messages = await processFile(source, fileName, options)
        for (const message of messages) {
          const id = toHash(message.defaultMessage as string)
          extractedMessages.set(id, message)
        }
      } catch (e) {
        logger.error('extract', `Error processing file ${fileName} ${e}`)
        return null
      }
    })
  )

  return extractedMessages
}
