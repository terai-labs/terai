// Dependencies
import { findConfig, setupConfig } from '@terai/runtime'
import { input } from '@inquirer/prompts'
import { logger } from '@terai/logger'
import { outdent } from 'outdent'
import getPackageManager from 'preferred-pm'

// Types
import type { Config, Locale } from '@terai/types'
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
        It looks like you already have a config file created.
        You can now run ${logger.colors.cyan(`'${cmd} terai extract --watch'`)}
      `
		)
	}

	const projectLocale = (await input({
		message: 'What locale do you use in your project messages?',
		default: 'en-US',
		validate: (value: string) => {
			if (value.trim().length === 0) {
				return 'Please provide a valid locale'
			}
			return true
		}
	})) as Locale

	const outLocales = (await input({
		message: 'What locales do you want to support? (comma separated)',
		default: 'fr-FR,es-ES,de-DE',
		validate: (value: string) => {
			if (value.trim().length === 0) {
				return 'Please provide at least one locale'
			}
			return true
		},
		transformer: (value: string) => {
			return value
				.split(',')
				.map((locale) => locale.trim())
				.join(',')
		}
	})) as Locale

	const outDir = await input({
		message: 'Where do you want to place your generated files?',
		default: './locale'
	})

	const done = logger.time.success()

	await setupConfig({
		cwd,
		projectLocale,
		outDir,
		outLocales: outLocales.split(',')
	})

	done('Config file created')

	logger.log('🚀 You are set up to start using Terai! Thanks for choosing it.')
}
