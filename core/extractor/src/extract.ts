// Dependencies
import * as ts from 'typescript'
import { logger } from '@rewordlabs/logger'
import { runtime } from '@rewordlabs/runtime'
import { transform } from '@rewordlabs/transformer'

// Types
import type { ExtractedMessage, ExtractedMessages } from '@rewordlabs/types'

type ExtractOptions = {
  filesPaths: readonly string[]
  cwd: string
}

export async function extract({
  filesPaths,
  cwd
}: ExtractOptions): Promise<ExtractedMessages> {
  const extractedMessages: ExtractedMessages = {}

  function onMsgExtracted(id: string, msg: ExtractedMessage) {
    if (extractedMessages[id]) {
      extractedMessages[id] = {
        ...extractedMessages[id],
        ...msg,
        chunksIds: [...extractedMessages[id].chunksIds, ...msg.chunksIds],
        files: [...extractedMessages[id].files, ...msg.files]
      }
    } else {
      extractedMessages[id] = msg
    }
  }

  await Promise.all(
    filesPaths.map(async fileName => {
      try {
        const source = runtime.fs.readFile(fileName)

        ts.transpileModule(source, {
          reportDiagnostics: true,
          fileName,
          compilerOptions: {
            allowJs: true,
            target: ts.ScriptTarget.ESNext,
            noEmit: true,
            experimentalDecorators: true
          },
          transformers: {
            before: [
              transform({
                cwd,
                onMsgExtracted
              })
            ]
          }
        })
      } catch (e) {
        logger.error('extract', `Error processing file ${fileName} ${e}`)
        return null
      }
    })
  )

  return extractedMessages
}
