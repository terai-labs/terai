import type { ExtractedMessage } from '@tsmu/types'

export type TransformerOptions = {
  cwd: string
  onMsgExtracted: (id: string, message: ExtractedMessage) => void
}
