// Dependencies
import { joinTemplateStrings, prepareMessage, toHash } from '@koi18n/utils'

// Types
import type { InterpolateOptions, DynamicValue } from '@koi18n/formatter'

export type CreateTsCallback<R, E> = (options: E) => R

export type TsRenderProps = TsOptions & {
  id: string
  rawMessage: string
  variables: DynamicValue[]
}

export type TsOptions = InterpolateOptions & {
  context?: string
}

export interface Ts<R, E> {
  (strings: TemplateStringsArray, ...variables: DynamicValue[]): R
  (options: TsOptions & E): Ts<R, E>
}

function isTemplateStringsArray(v: any): v is TemplateStringsArray {
  return v?.raw && v?.length
}

export function createTs<R, E extends TsRenderProps>(
  callback: CreateTsCallback<R, E>,
  opts?: E
): Ts<R, E> {
  function ts(
    stringsOrOptions: TemplateStringsArray,
    ...variables: DynamicValue[]
  ): R
  function ts(stringsOrOptions: E): Ts<R, E>
  function ts(
    stringsOrOptions: TemplateStringsArray | E,
    ...variables: DynamicValue[]
  ): R | Ts<R, E> {
    if (isTemplateStringsArray(stringsOrOptions)) {
      const strings = stringsOrOptions
      const rawMessage = prepareMessage(joinTemplateStrings(strings.raw))
      const id = toHash(rawMessage)
      const args = {
        ...opts,
        id,
        rawMessage,
        variables
      } as E

      return callback(args)
    } else {
      return createTs<R, E>(callback, stringsOrOptions)
    }
  }

  return ts
}
