// Dependencies
import { findTsConfig } from './find-tsconfig'
import { logger } from '@terai/logger'
import { outdent } from 'outdent'
import { runtime } from './runtime'

// Types
import type { Config } from '@terai/types'

type SetupOptions = Pick<Config, 'projectLocale' | 'outDir' | 'outLocales'> & {
	cwd: string
}

export async function setupConfig({
	projectLocale,
	outDir,
	outLocales,
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
        include: ["./src/**/*.{js,jsx,ts,tsx}"],
        exclude: [],
        projectLocale: "${projectLocale}",
        outLocales: ${outLocales},
        outDir: "${outDir}",
        translator,
      })
    `

	runtime.fs.write(runtime.path.join(cwd, fileName), content)
}
