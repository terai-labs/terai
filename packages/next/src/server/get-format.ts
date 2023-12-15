import { createFormat } from '@terai/formatter'
import { getLocale } from './get-locale'

export const getFormat = createFormat(getLocale)
