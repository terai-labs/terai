import { changeLocale, tx } from '../locale/client'
import { Suspense } from 'react'

export default function App() {
  const name = 'Reword'

  return (
    <Suspense fallback={<h1>{'Loading...'}</h1>}>
      <div>
        <h1>{tx({
          components: {
            Custom: children => <h1>{children}</h1>,
            i: children => <code>{children}</code>
          }
        })`Hi ${name}, this is is a dem s sso <Custom><i>sdf</i></Custom> with React!`}</h1>

        <div className={'buttons'}>
          <button onClick={() => changeLocale('es')}>ES</button>
          <button onClick={() => changeLocale('en')}>EN</button>
          <button onClick={() => changeLocale('it')}>IT</button>
        </div>
      </div>
    </Suspense>
  )
}
