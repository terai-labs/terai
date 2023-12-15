import Image from 'next/image'
import { ThemeConfig } from 'nextra/types'

const config: ThemeConfig = {
  logo: (
    <div className='nx-flex nx-items-center'>
      <Image alt='terai' src={'/terai/icon.png'} width={32} height={32} />
      <span className='nx-ml-2 nx-text-xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100'>
        Terai
      </span>
    </div>
  ),
  docsRepositoryBase: 'https://github.com/teraihq/terai',
  project: {
    link: 'https://github.com/teraihq/terai'
  },
  toc: {
    backToTop: true
  },
  primaryHue: 255,
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href='https://github.com/teraihq/terai' target='_blank'>
          Terai
        </a>
      </span>
    )
  }
}

export default config
