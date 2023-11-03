import { createFormat } from '@koi18n/formatter'
import { getLocale } from './get-locale'

export const getFormat = createFormat(getLocale)
