import { createFormat } from '@koi18n/formatter'
import { useLocale } from './use-locale'

export const useFormat = createFormat(useLocale)
