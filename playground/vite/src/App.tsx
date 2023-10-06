import { ts } from './tsmu'
import { Suspense } from 'react'

export default function App() {
  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div>
        <div className='messages'>
          <p>{ts`Testing translators!`}</p>
          <p>{ts`Hello`}</p>
          <p>{ts`I am ${[new Date(), 'date']}!`}</p>
          <p>{ts`I'm  sure what is this`}</p>
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
