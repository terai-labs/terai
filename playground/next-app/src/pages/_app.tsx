import './globals.css'
import type { AppProps } from 'next/app'
import { Suspense } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Suspense>
      <Component {...pageProps} />
    </Suspense>
  )
}
