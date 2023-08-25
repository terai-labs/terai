import { setupRosetta } from '@rosetta.js/react/server'

export const { tx } = await setupRosetta({
  locale: 'en',
  dictionaries: {
    en: () => import('../../locale/en.js'),
    es: () => import('../../locale/es.js')
  }
})

export default async function Home() {
  const name = 'Hugo'

  return (
    <div>
      <p>{tx`Hello, !${name}!`}</p>
      <p>{tx`You haven't checked you email since @${new Date()}`}</p>
      <p>{tx`You got #${10000} messages in your mail inbox`}</p>
    </div>
  )
}
