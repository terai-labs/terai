import { changeLocale, tx } from '../locale/client'
import { Suspense } from 'react'

export default function App() {
  const name = 'Reword'

  return (
    <Suspense fallback={<h1>{'Loading...'}</h1>}>
      <div>
        <h1>{tx({
          context: 'react'
        })`Hi ${name}, this is is a dem s sso <strong><i>sdf</i></strong> with React!`}</h1>

        <div className={'buttons'}>
          <button onClick={() => changeLocale('es')}>ES</button>
          <button onClick={() => changeLocale('en')}>EN</button>
          <button onClick={() => changeLocale('it')}>IT</button>
        </div>
      </div>
    </Suspense>
  )
}
