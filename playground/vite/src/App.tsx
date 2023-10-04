import { tx } from './reword'
import { Suspense } from 'react'

export default function App() {
  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div>
        <div className='messages'>
          <p>{tx`Testing translators!`}</p>
          <p>{tx`Hello`}</p>
          <p>{tx`I am ${[new Date(), 'date']}!`}</p>
          <p>{tx`I'm  sure what is this`}</p>
        </div>

        {/* <div className={'buttons'}>
          {['en', 'es', 'it'].map(locale => (
            <button key={locale} onClick={() => setLocale(locale)}>
              {getLanguage(locale)}
            </button>
          ))}
        </div> */}
      </div>
    </Suspense>
  )
}
