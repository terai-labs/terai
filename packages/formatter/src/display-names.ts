// Types
import type { Locale } from '@koi18n/types'

export type FormatDisplayNameOptions = Intl.DisplayNamesOptions

export type FormatDisplayNameProps = {
  value: Parameters<Intl.DisplayNames['of']>[0]
  locale: Locale
  options: FormatDisplayNameOptions
}

export function formatDisplayName({
  value,
  locale,
  options
}: FormatDisplayNameProps): ReturnType<Intl.DisplayNames['of']> {
  const formatter = new Intl.DisplayNames(locale, options)

  return formatter.of(value)
}
