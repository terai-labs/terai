import type {
  Locale,
  Dictionary,
  ImportedDictionaries
} from '@rosetta.js/types'

export type State = {
  locale: Locale
  dictionary: Dictionary
}

export type SetupOptions = {
  locale: Locale
  dictionaries: ImportedDictionaries
}
