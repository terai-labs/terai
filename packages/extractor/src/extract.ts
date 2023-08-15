// Dependencies
import { hoistSelectors } from '@formatjs/icu-messageformat-parser/manipulator'
import { parse } from '@formatjs/icu-messageformat-parser'
import { printAST } from '@formatjs/icu-messageformat-parser/printer'
import { readFile, outputFile } from 'fs-extra'
import stringify from 'json-stable-stringify'
import { promisify } from 'util'
import * as formatter from './formatter'

// Types
import type { ExtractCLIOptions, ExtractOpts, ExtractionResult } from './types'
import type { ExtractedMessage } from '@rosseta/types'
import { processFile } from './process'

/**
 * Extract strings from source files
 * @param files list of files
 * @param extractOpts extract options
 * @returns messages serialized as JSON string since key order
 * matters for some `format`
 */
export async function extract(
  files: readonly string[],
  { throws, flatten, ...opts }: ExtractOpts
) {
  const rawResults: Array<ExtractionResult | undefined> = await Promise.all(
    files.map(async fileName => {
      // console.log('Extracting file:', fileName)
      try {
        const source = await readFile(fileName, 'utf8')

        return processFile(source, fileName, opts)
      } catch (e) {
        if (throws) {
          throw e
        } else {
          console.warn(String(e))
        }
      }
    })
  )

  const extractionResults = rawResults.filter((r): r is ExtractionResult => !!r)
  const extractedMessages = new Map<string, ExtractedMessage>()

  for (const { messages } of extractionResults) {
    for (const message of messages) {
      const {
        id
        // description,
        // defaultMessage
      } = message

      if (!id) {
        const error = new Error(
          `[FormatJS CLI] Missing message id for message: ${JSON.stringify(
            message,
            undefined,
            2
          )}`
        )

        if (throws) {
          throw error
        } else {
          console.warn(error.message)
        }

        continue
      }

      extractedMessages.set(id, message)
    }
  }

  const results: Record<string, Omit<ExtractedMessage, 'id'>> = {}
  const messages = Array.from(extractedMessages.values())

  for (const { id, ...msg } of messages) {
    if (flatten && msg.defaultMessage) {
      msg.defaultMessage = printAST(hoistSelectors(parse(msg.defaultMessage)))
    }
    results[id] = msg
  }

  //@ts-ignore
  return stringify(formatter.format(results), {
    space: 2
  })
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
  const writeStdout = promisify(process.stdout.write).bind(process.stdout)
  const serializedResult = (await extract(files, opts)) + '\n'

  if (outFile) {
    // console.log('Writing output file:', outFile)
    return outputFile(outFile, serializedResult)
  }

  await writeStdout(serializedResult)
}
