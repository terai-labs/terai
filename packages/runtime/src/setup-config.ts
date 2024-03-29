// Dependencies
import { findTsConfig } from './find-tsconfig'
import { logger } from '@terai/logger'
import { outdent } from 'outdent'
import { runtime } from './runtime'

// Types
import type { Config } from '@terai/types'

type SetupOptions = Pick<Config, 'projectLocale' | 'outDir'> & {
	cwd: string
}

export async function setupConfig({
	projectLocale,
	outDir,
	cwd
}: SetupOptions) {
	const isTs = findTsConfig()
	const fileName = isTs ? 'terai.config.ts' : 'terai.config.mjs'

	logger.info('init:setup', 'Setting config file...')

	const content = outdent`
      import { defineConfig, createKoiTranslator } from "@terai/dev"

      const translator = createKoiTranslator({
        apiKey: '' // Your API key
      })

      export default defineConfig({
        // List of files glob to to look for your locale declarations
        include: ["./src/**/*.{js,jsx,ts,tsx}"],

        // Files to exclude
        exclude: [],
        
        // The base locale used in your project
        projectLocale: "${projectLocale}",
        
        // The aditional locales you want to support
        outLocales: [],
        
        // The output directory for your locale system
        outDir: "${outDir}",

        // The translator for your messages
        translator,
      })
    `

	runtime.fs.write(runtime.path.join(cwd, fileName), content)
}
