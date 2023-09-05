// Dependencies
import { processFile } from './process-file'
import { logger } from '@rewordlabs/logger'
import { runtime } from '@rewordlabs/node'

// Types
import type { TransformerOptions } from '@rewordlabs/transformer'
import type { ExtractedMessages } from '@rewordlabs/types'

type ExtractOptions = TransformerOptions & {
  filesPaths: readonly string[]
}

export async function extract({
  filesPaths,
  ...options
}: ExtractOptions): Promise<ExtractedMessages> {
  const extractedMessages: ExtractedMessages = {}

  await Promise.all(
    filesPaths.map(async fileName => {
      try {
        const source = runtime.fs.readFile(fileName)
        const dictionary = await processFile(source, fileName, options)

        for (const message of dictionary) {
          extractedMessages[message.id] = message
        }
      } catch (e) {
        logger.error('extract', `Error processing file ${fileName} ${e}`)
        return null
      }
    })
  )

  return extractedMessages
}
