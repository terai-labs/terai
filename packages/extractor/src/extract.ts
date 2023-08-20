// Dependencies
import { processFile } from './process'
import { logger } from '@rosetta.js/logger'
import { runtime } from '@rosetta.js/node'

// Types
import type { TransformerOptions } from '@rosetta.js/transformer'
import type { ExtractedMessage } from '@rosetta.js/types'

/**
 * Extract strings from source files
 * @param files list of files
 * @param extractOpts extract options
 * @returns messages serialized as JSON string since key order
 * matters for some `format`
 */
export async function extract(
  files: readonly string[],
  options?: TransformerOptions
) {
  const extractedMessages = new Map<string, ExtractedMessage>()

  await Promise.all(
    files.map(async fileName => {
      try {
        const source = runtime.fs.readFile(fileName)
        const messages = await processFile(source, fileName, options)

        for (const message of messages) {
          extractedMessages.set(message.id, message)
        }
      } catch (e) {
        logger.error('extract', `Error processing file ${fileName} ${e}`)
        return null
      }
    })
  )

  return extractedMessages
}
