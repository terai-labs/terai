// Types
import type { Observable } from '@legendapp/state'
import type {
  Locale,
  Dictionary,
  ImportedDictionaries
} from '@rosetta.js/types'

export type State = {
  locale: Locale
  dictionaries: {
    [key: string]: Dictionary
  }
}

export type ObservableState = Observable<State>

export type SetupOptions = {
  locale: Locale
  dictionaries: ImportedDictionaries
}
