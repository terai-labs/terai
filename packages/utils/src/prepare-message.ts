import { DATE_REGEX, NUMBER_REGEX, TEXT_REGEX } from './regex'

export function prepareMessage(message: string): string {
  const cleanedMessage = message
    .replaceAll(/`/g, "'")
    .replaceAll(/"/g, "'")
    .replaceAll(TEXT_REGEX, '!${VAR}')
    .replaceAll(DATE_REGEX, '@${VAR}')
    .replaceAll(NUMBER_REGEX, '#${VAR}')

  return cleanedMessage
}
