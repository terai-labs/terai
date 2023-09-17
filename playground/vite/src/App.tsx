import { changeLocale, tx } from './reword'
import { Suspense } from 'react'

export default function App() {
  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div>
        <div className='messages'>
          <p>{tx`Hello world!`}</p>
          <p>{tx`Another hello world!`}</p>
          <p>{tx`And another hello world!`}</p>
          <p>{tx`This is a sample message to show the capabilities of Reword`}</p>
          <p>{tx`This is a message for Andrea: do not be so bossy!`}</p>
          <p>{tx`We are going or shopping now to buy some very cool t-shirts!`}</p>
        </div>

        <div className={'buttons'}>
          <button onClick={() => changeLocale('es')}>{tx`Spanish`}</button>
          <button onClick={() => changeLocale('en')}>{tx`English`}</button>
          <button onClick={() => changeLocale('it')}>{tx`Italian`}</button>
        </div>
      </div>
    </Suspense>
  )
}
