import { Link } from '@koi18n/next'

export default async function Home() {
  return (
    <div>
      <h1>Next.js demo</h1>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link href={'/server'}>{'Server in English'}</Link>
        <Link href={'/client'}>{'Client in English'}</Link>
        <Link locale='es' prefetch={false} href={'/'}>
          {'es'}
        </Link>
        <Link locale={'en'} prefetch={false} href={'/'}>
          {'en'}
        </Link>
      </div>
    </div>
  )
}
