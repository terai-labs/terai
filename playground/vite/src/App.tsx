import { setLocale, tx, useFormat } from './reword'
import { Suspense } from 'react'

export default function App() {
  const format = useFormat()

  function getLanguage(locale: string) {
    return format.displayName(locale, { type: 'language' })
  }

  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div>
        <div className='messages'>
          <p>{tx({ chunkId: 'test' })`Hello world!`}</p>
          <p>{tx({ chunkId: 'test' })`I am on ${[new Date(), 'date']}!`}</p>
          <p>{tx`I'm not sure what is this`}</p>
        </div>

        <div className={'buttons'}>
          {['en', 'es', 'it'].map(locale => (
            <button onClick={() => setLocale(locale)}>
              {getLanguage(locale)}
            </button>
          ))}
        </div>
      </div>
    </Suspense>
  )
}
