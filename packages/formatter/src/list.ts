// Types
import type { Locale } from '@koi18n/types'

export type FormatListOptions = Intl.ListFormatOptions

export type FormatListProps = {
  value: Parameters<Intl.ListFormat['format']>[0]
  locale: Locale
  options?: FormatListOptions
}

export function formatList({
  value,
  locale,
  options
}: FormatListProps): ReturnType<Intl.ListFormat['format']> {
  const formatter = new Intl.ListFormat(locale, options)

  return formatter.format(value)
}
