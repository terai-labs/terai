import type { Locale, Messages, ImportedMessages } from '@rosetta.js/types'

export type State = {
  locale: Locale
  messages: Messages
}

export type SetupOptions = {
  locale: Locale
  messages: ImportedMessages
}
