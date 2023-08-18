// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { getRosseta } from '@rosetta.js/react'
import './App.css'

const r = getRosseta({
  locale: 'es',
  locales: {
    es: () => import('./locale/es.ts')
  }
})

const work = r.tx({ defaultMessage: 'Another message yohoo!' })

function App() {
  return (
    <div>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          {r.tx({ defaultMessage: 'This is my name' })}
        </a>
        <a href='https://react.dev' target='_blank'>
          {work}
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button>{r.tx({ defaultMessage: 'woh woh woh' })}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
