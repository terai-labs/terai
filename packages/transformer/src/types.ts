import type { ExtractedMessage } from '@koi18n/types'

export type TransformerOptions = {
  cwd: string
  onMsgExtracted: (id: string, message: ExtractedMessage) => void
}
