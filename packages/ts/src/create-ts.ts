// Dependencies
import { joinTemplateStrings, prepareMessage, toHash } from '@tsmu/utils'

// Types
import type { InterpolateOptions, DynamicValue } from '@tsmu/formatter'

export type CreateTsOptions<R, E> = {
  render: (options: E) => R
}

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
  options: CreateTsOptions<R, E>,
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
      const { render } = options
      const strings = stringsOrOptions
      const rawMessage = prepareMessage(joinTemplateStrings(strings.raw))
      const id = toHash(rawMessage)
      const args = {
        ...opts,
        id,
        rawMessage,
        variables
      } as E

      return render(args)
    } else {
      return createTs<R, E>(options, stringsOrOptions)
    }
  }

  return ts
}
