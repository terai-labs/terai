import Image from 'next/image'
import styles from './page.module.css'
import { Link } from '@koi18n/next/client'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>{'This is a test'}</p>
        <Link href={'/client'}>Client</Link>
        <Link href={'/server'}>Server</Link>
      </div>
    </main>
  )
}
