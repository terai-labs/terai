import type { ExtractedMessage } from '@rosetta.js/types'

export interface TransformerOptions {
  onMsgExtracted?: (filePath: string, msgs: ExtractedMessage[]) => void
}
