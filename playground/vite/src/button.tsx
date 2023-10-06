import { ts, useChunk } from './tsmu'
import { Suspense } from 'react'

export function Button() {
  useChunk('button')

  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div className='messages'>
        <p>{ts`Hello`}</p>
        <p>{ts`I am on ${[new Date(), 'date']}!`}</p>
        <p>{ts`I'm not sure what is this`}</p>
      </div>
    </Suspense>
  )
}
