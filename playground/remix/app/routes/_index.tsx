'use client'

import type { MetaFunction } from '@remix-run/node'
import { Suspense } from 'react'
import { setLocale, tx } from '../reword'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

export default function Index() {
  return (
    <Suspense fallback={<span>{'Loading...'}</span>}>
      <div>
        <div className='messages'>
          <p>{tx`Hello world!`}</p>
          <p>{tx`Another hello world!`}</p>
          <p>{tx`This is a sample message to show the capabilities of Reword`}</p>
          <p>{tx`This is a message for Andrea: do not be so bossy!`}</p>
          <p>{tx`We are going for shopping now to buy some very cool t-shirts!`}</p>
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
