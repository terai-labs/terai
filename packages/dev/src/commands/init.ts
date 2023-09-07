// Dependencies
import { input } from '@inquirer/prompts'
import { logger } from '@rewordlabs/logger'
import { setupConfig } from '@rewordlabs/node'
import { outdent } from 'outdent'

// Types
import type { Config, Locale } from '@rewordlabs/types'
import type { CAC } from 'cac'

export type InitOptions = Pick<Config, 'projectLocale'> & {
  cwd: string
  force?: boolean
  silent?: boolean
}

export function createInitCommand(cli: CAC, cwd: string) {
  return cli
    .command('init', "Initialize Reword's config file")
    .option('-f, --force', 'Force overwrite existing config file')
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(initCmd)
}

export async function initCmd(options: InitOptions) {
  if (options.silent) logger.level = 'silent'

  const projectLocale = (await input({
    message: 'What locale do you use for development?',
    default: 'en'
  })) as Locale
  const locales = (await input({
    message: 'What locales will you be using? (e.g: fr,de)',
    default: ''
  }).then(res => res.replaceAll(' ', '').split(','))) as Locale[]
  const outDir = await input({
    message: 'Where do you want to place your generated files?',
    default: './locale'
  })

  const done = logger.time.info('🔥 Reword initialized')
  await setupConfig({ ...options, projectLocale, locales, outDir })

  done()

  logger.log(outdent`
      Thanks for choosing Reword.
      🚀 You are set up to start using it!
    `)
}
