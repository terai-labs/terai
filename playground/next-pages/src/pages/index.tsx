import { setupReword } from '@rewordlabs/react/client'

const { tx, useChangeLocale } = setupReword({
  locale: 'en',
  dictionaries: {
    en: () => import('../../locale/en.js'),
    de: () => import('../../locale/de.js'),
    da: () => import('../../locale/da_DK.js')
  }
})

export default function Home() {
  const changeLocale = useChangeLocale()
  const name = 'Hugo'

  return (
    <div>
      <p>{tx`Hello, !${name}!`}</p>
      <p>{tx`You haven't checked you email since @${new Date()}`}</p>
      <p>{tx`You got #${10000} messages in your mail inbox`}</p>

      <div className={'buttons'}>
        <button onClick={() => changeLocale('de')}>DE</button>
        <button onClick={() => changeLocale('en')}>EN</button>
        <button onClick={() => changeLocale('da')}>DA</button>
      </div>
    </div>
  )
}
