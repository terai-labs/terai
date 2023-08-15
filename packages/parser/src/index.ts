import {
  type Opts,
  transform,
  interpolateName,
  type MessageDescriptor
} from '@rosseta/transformer'
import * as ts from 'typescript'

import { readFile, outputFile } from 'fs-extra'

import { promisify } from 'util'

import { resolveBuiltinFormatter, type Formatter } from './formatters'

import stringify from 'json-stable-stringify'
import { printAST } from '@formatjs/icu-messageformat-parser/printer'
import { hoistSelectors } from '@formatjs/icu-messageformat-parser/manipulator'
import { parse } from '@formatjs/icu-messageformat-parser'

function getStdinAsString(): Promise<string> {
  let result = ''
  return new Promise(resolve => {
    process.stdin.setEncoding('utf-8')
    process.stdin.on('readable', () => {
      let chunk
      while ((chunk = process.stdin.read())) {
        result += chunk
      }
    })
    process.stdin.on('end', () => {
      resolve(result)
    })
  })
}

export const writeStdout = promisify(process.stdout.write).bind(process.stdout)

export interface ExtractionResult<M = Record<string, string>> {
  /**
   * List of extracted messages
   */
  messages: MessageDescriptor[]
  /**
   * Metadata extracted w/ `pragma`
   */
  meta?: M
}

export interface ExtractedMessageDescriptor extends MessageDescriptor {
  /**
   * Line number
   */
  line?: number
  /**
   * Column number
   */
  col?: number
  /**
   * Metadata extracted from pragma
   */
  meta?: Record<string, string>
}

export type ExtractCLIOptions = Omit<
  ExtractOpts,
  'overrideIdFn' | 'onMsgExtracted' | 'onMetaExtracted'
> & {
  /**
   * Output File
   */
  outFile?: string
  /**
   * Ignore file glob pattern
   */
  ignore?: string[]
}

export type ExtractOpts = Opts & {
  /**
   * Whether to throw an error if we had any issues with
   * 1 of the source files
   */
  throws?: boolean
  /**
   * Message ID interpolation pattern
   */
  idInterpolationPattern?: string
  /**
   * Whether we read from stdin instead of a file
   */
  readFromStdin?: boolean
  /**
   * Path to a formatter file that controls the shape of JSON file from `outFile`.
   */
  format?: string | Formatter
  /**
   * Whether to hoist selectors & flatten sentences
   */
  flatten?: boolean
} & Pick<Opts, 'onMsgExtracted' | 'onMetaExtracted'>

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

async function processFile(
  source: string,
  fn: string,
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

  if (!opts.overrideIdFn && idInterpolationPattern) {
    opts = {
      ...opts,
      overrideIdFn: (id, defaultMessage, description, fileName) =>
        id ||
        interpolateName(
          {
            resourcePath: fileName
          } as any,
          idInterpolationPattern,
          {
            content: description
              ? `${defaultMessage}#${
                  typeof description === 'string'
                    ? description
                    : stringify(description)
                }`
              : defaultMessage
          }
        )
    }
  }

  console.log('Processing opts for %s: %s', fn, opts)

  const scriptParseFn = parseScript(opts, fn)
  console.log('Processing %s using typescript extractor', fn)
  scriptParseFn(source)
  console.log('Done extracting %s messages: %s', fn, messages)
  if (meta) {
    console.log('Extracted meta:', meta)
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
  extractOpts: ExtractOpts
) {
  const { throws, readFromStdin, flatten, ...opts } = extractOpts
  let rawResults: Array<ExtractionResult | undefined>
  if (readFromStdin) {
    console.log(`Reading input from stdin`)
    // Read from stdin
    if (process.stdin.isTTY) {
      console.warn('Reading source file from TTY.')
    }
    const stdinSource = await getStdinAsString()
    rawResults = [await processFile(stdinSource, 'dummy', opts)]
  } else {
    rawResults = await Promise.all(
      files.map(async fn => {
        console.log('Extracting file:', fn)
        try {
          const source = await readFile(fn, 'utf8')
          return processFile(source, fn, opts)
        } catch (e) {
          if (throws) {
            throw e
          } else {
            console.warn(String(e))
          }
        }
      })
    )
  }

  const formatter = await resolveBuiltinFormatter(opts.format)
  const extractionResults = rawResults.filter((r): r is ExtractionResult => !!r)

  const extractedMessages = new Map<string, MessageDescriptor>()

  for (const { messages } of extractionResults) {
    for (const message of messages) {
      const { id, description, defaultMessage } = message
      if (!id) {
        const error = new Error(
          `[FormatJS CLI] Missing message id for message: 
${JSON.stringify(message, undefined, 2)}`
        )
        if (throws) {
          throw error
        } else {
          console.warn(error.message)
        }
        continue
      }

      if (extractedMessages.has(id)) {
        const existing = extractedMessages.get(id)!
        if (
          stringify(description) !== stringify(existing.description) ||
          defaultMessage !== existing.defaultMessage
        ) {
          const error = new Error(
            `[FormatJS CLI] Duplicate message id: "${id}", ` +
              'but the `description` and/or `defaultMessage` are different.'
          )
          if (throws) {
            throw error
          } else {
            console.warn(error.message)
          }
        }
      }
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
  extractOpts: ExtractCLIOptions
) {
  const { outFile, ...opts } = extractOpts
  const serializedResult = (await extract(files, opts)) + '\n'
  if (outFile) {
    console.log('Writing output file:', outFile)
    return outputFile(outFile, serializedResult)
  }
  await writeStdout(serializedResult)
}

export function parseScript(opts: Opts, fn?: string) {
  return (source: string) => {
    let output
    try {
      // console.log('Using TS compiler to process file', fn)
      output = ts.transpileModule(source, {
        compilerOptions: {
          allowJs: true,
          target: ts.ScriptTarget.ESNext,
          noEmit: true,
          experimentalDecorators: true
        },
        reportDiagnostics: true,
        fileName: fn,
        transformers: {
          before: [transform(opts)]
        }
      })
    } catch (e) {
      if (e instanceof Error) {
        e.message = `Error processing file ${fn} 
${e.message || ''}`
      }
      throw e
    }
    if (output.diagnostics) {
      const errs = output.diagnostics.filter(
        d => d.category === ts.DiagnosticCategory.Error
      )
      if (errs.length) {
        throw new Error(
          ts.formatDiagnosticsWithColorAndContext(errs, {
            getCanonicalFileName: fileName => fileName,
            getCurrentDirectory: () => process.cwd(),
            getNewLine: () => ts.sys.newLine
          })
        )
      }
    }
  }
}
