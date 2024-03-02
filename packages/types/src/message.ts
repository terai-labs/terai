export type ExtractedMessage = {
	id: string
	value: string
	context: string
	files: string[]
	chunksIds: string[]
}

export type ExtractedMessages = Record<string, ExtractedMessage>
