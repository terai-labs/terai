import { memo } from './memo'

export const prepareMessage = memo((message: string) => {
  return message.replaceAll(/\$\{[^}]*}/g, '${var}')
  // .replaceAll(/\s+/g, ' ')
  // .replaceAll(/`|\n|\t|\b|\v/g, '')
  // .replaceAll('${var}}', '${var}')
  // .replaceAll('${var} ]}', '${var}')
})
