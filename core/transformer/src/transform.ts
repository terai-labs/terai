// Dependencies
import * as ts from 'typescript'
import { toHash, prepareMessage } from '@rewordlabs/utils'

// Types
import type { Config, ExtractedMessage } from '@rewordlabs/types'
import type { TransformerOptions } from './types'

type TypeScript = typeof ts

function getChunkId(
  cwd: string,
  filePath: string,
  codeSplitting: Config['codeSplitting']
): string {
  if (codeSplitting === 'file') return filePath

  const relativePath = filePath.slice(cwd.length)
  const pathParts = relativePath.split('/')
  const truncatedPathParts = pathParts.slice(0, codeSplitting)
  const transformedPath = truncatedPathParts.join('/')
  const chunkId = toHash(transformedPath)

  return chunkId
}

function extractMessageFromTemplateExpression(
  ts: TypeScript,
  factory: ts.NodeFactory,
  node: ts.TaggedTemplateExpression,
  { onMsgExtracted, cwd, codeSplitting }: TransformerOptions,
  sf: ts.SourceFile
): ts.VisitResult<ts.TaggedTemplateExpression> {
  const text = node.template.getText()
  const value = prepareMessage(text)
  const id = toHash(value)
  const fileName = sf.fileName
  const chunkId = getChunkId(cwd, fileName, codeSplitting)

  const msg: ExtractedMessage = {
    id,
    value,
    context: '',
    file: fileName,
    chunkId
  }

  onMsgExtracted(id, msg)

  return node
}

function extractMessageFromCallExpression(
  ts: TypeScript,
  factory: ts.NodeFactory,
  node: ts.CallExpression,
  { onMsgExtracted, cwd, codeSplitting }: TransformerOptions,
  sf: ts.SourceFile
): ts.VisitResult<ts.CallExpression> {
  const expressionNode = node.parent as ts.TaggedTemplateExpression
  const text = expressionNode.template.getText()
  const value = prepareMessage(text)
  let context = ''
  const fileName = sf.fileName
  const id = toHash(value)
  const chunkId = getChunkId(cwd, fileName, codeSplitting)

  // Extract context from first argument
  if (node.arguments?.[0]) {
    node.arguments?.[0].forEachChild(child => {
      const key = child.getFirstToken()?.getText()

      if (key === 'context') {
        const contextValue = child.getLastToken()?.getText()
        if (contextValue) context = contextValue
      }
    })
  }

  const msg: ExtractedMessage = {
    id,
    value,
    file: fileName,
    context,
    chunkId
  }

  onMsgExtracted(id, msg)

  return node
}

function getVisitor(
  ts: TypeScript,
  ctx: ts.TransformationContext,
  sf: ts.SourceFile,
  opts: TransformerOptions
) {
  const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
    if (ts.isTaggedTemplateExpression(node) && node.tag.getText() === 'tx') {
      extractMessageFromTemplateExpression(ts, ctx.factory, node, opts, sf)
    } else if (
      ts.isCallExpression(node) &&
      node.expression.getText() === 'tx'
    ) {
      extractMessageFromCallExpression(ts, ctx.factory, node, opts, sf)
    }

    return ts.visitEachChild(node, visitor, ctx)
  }

  return visitor
}

export function transform(opts: TransformerOptions) {
  const transformFn: ts.TransformerFactory<ts.SourceFile> = ctx => sf => {
    const visitor = getVisitor(ts, ctx, sf, opts)

    return ts.visitEachChild(sf, visitor, ctx)
  }

  return transformFn
}
