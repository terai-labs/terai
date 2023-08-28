import { setupRosetta } from '@rosetta.js/react'
import { useState } from 'react'

const { tx, useChangeLocale } = setupRosetta({
  locale: 'en',
  dictionaries: {
    en: () => import('../locale/en.ts'),
    es: () => import('../locale/es.ts'),
    it: () => import('../locale/it.ts')
  }
})

export default function App() {
  const changeLocale = useChangeLocale()
  const [state, setState] = useState(0)

  return (
    <div>
      <p>{tx`hola`}</p>

      <div className={'buttons'}>
        <button onClick={() => changeLocale('es')}>ES</button>
        <button onClick={() => changeLocale('en')}>EN</button>
        <button onClick={() => changeLocale('it')}>IT</button>
        <button onClick={() => setState(stae => stae + 1)}>{state}</button>
      </div>
    </div>
  )
}
