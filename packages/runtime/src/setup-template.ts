// Dependencies
import { findTsConfig } from './find-tsconfig'
import { logger } from '@terai/logger'
import { outdent } from 'outdent'
import { runtime } from './runtime'

// Types
import type { Config } from '@terai/types'

type SetupOptions = Pick<Config, 'outDir'> & {
	cwd: string
	framework: 'next' | 'vite'
}

export async function setupTemplate({ outDir, cwd, framework }: SetupOptions) {
	const templateFiles = getTemplate(framework)
	logger.info('init:setup', 'Setting up files...')

	templateFiles.forEach(({ fileName, content }) => {
		runtime.fs.write(runtime.path.join(cwd, outDir, fileName), content)
	})
}

function getTemplate(
	framework: SetupOptions['framework']
): { fileName: string; content: string }[] {
	const isTs = findTsConfig()

	if (framework === 'vite') {
		return [
			{
				fileName: `client.${isTs ? 'ts' : 'js'}`,
				content: outdent`
        import { setupClient } from '@terai/vite'

        export const { useTs, setLocale, useFormat } = setupClient({
          defaultLocale: 'en',
          persist: true,
          loader: (locale: string, chunkId: string) =>
            fetch(\`./locale/\${locale}/\${chunkId}.json\`, { cache: 'no-cache' }).then(
              res => res.json()
            )
        })

        `
			}
		]
	}

	if (framework === 'next') {
		return [
			{
				fileName: `client.${isTs ? 'ts' : 'js'}`,
				content: outdent`
        import { setupClient } from '@terai/next'

        export const { ts } = setupClient({
          locale: 'en',
          loader: (locale: string, id: string) =>
            fetch(\`./locale/\${locale}/\${id}.json\`)
              .then(res => res.json())
              .then(msg => msg[id]),
        })
        `
			},
			{
				fileName: `server.${isTs ? 'ts' : 'js'}`,
				content: outdent`
        import { setupServer } from '@terai/next'

        export const { ts } = setupServer({
          loader: (locale: string, id: string) =>
            import(\`./locale/\${locale}/\${id}.json\`)
              .then(mod => mod.default[id]),
        })
        `
			}
		]
	}

	return [
		{
			fileName: `client.${isTs ? 'ts' : 'js'}`,
			content: outdent`
        import { setupReword } from '@terai/react/client'

        export const terai = setupReword({
          locale: 'en',
          loader: (locale: string, id: string) =>
            fetch(\`./locale/\${locale}/\${id}.json\`)
              .then(res => res.json())
              .then(msg => msg[id]),
        })
        `
		}
	]
}
