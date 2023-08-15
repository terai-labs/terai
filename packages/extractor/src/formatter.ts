import { type ExtractedMessage } from '@rosseta/types'

export type FormatFn<T = Record<string, ExtractedMessage>> = (
  msgs: Record<string, ExtractedMessage>
) => T

export type CompileFn<T = Record<string, ExtractedMessage>> = (
  msgs: T
) => Record<string, string>

export const format: FormatFn = msgs => msgs

export const compile: CompileFn = msgs => {
  const results: Record<string, string> = {}
  for (const k in msgs) {
    results[k] = msgs[k].defaultMessage!
  }
  return results
}
