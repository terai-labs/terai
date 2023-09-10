import './globals.css'
import type { AppProps } from 'next/app'
import { Suspense } from 'react'
import { useLocaleSync } from '../../locale/client'

export default function App({ Component, pageProps }: AppProps) {
  useLocaleSync(pageProps.locale)

  return (
    <Suspense>
      <Component {...pageProps} />
    </Suspense>
  )
}

export const getServerSideProps = ({
  params
}: {
  params: { locale: string }
}) => {
  return {
    props: {
      locale: params.locale
    }
  }
}
