// Dependencies
import * as ts from 'typescript'
import { logger } from '@terai/logger'
import { runtime } from '@terai/runtime'
import { transform } from '@terai/transformer'

// Types
import type { ExtractedMessage, ExtractedMessages } from '@terai/types'

type ExtractOptions = {
	filesPaths: readonly string[]
	cwd: string
}

export async function extract({
	filesPaths,
	cwd
}: ExtractOptions): Promise<ExtractedMessages> {
	const extractedMessages: ExtractedMessages = {}
	const failedFiles: string[] = []

	function onMsgExtracted(id: string, msg: ExtractedMessage) {
		if (extractedMessages[id]) {
			extractedMessages[id] = {
				...extractedMessages[id],
				...msg,
				chunksIds: unique([
					...extractedMessages[id].chunksIds,
					...msg.chunksIds
				]),
				files: unique([...extractedMessages[id].files, ...msg.files])
			}
		} else {
			extractedMessages[id] = msg
		}
	}

	await Promise.all(
		filesPaths.map(async (fileName) => {
			try {
				const source = runtime.fs.readFile(fileName)

				ts.transpileModule(source, {
					reportDiagnostics: true,
					fileName,
					compilerOptions: {
						allowJs: true,
						target: ts.ScriptTarget.ESNext,
						noEmit: true,
						experimentalDecorators: true
					},
					transformers: {
						before: [
							transform({
								cwd,
								onMsgExtracted
							})
						]
					}
				})
			} catch (e) {
				logger.error('extract', `Error processing file ${fileName} ${e}`)
				failedFiles.push(fileName)
			}
		})
	)

	// A partial extraction would drop the failed files' messages from every
	// locale on the next translate, so refuse to return one.
	if (failedFiles.length) {
		throw new Error(
			`Failed to process ${failedFiles.length} file(s): ${failedFiles.join(', ')}`
		)
	}

	return extractedMessages
}

function unique<T>(items: T[]): T[] {
	return [...new Set(items)]
}
