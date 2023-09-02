import { setupRosetta } from '@rosetta.js/react/client'
import { useState } from 'react'

const { tx, changeLocale } = setupRosetta({
  locale: 'en',
  dictionaries: {
    en: () => import('../locale/en.ts'),
    es: () => import('../locale/es.ts'),
    it: () => import('../locale/it.ts')
  }
})

export default function App() {
  return (
    <div>
      <Another />
      <Example />
      <Third />
    </div>
  )
}
export function Another() {
  const [state, setState] = useState(0)
  const name = 'Hugo'

  return (
    <div>
      <p>{'Hoola'}</p>
      <p>{tx`Hello, ${name}!`}</p>

      <div className={'buttons'}>
        <button onClick={() => changeLocale('es')}>ES</button>
        <button onClick={() => changeLocale('en')}>EN</button>
        <button onClick={() => changeLocale('it')}>IT</button>
        <button onClick={() => setState(stae => stae + 1)}>{state}</button>
      </div>
    </div>
  )
}

function Example() {
  return (
    <div>
      <p>{'Hoola'}</p>

      <div className={'buttons'}>
        <button onClick={() => changeLocale('es')}>ES</button>
        <button onClick={() => changeLocale('en')}>EN</button>
        <button onClick={() => changeLocale('it')}>IT</button>
      </div>
    </div>
  )
}

function Third() {
  return (
    <div>
      <p>{tx`This is a test!`}</p>
      <p>{'This should not render'}</p>
    </div>
  )
}
