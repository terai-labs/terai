import type {
  FormatDateOptions,
  FormatDateProps,
  FormatNumberOptions,
  FormatNumberProps
} from './interpolation'

type Config<A, B extends { value: any; options?: any }> = {
  format: A
  value: B['value']
} & B['options']

type ObjectArgs<A, B extends { value: any; options?: any }> =
  | B['value']
  | Exclude<Config<A, B>, 'getDate'>

type NumberVariable = ObjectArgs<'number', FormatNumberProps>

type DateVariable = ObjectArgs<'date', FormatDateProps>

export type GlobalFormat = {
  number?: FormatNumberOptions
  date?: FormatDateOptions
}

export type MessageExpression = string | NumberVariable | DateVariable
