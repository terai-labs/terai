// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { setupRosetta } from '@rosetta.js/react'

const { tx } = setupRosetta({
  locale: 'en',
  dictionaries: {
    // es: () => import('./locale/es.ts'),
    en: () => import('../locale/en.ts')
  }
})

export default function App() {
  return (
    <div>
      <p>
        {tx(
          'This is my name: ${name}, and I got this money: #${10000}, when: @${new Date()}'
        )}
      </p>
    </div>
  )
}
