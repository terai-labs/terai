import type { Config, ExtractedMessage } from '@rewordlabs/types'

export type TransformerOptions = {
  cwd: string
  onMsgExtracted: (id: string, message: ExtractedMessage) => void
} & Pick<Config, 'codeSplitting'>
