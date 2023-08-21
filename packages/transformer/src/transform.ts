// Dependencies
import { toHash, prepareMessage } from '@rosetta.js/utils'
import * as ts from 'typescript'

// Types
import type { ExtractedMessage } from '@rosetta.js/types'
import type { TransformerOptions } from './types'

type TypeScript = typeof ts

function extractMessageFromTxCall(
  ts: TypeScript,
  factory: ts.NodeFactory,
  node: ts.TaggedTemplateExpression,
  { onMsgExtracted }: TransformerOptions,
  sf: ts.SourceFile
): ts.VisitResult<ts.TaggedTemplateExpression> {
  const value = prepareMessage(node.template.getText())
  const id = toHash(value)
  console.log('value', value)
  console.log('id', id)

  const msg: ExtractedMessage = {
    id,
    value,
    file: sf.fileName
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
    const isTxCall =
      ts.isTaggedTemplateExpression(node) && node.tag.getText() === 'tx'
    // console.log('isTxCall', node.expression.getText() === 'tx')
    // console.log('isTxCall', isTxCall)

    if (isTxCall) {
      extractMessageFromTxCall(ts, ctx.factory, node, opts, sf)
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
