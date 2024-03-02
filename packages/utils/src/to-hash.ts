import { memo } from './memo'

function toChar(code: number) {
	return String.fromCharCode(code + (code > 25 ? 39 : 97))
}

function toName(code: number) {
	let name = ''
	let x: number
	for (x = Math.abs(code); x > 52; x = (x / 52) | 0)
		name = toChar(x % 52) + name
	return toChar(x % 52) + name
}

function toPhash(h: number, x: string) {
	let i = x.length
	let output = h

	while (i) {
		output = (output * 33) ^ x.charCodeAt(--i)
	}

	return output
}

export const toHash = memo((value: string) => {
	const sanitizedValue = value.replace(/[^\w]/g, '')

	const hash = toName(toPhash(5381, sanitizedValue) >>> 0)
	return hash
})
