// Dependencies
import { input, select } from '@inquirer/prompts'
import { logger } from '@rewordlabs/logger'
import { findConfig, setupConfig, setupTemplate } from '@rewordlabs/node'
import { outdent } from 'outdent'
import getPackageManager from 'preferred-pm'

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
    .option('-f, --force', 'Force overwrite existing config files')
    .option('-s, --silent', 'Suppress all messages except errors')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(initCmd)
}

export async function initCmd({ cwd, force, silent }: InitOptions) {
  if (silent) logger.level = 'silent'

  const configFile = findConfig({ cwd })
  const pmResult = await getPackageManager(cwd)
  const pm = pmResult?.name ?? 'npm'
  const cmd = pm === 'npm' ? 'npm run' : pm

  if (configFile && !force) {
    return logger.warn(
      'init:setup',
      outdent`
        It looks like you already have reword created.
        You can now run '${cmd} reword extract --watch'.
      `
    )
  }

  const projectLocale = (await input({
    message: 'What locale do you use for development?',
    default: 'en'
  })) as Locale

  const outDir = await input({
    message: 'Where do you want to place your generated files?',
    default: './locale'
  })

  const framework = (await select({
    message: 'Are you using any framework?',
    choices: [
      {
        name: 'No',
        value: null
      },
      {
        name: 'Next',
        value: 'next'
      },
      {
        name: 'Vite',
        value: 'vite'
      }
    ]
  })) as 'next' | 'vite'

  const done = logger.time.info('🔥 Reword initialized')

  await setupConfig({ cwd, projectLocale, outDir })

  if (framework) {
    await setupTemplate({ cwd, outDir, framework })
  }

  done()

  logger.log(`🚀 You are set up to start using Reword! Thanks for choosing it.`)
}
