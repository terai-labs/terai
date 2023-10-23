// Dependencies
import { findConfig, setupConfig, setupTemplate } from '@koi18n/runtime'
import { input, select } from '@inquirer/prompts'
import { logger } from '@koi18n/logger'
import { outdent } from 'outdent'
import getPackageManager from 'preferred-pm'

// Types
import type { Config, Locale } from '@koi18n/types'
import type { CAC } from 'cac'

export type InitOptions = Pick<Config, 'projectLocale'> & {
  cwd: string
  force?: boolean
}

export function createInitCommand(cli: CAC, cwd: string) {
  return cli
    .command('init', 'Initialize config file')
    .option('-f, --force', 'Force overwrite existing config files')
    .option('--cwd <cwd>', 'Current working directory', { default: cwd })
    .action(initCmd)
}

export async function initCmd({ cwd, force }: InitOptions) {
  logger.heading('init', 'Initialize config file')
  const configFile = findConfig({ cwd })
  const pmResult = await getPackageManager(cwd)
  const pm = pmResult?.name ?? 'npm'
  const cmd = pm === 'npm' ? 'npm run' : pm

  if (configFile && !force) {
    return logger.log(
      outdent`
        It looks like you already have koi18n created.
        You can now run ${logger.colors.cyan(`'${cmd} koi18n extract --watch'`)}
      `
    )
  }

  const projectLocale = (await input({
    message: 'What locale do you use for development?',
    default: 'en'
  })) as Locale

  const outDir = await input({
    message: 'Where do you want to place your generated files?',
    default: './i18n'
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

  const done = logger.time.success()

  await setupConfig({ cwd, projectLocale, outDir })

  if (framework) {
    await setupTemplate({ cwd, outDir, framework })
  }

  done('Config file created')

  logger.log(`🚀 You are set up to start using koi18n! Thanks for choosing it.`)
}
