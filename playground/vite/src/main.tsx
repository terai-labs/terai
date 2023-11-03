import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setup } from '@koi18n/react'

setup({
  defaultLocale: 'en',
  persist: true,
  loader: (locale: string, id: string) =>
    import(`../locale-system/${locale}/${id}.json`)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<h1>{'Loading...'}</h1>}>
      <App />
    </Suspense>
  </React.StrictMode>
)
