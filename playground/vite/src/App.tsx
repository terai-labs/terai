import { setLocale, tx } from './reword'
import { Suspense } from 'react'

export default function App() {
  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div>
        <div className='messages'>
          <p>{tx({ chunkId: 'test' })`Hello world!`}</p>
          <p>{tx`I am doing a show of the ${[
            ['-1', 'day'],
            { format: 'relative-time' }
          ]} I am creating!`}</p>
        </div>

        <div className={'buttons'}>
          <button onClick={() => setLocale('es')}>{tx`Spanish`}</button>
          <button onClick={() => setLocale('en')}>{tx`English`}</button>
          <button onClick={() => setLocale('it')}>{tx`Italian`}</button>
        </div>
      </div>
    </Suspense>
  )
}
