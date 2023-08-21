// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { setupRosetta } from '@rosetta.js/react'

const { tx, useChangeLocale } = setupRosetta({
  locale: 'en',
  dictionaries: {
    es: () => import('../locale/es.ts'),
    en: () => import('../locale/en.ts')
  }
})

export default function App() {
  const name = 'Hugo'
  const changeLocale = useChangeLocale()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100dvh'
      }}
    >
      <p>
        {tx`This is my name: !${name}, and I got this money: #${10000}, when: @${new Date()}`}
      </p>
      <p>{tx`This is another freaking message: !${name} here!`}</p>
      <p>{tx`Rosetta can translate anything`}</p>

      <div>
        <button onClick={() => changeLocale('es')}>ES</button>
        <button onClick={() => changeLocale('en')}>EN</button>
      </div>
    </div>
  )
}
