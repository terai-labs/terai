// Dependencies
import { pathToFileURL } from 'url'
import { resolve } from 'path'
import * as crowdin from './crowdin'
import * as defaultFormatter from './default'
import * as lokalise from './lokalise'
import * as simple from './simple'
import * as smartling from './smartling'
import * as transifex from './transifex'

// Types
import type { Comparator } from 'json-stable-stringify'
import type { FormatFn, CompileFn } from './default'

export interface Formatter {
  format: FormatFn
  compile: CompileFn
  compareMessages?: Comparator
}

export async function resolveBuiltinFormatter(
  format?: string | Formatter
): Promise<any> {
  if (!format) {
    return defaultFormatter
  }
  if (typeof format !== 'string') {
    return format
  }
  switch (format) {
    case 'transifex':
      return transifex
    case 'smartling':
      return smartling
    case 'simple':
      return simple
    case 'lokalise':
      return lokalise
    case 'crowdin':
      return crowdin
  }
  try {
    return import(pathToFileURL(resolve(process.cwd(), format)).href)
  } catch (e) {
    console.error(`Cannot resolve formatter ${format}`)
    throw e
  }
}
