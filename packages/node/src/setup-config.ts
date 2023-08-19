// Dependencies
import { findConfig } from './find-config'
import { findTsConfig } from './find-tsconfig'
import { logger } from '@rosetta.js/logger'
import { outdent } from 'outdent'
import { runtime } from './runtime'
import getPackageManager from 'preferred-pm'
import type { Config } from '@rosetta.js/types'

type SetupOptions = Pick<Config, 'outExtension' | 'baseLocale'> & {
  force?: boolean
  cwd: string
}

export async function setupConfig({
  force,
  outExtension,
  baseLocale = 'en',
  cwd
}: SetupOptions) {
  const configFile = findConfig({ cwd })
  const pmResult = await getPackageManager(cwd)
  const pm = pmResult?.name ?? 'npm'
  const cmd = pm === 'npm' ? 'npm run' : pm
  const isTs = findTsConfig()
  const fileName = isTs ? 'rosetta.config.ts' : 'rosetta.config.mjs'

  logger.info('init:config', `creating rosetta config file: ${fileName}`)

  if (!force && configFile) {
    logger.warn(
      'init:config',
      outdent`
        It looks like you already have rosetta created\`.
        You can now run '${cmd} rosetta --watch'.
      `
    )
  } else {
    const content = outdent`
      import { defineConfig } from "@rosetta.js/dev"

      export default defineConfig({
        // Where to look for your locale declarations
        include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

        // Files to exclude
        exclude: [],

        // The base locale used in your project
        baseLocale: "${baseLocale}",

        // The output directory for your locale system
        outDir: "locale",

        // The extension for the emitted JavaScript files
        outExtension: "${outExtension || isTs ? '.ts' : '.js'}",
      })
    `

    runtime.fs.write(runtime.path.join(cwd, fileName), content)

    logger.log(outdent`
      🚀 Thanks for choosing Rosetta.
      You are set up to start using it!
    `)
  }
}
