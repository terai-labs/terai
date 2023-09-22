import { memo } from './memo'

export const prepareMessage = memo((message: string) => {
  return message
    .replaceAll(/\s+/g, ' ')
    .replaceAll(/`|\n|\t|\b|\v/g, '')
    .replaceAll(/\$\{[^}]*}/g, '${var}')
    .replaceAll('${var}}', '${var}')
    .replaceAll('${var} ]}', '${var}')
})
