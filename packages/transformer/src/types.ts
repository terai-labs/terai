import type { ExtractedMessage } from '@terai/types'

export type TransformerOptions = {
	cwd: string
	onMsgExtracted: (id: string, message: ExtractedMessage) => void
}
