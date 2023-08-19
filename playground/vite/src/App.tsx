// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { getRosseta } from '@rosetta.js/react'
import './App.css'

const r = getRosseta({
  locale: 'en',
  locales: {
    es: () => import('./locale/es.ts'),
    en: () => import('./locale/en.ts')
  }
})

const work = r.tx({ defaultMessage: 'Another message yohoo!' })

function App() {
  return (
    <div>
      <button onClick={() => r.changeLocale('es')}>
        {r.tx({ defaultMessage: 'woh woh woh' })}
      </button>
      <p>{r.tx({ defaultMessage: 'This is my name' })}</p>
      <p>{work}</p>
    </div>
  )
}

export default App
