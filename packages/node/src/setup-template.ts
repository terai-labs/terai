// Dependencies
import { findTsConfig } from './find-tsconfig'
import { logger } from '@rewordlabs/logger'
import { outdent } from 'outdent'
import { runtime } from './runtime'

// Types
import type { Config } from '@rewordlabs/types'

type SetupOptions = Pick<Config, 'outDir'> & {
  cwd: string
  framework: 'next' | 'vite'
}

export async function setupTemplate({ outDir, cwd, framework }: SetupOptions) {
  const templateFiles = getTemplate(framework)
  logger.info('init:setup', `Setting up files...`)

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
        import { setupReword } from '@rewordlabs/react/client'

        export const reword = setupReword({
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
  if (framework === 'next') {
    return [
      {
        fileName: `client.${isTs ? 'ts' : 'js'}`,
        content: outdent`
        import { setupClient } from '@rewordlabs/next'

        export const { tx } = setupClient({
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
        import { setupServer } from '@rewordlabs/next'

        export const { tx } = setupServer({
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
        import { setupReword } from '@rewordlabs/react/client'

        export const reword = setupReword({
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
