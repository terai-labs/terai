import type { Locale } from './locale'
import type { MessageId, MessageValue } from './message'

export type Dictionary = Record<MessageId, MessageValue>

export type ImportedDictionaries = Record<
  Locale,
  () => Promise<{ default: Dictionary }>
>
