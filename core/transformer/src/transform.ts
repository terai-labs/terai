// Dependencies
import * as ts from 'typescript'
import { toHash, prepareMessage } from '@rewordlabs/utils'

// Types
import type { ExtractedMessage } from '@rewordlabs/types'
import type { TransformerOptions } from './types'

type TypeScript = typeof ts

// https://esbuild.github.io/content-types/#direct-eval
const nodeEval = eval

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

  const msg: ExtractedMessage = {
    id,
    value,
    file,
    context: '',
    chunkId: id
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
  let chunkId = ''
  const arg = node.arguments?.[0]

  if (arg) {
    arg.forEachChild(child => {
      const key = child.getFirstToken()?.getText()
      if (key === 'context') {
        const contextValue = child.getLastToken()?.getText()
        if (contextValue) context = nodeEval(contextValue)
      }
      if (key === 'chunkId') {
        const chunkValue = child.getLastToken()?.getText()
        if (chunkValue) chunkId = nodeEval(chunkValue)
      }
    })
  }

  const msg: ExtractedMessage = {
    id,
    value,
    file,
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
    // Store project variables
    // TODO: This solution is temporal and needs to be reviewed
    // const declaredVariables: Map<string, unknown> = new Map()
    // if (ts.isVariableDeclaration(node)) {
    //   const variableName = node.name.getText()
    //   declaredVariables.set(variableName, node.getText())
    // }

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
