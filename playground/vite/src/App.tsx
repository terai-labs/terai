import { setLocale, tx, useFormat } from './reword'
import { Suspense, useState } from 'react'
import { Button } from './button'

export default function App() {
  const format = useFormat()
  const [state, setState] = useState(false)
  const a = tx`Car`
  const b = tx`Moto`
  const c = tx`Bike`

  function getLanguage(locale: string) {
    return format.displayName(locale, { type: 'language' })
  }

  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div>
        <div className='messages'>
          <p>{tx`Hello`}</p>
          <p>{tx`I am ${[new Date(), 'date']}!`}</p>
          <p>{tx`I'm  sure what is this`}</p>
          <p>{tx`${[[a, b, c], 'list']}`}</p>

          <button onClick={() => setState(prev => !prev)}>Show</button>
        </div>

        <div className={'buttons'}>
          {['en', 'es', 'it'].map(locale => (
            <button onClick={() => setLocale(locale)}>
              {getLanguage(locale)}
            </button>
          ))}
        </div>
      </div>

      {state && <Button />}
    </Suspense>
  )
}
