'use client'

import { Suspense } from 'react'
import { Link, useTs } from '@terai/next'

export default function Home() {
	const name = 'Hugo'
	const { ts } = useTs()

	return (
		<Suspense fallback={'Loading client...'}>
			<p>{ts`Hello, ${name}!`}</p>
			<p>{ts`You haven't checked you email since ${new Date()}`}</p>
			<p>{ts`You got ${10000} messages in your mail inbox`}</p>

			<Link href={'/'}>To Home</Link>
		</Suspense>
	)
}
