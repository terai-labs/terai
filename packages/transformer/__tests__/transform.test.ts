import * as ts from 'typescript'
import { describe, expect, test } from 'vitest'
import { transform } from '../src'
import type { ExtractedMessage } from '@terai/types'

function extract(fileName: string, source: string) {
	const messages: ExtractedMessage[] = []

	ts.transpileModule(source, {
		fileName,
		compilerOptions: { target: ts.ScriptTarget.ESNext, noEmit: true },
		transformers: {
			before: [
				transform({
					cwd: '/repo/app',
					onMsgExtracted: (_id, msg) => messages.push(msg)
				})
			]
		}
	})

	return messages.map(({ value, chunksIds, context }) =>
		context ? { value, chunksIds, context } : { value, chunksIds }
	)
}

describe('transform', () => {
	test('assigns every chunk declared in the file, once', () => {
		const source = `
			const before = ts\`Before\`
			function A() {
				const { ts } = useTs({ chunkId: 'a' })
				return ts\`In A\`
			}
			function B() {
				const { ts } = useTs({ chunkId: 'b' })
				const { ts: again } = useTs({ chunkId: 'a' })
				return ts\`In B\`
			}
		`

		expect(extract('/repo/app/src/page.tsx', source)).toEqual([
			{ value: 'Before', chunksIds: ['default'] },
			{ value: 'In A', chunksIds: ['a', 'b'] },
			{ value: 'In B', chunksIds: ['a', 'b'] }
		])
	})

	test('does not leak chunks between runs on the same file', () => {
		const chunked = `
			const { ts } = useTs({ chunkId: 'a' })
			ts\`Hello\`
		`
		const unchunked = 'ts`Hello`'

		expect(extract('/repo/app/src/page.tsx', chunked)).toEqual([
			{ value: 'Hello', chunksIds: ['a'] }
		])
		expect(extract('/repo/app/src/page.tsx', unchunked)).toEqual([
			{ value: 'Hello', chunksIds: ['default'] }
		])
	})

	test('reads static chunk ids and contexts, ignores dynamic ones', () => {
		const source = `
			const { ts } = useTs({ chunkId: \`static\` })
			const { ts: other } = useTs({ chunkId: dynamicId })
			ts({ context: "formal" })\`Hello\`
			ts({ context: someVariable })\`Bye\`
		`

		expect(extract('/repo/app/src/page.tsx', source)).toEqual([
			{ value: 'Hello', chunksIds: ['static'], context: 'formal' },
			{ value: 'Bye', chunksIds: ['static'] }
		])
	})
})
