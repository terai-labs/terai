// Dependencies
import { hoistSelectors } from '@formatjs/icu-messageformat-parser/manipulator'
import { parse } from '@formatjs/icu-messageformat-parser'
import { printAST } from '@formatjs/icu-messageformat-parser/printer'
import { promisify } from 'util'
import { readFile, outputFile } from 'fs-extra'
import { resolveBuiltinFormatter } from './formatters'
import {
  transform
  // interpolateName
} from '@rosseta/transformer'
import * as ts from 'typescript'
import stringify from 'json-stable-stringify'

// Types
import type {
  ExtractCLIOptions,
  ExtractOpts,
  ExtractedMessageDescriptor,
  ExtractionResult
} from './types'
import type { Opts, MessageDescriptor } from '@rosseta/transformer'

export const writeStdout = promisify(process.stdout.write).bind(process.stdout)

function calculateLineColFromOffset(
  text: string,
  start?: number
): Pick<ExtractedMessageDescriptor, 'line' | 'col'> {
  if (!start) {
    return { line: 1, col: 1 }
  }
  const chunk = text.slice(0, start)
  const lines = chunk.split('\n')
  const lastLine = lines[lines.length - 1]
  return { line: lines.length, col: lastLine.length }
}

export const getParserFn =
  (opts: Opts, fileName?: string) => (source: string) => {
    // let output

    try {
      // console.log('Using TS compiler to process file', fileName)
      // output =
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
          before: [transform(opts)]
        }
      })
    } catch (e) {
      if (e instanceof Error) {
        e.message = `Error processing file ${fileName} ${e.message || ''}`
      }

      throw e
    }

    // if (output.diagnostics) {
    //   const errs = output.diagnostics.filter(
    //     d => d.category === ts.DiagnosticCategory.Error
    //   )

    //   if (errs.length) {
    //     throw new Error(
    //       ts.formatDiagnosticsWithColorAndContext(errs, {
    //         getCanonicalFileName: fileName => fileName,
    //         getCurrentDirectory: () => process.cwd(),
    //         getNewLine: () => ts.sys.newLine
    //       })
    //     )
    //   }
    // }
  }

async function processFile(
  source: string,
  fileName: string,
  {
    idInterpolationPattern,
    ...opts
  }: Opts & { idInterpolationPattern?: string }
) {
  let messages: ExtractedMessageDescriptor[] = []
  let meta: Record<string, string> | undefined

  opts = {
    ...opts,
    additionalComponentNames: [
      '$formatMessage',
      ...(opts.additionalComponentNames || [])
    ],
    onMsgExtracted(_, msgs) {
      if (opts.extractSourceLocation) {
        msgs = msgs.map(msg => ({
          ...msg,
          ...calculateLineColFromOffset(source, msg.start)
        }))
      }

      messages = messages.concat(msgs)
    },
    onMetaExtracted(_, m) {
      meta = m
    }
  }

  // if (!opts.overrideIdFn && idInterpolationPattern) {
  //   opts = {
  //     ...opts,
  //     overrideIdFn: (id, defaultMessage, description, fileName) =>
  //       id ||
  //       interpolateName(
  //         {
  //           resourcePath: fileName
  //         } as any,
  //         idInterpolationPattern,
  //         {
  //           content: description
  //             ? `${defaultMessage}#${
  //                 typeof description === 'string'
  //                   ? description
  //                   : stringify(description)
  //               }`
  //             : defaultMessage
  //         }
  //       )
  //   }
  // }

  // console.log('Processing opts for %s: %s', fileName, opts)

  const parseFn = getParserFn(opts, fileName)

  // console.log('Processing %s using typescript extractor', fileName)
  parseFn(source)
  // console.log('Done extracting %s messages: %s', fileName, messages)

  if (meta) {
    // console.log('Extracted meta:', meta)
    messages.forEach(m => (m.meta = meta))
  }

  return { messages, meta }
}

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

  const formatter = await resolveBuiltinFormatter(opts.format)
  const extractionResults = rawResults.filter((r): r is ExtractionResult => !!r)
  const extractedMessages = new Map<string, MessageDescriptor>()

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

      // if (extractedMessages.has(id)) {
      //   const existing = extractedMessages.get(id)!

      //   if (
      //     stringify(description) !== stringify(existing.description) ||
      //     defaultMessage !== existing.defaultMessage
      //   ) {
      //     const error = new Error(
      //       `[FormatJS CLI] Duplicate message id: "${id}", ` +
      //         'but the `description` and/or `defaultMessage` are different.'
      //     )
      //     if (throws) {
      //       throw error
      //     } else {
      //       console.warn(error.message)
      //     }
      //   }
      // }

      extractedMessages.set(id, message)
    }
  }

  const results: Record<string, Omit<MessageDescriptor, 'id'>> = {}
  const messages = Array.from(extractedMessages.values())

  for (const { id, ...msg } of messages) {
    if (flatten && msg.defaultMessage) {
      msg.defaultMessage = printAST(hoistSelectors(parse(msg.defaultMessage)))
    }
    results[id] = msg
  }

  return stringify(formatter.format(results), {
    space: 2,
    cmp: formatter.compareMessages || undefined
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
  const serializedResult = (await extract(files, opts)) + '\n'

  if (outFile) {
    // console.log('Writing output file:', outFile)
    return outputFile(outFile, serializedResult)
  }

  await writeStdout(serializedResult)
}
