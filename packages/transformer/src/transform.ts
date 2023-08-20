// Dependencies
import { toHash } from '@rosetta.js/utils'
import * as ts from 'typescript'
import type { ExtractedMessage } from '@rosetta.js/types'
import type { TransformerOptions } from './types'

type TypeScript = typeof ts

function extractMessageFromTxCall(
  ts: TypeScript,
  factory: ts.NodeFactory,
  node: ts.CallExpression,
  { onMsgExtracted }: TransformerOptions,
  sf: ts.SourceFile
): ts.VisitResult<ts.CallExpression> {
  const [expression] = node.arguments
  const start = expression.pos
  const end = expression.end
  const chunk = sf.fileName.slice(0, start)
  const lines = chunk.split('\n')
  const lastLine = lines[lines.length - 1]
  const value = expression.getText()

  const msg: ExtractedMessage = {
    id: toHash(value),
    value,
    file: sf.fileName,
    start,
    end,
    line: lines.length,
    col: lastLine.length
  }

  if (typeof onMsgExtracted === 'function') onMsgExtracted(sf.fileName, [msg])

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
      ts.isCallExpression(node) && node.expression.getText() === 'tx'

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
