'use client'

import { Link } from '@koi18n/next/link'
import { useTs } from '@/locale/client'
import { Suspense } from 'react'
const { useRouter, usePathname, useLocale } = require('@koi18n/next/client')
// import { useRouter, usePathname, useLocale } from '@koi18n/next/client'

export default function Home() {
  const name = 'Hugo'
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const ts = useTs()

  console.log(pathname, locale, router)

  return (
    <Suspense fallback={'Loading client...'}>
      <p>{ts`Hello, ${name}!`}</p>
      <p>{ts`You haven't checked you email since ${new Date()}`}</p>
      <p>{ts`You got ${10000} messages in your mail inbox`}</p>

      <Link href={'/'}>To Home</Link>
    </Suspense>
  )
}
