import { tx, useChunk } from './reword'
import { Suspense } from 'react'

export function Button() {
  useChunk('button')

  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div className='messages'>
        <p>{tx`Hello`}</p>
        <p>{tx`I am on ${[new Date(), 'date']}!`}</p>
        <p>{tx`I'm not sure what is this`}</p>
      </div>
    </Suspense>
  )
}
