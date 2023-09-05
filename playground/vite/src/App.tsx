import { setupReword } from '@rewordlabs/react/client'
import { useState } from 'react'

const { tx, changeLocale } = setupReword({
  locale: 'en',
  dictionaries: {
    en: () => import('../locale/en.ts'),
    es: () => import('../locale/es.ts'),
    it: () => import('../locale/it.ts')
  }
})

export default function App() {
  const name = 'Reword'
  return (
    <div>
      <p>{tx`Hello, ${name}!`}</p>

      <div className={'buttons'}>
        <button onClick={() => changeLocale('es')}>ES</button>
        <button onClick={() => changeLocale('en')}>EN</button>
        <button onClick={() => changeLocale('it')}>IT</button>
      </div>
    </div>
  )
}
