import type { MessageId, MessageValue } from './message'

export type Dictionary = Record<MessageId, MessageValue>

export type ImportedDictionaries = Record<
  string,
  () => Promise<{ default: Dictionary }>
>
