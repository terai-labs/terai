import process from 'node:process'
import chalk from 'chalk'
import pkg from '@rewordlabs/dev/package.json'

function log(message: string) {
  return process.stdout.write(message + '\n')
}

function logError(message: string) {
  return process.stderr.write(message + '\n')
}

function logBullet(
  logger: typeof log | typeof logError,
  colorizePrefix: <V>(v: V) => V,
  colorizeText: <V>(v: V) => V,
  symbol: string,
  prefix: string,
  text?: string | string[]
) {
  const textParts = Array.isArray(text) ? text : [text || ''].filter(Boolean)
  const formattedText = textParts
    .map(textPart => colorizeText(textPart))
    .join('')

  logger(
    `${' '.repeat(3)} ${colorizePrefix(symbol)}  ${colorizePrefix(
      prefix
    )} ${formattedText}`
  )
}

function warn(prefix: string, text?: string | string[]) {
  logBullet(log, chalk.yellow, chalk.yellow, '●', prefix, text)
}

function debug(prefix: string, text?: string | string[]) {
  logBullet(log, chalk.yellow, chalk.dim, '●', prefix, text)
}

function info(prefix: string, text?: string | string[]) {
  logBullet(log, chalk.cyan, chalk.dim, '◼', prefix, text)
}

function success(text: string) {
  logBullet(log, chalk.green, chalk.dim, '✔', text)
}

function error(prefix: string, text?: string | string[]) {
  log('')
  logBullet(logError, chalk.red, chalk.red, '▲', prefix, text)
}

function heading(heading: string, description?: string) {
  return log(
    `\n${chalk.bgWhite(` ${chalk.whiteBright(heading)} `)} ${chalk.bold(
      description
    )}\n`
  )
}

const timing = (fn: (str: string) => any) => () => {
  const start = performance.now()
  return (msg: string) => {
    const end = performance.now()
    const ms = end - start
    fn(`${msg} ${chalk.gray(`(${ms.toFixed(2)}ms)`)}`)
  }
}

export const logger = {
  colors: chalk,
  log,
  heading,
  debug,
  info,
  warn,
  success,
  error,
  time: {
    success: timing(success),
    info: timing(info),
    debug: timing(debug)
  }
}
