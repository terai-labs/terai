import { setLocale, ts, useFormat } from './tsmu'
import { Suspense, useState } from 'react'
import { Button } from './button'

export default function App() {
  const format = useFormat()
  const [state, setState] = useState(false)

  function getLanguage(locale: string) {
    return format.displayName(locale, { type: 'language' })
  }

  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div>
        <div className='messages'>
          <p>{ts`Testing translators!`}</p>
          <p>{ts`Hello`}</p>
          <p>{ts`I am ${[new Date(), 'date']}!`}</p>
          <p>{ts`I'm  sure what is this`}</p>

          <button onClick={() => setState(prev => !prev)}>Show</button>
        </div>

        <div className={'buttons'}>
          {['en', 'es', 'it'].map(locale => (
            <button key={locale} onClick={() => setLocale(locale)}>
              {getLanguage(locale)}
            </button>
          ))}
        </div>
      </div>

      {state && <Button />}
    </Suspense>
  )
}
