// Types
import type { Locale } from '@rewordlabs/types'

export type FormatDateOptions = {
  value: Parameters<Intl.DateTimeFormat['format']>[0]
  locale: Locale
  options?: Intl.DateTimeFormatOptions
}

export function formatDate({
  value,
  locale,
  options
}: FormatDateOptions): ReturnType<Intl.DateTimeFormat['format']> {
  const formatter = new Intl.DateTimeFormat(locale, options)

  return formatter.format(value)
}
