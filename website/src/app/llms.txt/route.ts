import { source } from '@/lib/source'

export const revalidate = false

export async function GET() {
	const pages = source.getPages()

	const baseUrl = 'https://terai-labs.github.io/terai'

	const sections = pages.map((page) => {
		const url = `${baseUrl}/docs/${page.slugs.join('/')}`
		return `- [${page.data.title}](${url}): ${page.data.description || ''}`
	})

	const content = `# Terai

> Modern localization (i18n) framework for JavaScript/TypeScript

Terai is a developer-first open-source i18n framework that uses a simple workflow: Develop → Extract → Translate. It uses tagged template literals for translations and automatically extracts messages from your code.

## Key Features

- Tagged template translation: \`ts\`Hello \${name}\`\`
- Static message extraction from source code
- Multiple translation providers (ChatGPT, DeepL, Google Cloud, AWS, Azure)
- Code splitting support with chunk IDs
- React 19 Suspense integration
- Automatic dictionary caching

## Quick Start

\`\`\`bash
pnpm add -D @terai/dev
pnpm add @terai/react
pnpm terai init
\`\`\`

\`\`\`typescript
import { useTs } from '@terai/react'

function App() {
  const { ts } = useTs()
  return <p>{ts\`Hello, world!\`}</p>
}
\`\`\`

## Documentation

${sections.join('\n')}

## Links

- Website: ${baseUrl}
- GitHub: https://github.com/terai-labs/terai
- npm: https://www.npmjs.com/org/terai
- Full documentation for LLMs: ${baseUrl}/llms-full.txt
`

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	})
}
