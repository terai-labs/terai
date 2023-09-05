import type { ExtractedMessage } from '@rewordlabs/types'

export interface TransformerOptions {
  onMsgExtracted?: (filePath: string, msgs: ExtractedMessage[]) => void
}
