import type { Locale } from './locale'

export type Dictionary = Record<string, string>
export type DictionaryId = Locale | `${Locale}-${string}`
export type Dictionaries = Partial<Record<DictionaryId, Dictionary>>
