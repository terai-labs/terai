import { changeLocale, tx } from '../locale/client'
import { Suspense, useState } from 'react'

export default function App() {
  const date = new Date()
  const [count, setCount] = useState(0)

  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div>
        <span>{tx`Hello world!`}</span>

        <div className={'buttons'}>
          <button onClick={() => changeLocale('es')}>ES</button>
          <button onClick={() => changeLocale('en')}>EN</button>
          <button onClick={() => changeLocale('it')}>IT</button>
        </div>
      </div>

      <div>
        <span>{count}</span>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    </Suspense>
  )
}
