// Types
import type { Locale } from '@rewordlabs/types'

export type FormatDateOptions = Intl.DateTimeFormatOptions

export type FormatDateProps = {
  value: Parameters<Intl.DateTimeFormat['format']>[0]
  locale: Locale
  options?: FormatDateOptions
}

export function formatDate({
  value,
  locale,
  options
}: FormatDateProps): ReturnType<Intl.DateTimeFormat['format']> {
  const formatter = new Intl.DateTimeFormat(locale, options)

  return formatter.format(value)
}
