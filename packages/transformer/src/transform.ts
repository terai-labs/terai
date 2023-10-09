// Dependencies
import * as ts from 'typescript'
import { toHash, prepareMessage } from '@koi18n/utils'

// Types
import type { ExtractedMessage } from '@koi18n/types'
import type { TransformerOptions } from './types'

type TypeScript = typeof ts

// https://esbuild.github.io/content-types/#direct-eval
const nodeEval = eval
const chunks: Record<string, string[]> = {}

function getRepoFilePath(cwd: string, filePath: string) {
  const folderName = cwd.split('/').pop()
  const relativePath = filePath.slice(cwd.length)

  return folderName + relativePath
}

function extractMessageFromTemplateExpression(
  ts: TypeScript,
  factory: ts.NodeFactory,
  node: ts.TaggedTemplateExpression,
  { onMsgExtracted, cwd }: TransformerOptions,
  sf: ts.SourceFile
): ts.VisitResult<ts.TaggedTemplateExpression> {
  const text = node.template.getText()
  const value = prepareMessage(text)
  const id = toHash(value)
  const file = getRepoFilePath(cwd, sf.fileName)
  const chunksIds = chunks[file] ?? ['default']

  const msg: ExtractedMessage = {
    id,
    value,
    files: [file],
    context: '',
    chunksIds
  }

  onMsgExtracted(id, msg)

  return node
}

function extractMessageFromCallExpression(
  ts: TypeScript,
  factory: ts.NodeFactory,
  node: ts.CallExpression,
  { onMsgExtracted, cwd }: TransformerOptions,
  sf: ts.SourceFile
): ts.VisitResult<ts.CallExpression> {
  const expressionNode = node.parent as ts.TaggedTemplateExpression
  const text = expressionNode.template.getText()
  const value = prepareMessage(text)
  const file = getRepoFilePath(cwd, sf.fileName)
  const id = toHash(value)
  let context = ''
  const arg = node.arguments?.[0]
  const chunksIds = chunks[file] ?? ['default']

  if (arg) {
    arg.forEachChild(child => {
      const key = child.getFirstToken()?.getText()
      if (key === 'context') {
        const contextValue = child.getLastToken()?.getText()
        if (contextValue) context = nodeEval(contextValue)
      }
    })
  }

  const msg: ExtractedMessage = {
    id,
    value,
    files: [file],
    context,
    chunksIds
  }

  onMsgExtracted(id, msg)

  return node
}

function extractChunk(
  ts: TypeScript,
  factory: ts.NodeFactory,
  node: ts.CallExpression,
  { cwd }: TransformerOptions,
  sf: ts.SourceFile
): ts.VisitResult<ts.CallExpression> {
  const file = getRepoFilePath(cwd, sf.fileName)
  const arg = node.arguments?.[0]

  if (arg) {
    arg.forEachChild(child => {
      const key = child.getFirstToken()?.getText()

      if (key === 'chunkId') {
        const chunkValue = child.getLastToken()?.getText()
        if (chunkValue) {
          chunks[file] = chunks[file] ?? []
          chunks[file].push(nodeEval(chunkValue))
        }
      }
    })
  }

  return node
}

function getVisitor(
  ts: TypeScript,
  cts: ts.TransformationContext,
  sf: ts.SourceFile,
  opts: TransformerOptions
) {
  const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
    if (
      ts.isCallExpression(node) &&
      (node.expression.getText() === 'getTs' ||
        node.expression.getText() === 'useTs')
    ) {
      extractChunk(ts, cts.factory, node, opts, sf)
    }

    if (ts.isTaggedTemplateExpression(node) && node.tag.getText() === 'ts') {
      extractMessageFromTemplateExpression(ts, cts.factory, node, opts, sf)
    }

    if (ts.isCallExpression(node) && node.expression.getText() === 'ts') {
      extractMessageFromCallExpression(ts, cts.factory, node, opts, sf)
    }

    return ts.visitEachChild(node, visitor, cts)
  }

  return visitor
}

export function transform(opts: TransformerOptions) {
  const transformFn: ts.TransformerFactory<ts.SourceFile> = cts => sf => {
    const visitor = getVisitor(ts, cts, sf, opts)

    return ts.visitEachChild(sf, visitor, cts)
  }

  return transformFn
}
