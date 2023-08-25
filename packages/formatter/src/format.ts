// @ts-nocheck

import type { Locale, MessageVariables } from '@rosetta.js/types'
import { formatDate } from './date'
import { formatNumber } from './number'

const formatText = (template: string) => template

export function format(locale: Locale, message: string, values: MessageVariables[]) {
  let index = 0
  return message.replace(/(!|@|#)\${(\w+)}/g, (_, type) => {
    const value = values[index]
    index++
    switch (type) {
      case '!':
        return formatText(value)
      case '@':
        return formatDate({ value, locale })
      case '#':
        return formatNumber({ value, locale })
      default:
        return ''
    }
  })
}
