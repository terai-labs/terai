// Dependencies
import * as ts from 'typescript'
import { toHash, prepareMessage } from '@terai/utils'

// Types
import type { ExtractedMessage } from '@terai/types'
import type { TransformerOptions } from './types'

type TypeScript = typeof ts

// Chunk ids declared so far in the file being transformed. Messages found
// after a `useTs`/`getTs` call belong to every chunk the file declares.
type FileState = {
	file: string
	chunksIds: string[]
	messages: { msg: ExtractedMessage; chunked: boolean }[]
}

function getRepoFilePath(cwd: string, filePath: string) {
	const folderName = cwd.split('/').pop()
	const relativePath = filePath.slice(cwd.length)

	return folderName + relativePath
}

function extractMessageFromTemplateExpression(
	ts: TypeScript,
	factory: ts.NodeFactory,
	node: ts.TaggedTemplateExpression,
	state: FileState
): ts.VisitResult<ts.TaggedTemplateExpression> {
	const text = node.template.getText()
	const value = prepareMessage(text)
	const id = toHash(value)

	collectMessage(state, {
		id,
		value,
		files: [state.file],
		context: '',
		chunksIds: []
	})

	return node
}

function extractMessageFromCallExpression(
	ts: TypeScript,
	factory: ts.NodeFactory,
	node: ts.CallExpression,
	state: FileState
): ts.VisitResult<ts.CallExpression> {
	const expressionNode = node.parent as ts.TaggedTemplateExpression
	const text = expressionNode.template.getText()
	const value = prepareMessage(text)
	const id = toHash(value)
	let context = ''
	const arg = node.arguments?.[0]

	if (arg) {
		arg.forEachChild((child) => {
			const key = child.getFirstToken()?.getText()
			if (key === 'context') {
				const contextValue = getStringValue(child.getLastToken())
				if (contextValue) context = contextValue
			}
		})
	}

	collectMessage(state, {
		id,
		value,
		files: [state.file],
		context,
		chunksIds: []
	})

	return node
}

// Only static strings can be extracted: `'a'`, `"a"` or `` `a` ``
function getStringValue(node: ts.Node | undefined) {
	if (!node) return undefined
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
		return node.text
	}
}

function collectMessage(state: FileState, msg: ExtractedMessage) {
	state.messages.push({ msg, chunked: state.chunksIds.length > 0 })
}

function extractChunk(
	ts: TypeScript,
	factory: ts.NodeFactory,
	node: ts.CallExpression,
	state: FileState
): ts.VisitResult<ts.CallExpression> {
	const arg = node.arguments?.[0]

	if (arg) {
		arg.forEachChild((child) => {
			const key = child.getFirstToken()?.getText()

			if (key === 'chunkId') {
				const chunkId = getStringValue(child.getLastToken())
				if (chunkId && !state.chunksIds.includes(chunkId)) {
					state.chunksIds.push(chunkId)
				}
			}
		})
	}

	return node
}

function getVisitor(
	ts: TypeScript,
	cts: ts.TransformationContext,
	state: FileState
) {
	const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
		if (
			ts.isCallExpression(node) &&
			(node.expression.getText() === 'getTs' ||
				node.expression.getText() === 'useTs')
		) {
			extractChunk(ts, cts.factory, node, state)
		}

		if (ts.isTaggedTemplateExpression(node) && node.tag.getText() === 'ts') {
			extractMessageFromTemplateExpression(ts, cts.factory, node, state)
		}

		if (ts.isCallExpression(node) && node.expression.getText() === 'ts') {
			extractMessageFromCallExpression(ts, cts.factory, node, state)
		}

		return ts.visitEachChild(node, visitor, cts)
	}

	return visitor
}

export function transform(opts: TransformerOptions) {
	const transformFn: ts.TransformerFactory<ts.SourceFile> = (cts) => (sf) => {
		const state: FileState = {
			file: getRepoFilePath(opts.cwd, sf.fileName),
			chunksIds: [],
			messages: []
		}
		const visitor = getVisitor(ts, cts, state)
		const result = ts.visitEachChild(sf, visitor, cts)

		// Emit once the whole file is visited, so every message sees the final
		// list of chunks declared after it (and none from other files or runs).
		for (const { msg, chunked } of state.messages) {
			opts.onMsgExtracted(msg.id, {
				...msg,
				chunksIds: chunked ? [...state.chunksIds] : ['default']
			})
		}

		return result
	}

	return transformFn
}
