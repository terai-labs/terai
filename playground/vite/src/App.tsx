import { setLocale, tx } from './reword'
import { Suspense } from 'react'

const a = tx`I am doing a demo`

export default function App() {
  console.log(a)

  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div>
        <div className='messages'>
          <p>{tx({ chunkId: 'test' })`Hello world!`}</p>
          <p>{tx`I am doing a show of the ${[
            'US',
            'display-name',
            { type: 'language' }
          ]} I am creating!`}</p>
        </div>

        <div className={'buttons'}>
          <button onClick={() => setLocale('es')}>{tx`${[
            'es',
            'display-name',
            { type: 'language' }
          ]}`}</button>
          <button onClick={() => setLocale('en')}>{tx`${[
            'en',
            'display-name',
            { type: 'language' }
          ]}`}</button>
          <button onClick={() => setLocale('it')}>{tx`${[
            'it',
            'display-name',
            { type: 'language' }
          ]}`}</button>
        </div>
      </div>
    </Suspense>
  )
}
