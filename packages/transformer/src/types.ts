import type { ExtractedMessage } from '@rosseta/types'

export interface Opts {
  /**
   * Parse specific additional custom pragma.
   * This allows you to tag certain file with metadata such as `project`.
   * For example with this file:
   * ```tsx
   * // @intl-meta project:my-custom-project
   * import {FormattedMessage} from 'react-intl';
   * <FormattedMessage defaultMessage="foo" id="bar" />;
   * ```
   * and with option `{pragma: "@intl-meta"}`,
   * we'll parse out `// @intl-meta project:my-custom-project`
   * into `{project: 'my-custom-project'}` in the result file.
   */
  pragma?: string
  /**
   * Whether the metadata about the location of the message in the source file
   * should be extracted. If `true`, then `file`, `start`, and `end`
   * fields will exist for each extracted message descriptors.
   * Defaults to `false`.
   */
  extractSourceLocation?: boolean
  /**
   * Remove `defaultMessage` field in generated js after extraction.
   */
  removeDefaultMessage?: boolean
  /**
   * Additional component names to extract messages from,
   * e.g: `['FormattedFooBarMessage']`.
   */
  additionalComponentNames?: string[]
  /**
   * Additional function names to extract messages from,
   * e.g: `['formatMessage', '$t']`
   * Default to `['formatMessage']`
   */
  additionalFunctionNames?: string[]
  /**
   * Callback function that gets called everytime we encountered something
   * that looks like a ExtractedMessage
   */
  onMsgExtracted?: (filePath: string, msgs: ExtractedMessage[]) => void
  /**
   * Callback function that gets called when we successfully parsed meta
   * declared in pragma
   */
  onMetaExtracted?: (filePath: string, meta: Record<string, string>) => void
  /**
   * Whether to compile `defaultMessage` to AST.
   * This is no-op if `removeDefaultMessage` is `true`
   */
  ast?: boolean
  /**
   * Whether to preserve whitespace and newlines.
   */
  preserveWhitespace?: boolean
}
