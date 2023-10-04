'use client'

import Link from 'next/link'
import { tx } from '@/locale/client'
import { Suspense } from 'react'

export default function Home() {
  const name = 'Hugo'

  return (
    <Suspense fallback={'Loading client...'}>
      <p>{tx`Hello, ${name}!`}</p>
      <p>{tx`You haven't checked you email since ${new Date()}`}</p>
      <p>{tx`You got ${10000} messages in your mail inbox`}</p>

      <Link href={'/'}>To Home</Link>
    </Suspense>
  )
}
