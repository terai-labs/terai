import type { Observable } from '@legendapp/state'
import type { Locale, Messages, ImportedMessages } from '@rosetta.js/types'

export type State = {
  locale: Locale
  messages: {
    [key: string]: Messages
  }
}

export type ObservableState = Observable<State>

export type SetupOptions = {
  locale: Locale
  messages: ImportedMessages
}
