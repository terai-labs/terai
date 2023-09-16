import Link from 'next/link'
import { tx, useLocaleSync } from '../../locale/client'

export default function ClientPage({ locale }: { locale: string }) {
  const name = 'Hugo'
  useLocaleSync(locale)

  return (
    <div>
      <p>{tx`Hello, ${name}!`}</p>
      <p>{tx`You haven't checked you email since ${new Date()}`}</p>
      <p>{tx`You got ${10000} messages in your mail inbox`}</p>

      <Link href={'/'}>To Home</Link>
    </div>
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
