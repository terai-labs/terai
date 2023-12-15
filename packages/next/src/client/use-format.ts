'use client'

import { createFormat } from '@terai/formatter'
import { useLocale } from './use-locale'

export const useFormat = createFormat(useLocale)
