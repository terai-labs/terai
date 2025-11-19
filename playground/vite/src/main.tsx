import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupTerai } from '@terai/react'

setupTerai({
	defaultLocale: 'en',
	loader: (locale: string, chunkId: string) =>
		import(`../locale/${locale}/${chunkId}.json`).then((mod) => mod.default)
})

const rootNode = document.getElementById('root')

if (rootNode) {
	ReactDOM.createRoot(rootNode).render(
		<React.StrictMode>
			<Suspense fallback={<h1>{'Loading...'}</h1>}>
				<App />
			</Suspense>
		</React.StrictMode>
	)
}
