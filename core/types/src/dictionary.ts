export type Dictionary = Record<string, string | Record<string, string>>
export type Dictionaries = Record<string, Dictionary>
export type ImportedDictionaries = Record<
  string,
  () => Promise<{ default: Dictionary }>
>
