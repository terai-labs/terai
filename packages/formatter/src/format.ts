import type { Locale } from '@rosetta.js/types'
import { formatDate } from './date'
import { formatNumber } from './number'
/*    tx('woh woh woh')     */
/*    tx('My name is ${name}', { name: "Hugo" })     */
/*    tx('Quedamos a las @{time}', { time: new Date() })     */
/*    tx('I won #{money} in the lottery', { money: 10000 })     */

const formatText = (template: string) => template

export function format(locale: Locale, message: string) {
  return message.replace(/\${(.*?)}/g, (ey, template) => {
    console.log(ey, template)
    if (template.startsWith('@')) {
      const dateTemplate = template.slice(1)

      return formatDate(eval(dateTemplate)) // Using eval here, be cautious with user input
    } else if (template.startsWith('#')) {
      const numberTemplate = template.slice(1)

      return formatNumber(eval(numberTemplate)) // Using eval here, be cautious with user input
    } else {
      return formatText(template)
    }
  })
}

/*
Extracted message
`This is my name: ${var}, and I got this money: #${var}, when: @${var}`

Id: generated from extracted message

tx
Access to runtime vars
Replace message for dictionary locale
Replace runtime vars
*/
