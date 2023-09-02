import type { FormatDateOptions, FormatNumberOptions } from './interpolation'

type Config<A, B extends { value: any; options?: any }> = {
  format: A
  value: B['value']
} & B['options']

type ObjectArgs<A, B extends { value: any; options?: any }> =
  | B['value']
  | Exclude<Config<A, B>, 'getDate'>

type NumberVariable = ObjectArgs<'number', FormatNumberOptions>

type DateVariable = ObjectArgs<'date', FormatDateOptions>

export type MessageExpression = string | NumberVariable | DateVariable
