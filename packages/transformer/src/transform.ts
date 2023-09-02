// Dependencies
import { toHash, prepareMessage } from '@rosetta.js/utils'
import * as ts from 'typescript'

// Types
import type { ExtractedMessage } from '@rosetta.js/types'
import type { TransformerOptions } from './types'

type TypeScript = typeof ts

function extractMessageFromTemplateExpression(
  ts: TypeScript,
  factory: ts.NodeFactory,
  node: ts.TaggedTemplateExpression,
  { onMsgExtracted }: TransformerOptions,
  sf: ts.SourceFile
): ts.VisitResult<ts.TaggedTemplateExpression> {
  const value = prepareMessage(node.template.getText())
  const id = toHash(value)

  const msg: ExtractedMessage = {
    id,
    value,
    context: '',
    file: sf.fileName
  }

  if (typeof onMsgExtracted === 'function') {
    onMsgExtracted(sf.fileName, [msg])
  }

  return node
}

function extractMessageFromCallExpression(
  ts: TypeScript,
  factory: ts.NodeFactory,
  node: ts.CallExpression,
  { onMsgExtracted }: TransformerOptions,
  sf: ts.SourceFile
): ts.VisitResult<ts.CallExpression> {
  const expressionNode = node.parent as ts.TaggedTemplateExpression
  const value = prepareMessage(expressionNode.template.getText())
  let context = ''
  const id = toHash(value)

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
    file: sf.fileName,
    context
  }

  if (typeof onMsgExtracted === 'function') {
    onMsgExtracted(sf.fileName, [msg])
  }

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
