import { memo } from './memo'

const SAFELY_ESCAPED_CHAR = 'SAFELY_ESCAPED_CHAR'

export const prepareMessage = memo((message: string) => {
	return message
		.replaceAll(/\$\{[^}]*}/g, '${var}')
		.replaceAll('`', '') // TODO: remove this and add in transformer
		.replaceAll('\\n', SAFELY_ESCAPED_CHAR)
		.split(/(?:\r\n|\n|\r)/)
		.map((line) => line.replaceAll(/^\s+/gm, ''))
		.join(' ')
		.trim()
		.replaceAll(SAFELY_ESCAPED_CHAR, '\n')
		.replaceAll('\n ', '\n')
})
