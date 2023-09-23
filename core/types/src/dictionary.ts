export type DictionaryChunk = Record<string, string>
export type Dictionary = Record<string, string | DictionaryChunk>
export type Dictionaries = Record<string, Dictionary>
export type DictionaryCache = Record<string, string>
export type DictionaryPlain = Record<string, string>
