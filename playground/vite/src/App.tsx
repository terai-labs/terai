import { changeLocale, tx } from '../locale/client'
import { Suspense } from 'react'

export default function App() {
  const name = 'Reword'

  return (
    <Suspense fallback={<h1>{'Loading...'}</h1>}>
      <div>
        <h1>{tx({
          format: {
            date: {
              calendar: 'long',
              dateStyle: 'long'
            }
          }
        })`Hi ${name}, with React at ${new Date()}!`}</h1>

        <div className={'buttons'}>
          <button onClick={() => changeLocale('es')}>ES</button>
          <button onClick={() => changeLocale('en')}>EN</button>
          <button onClick={() => changeLocale('it')}>IT</button>
        </div>
      </div>
    </Suspense>
  )
}
