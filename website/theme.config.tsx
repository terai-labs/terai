import Image from 'next/image'
import { ThemeConfig } from 'nextra/types'

const config: ThemeConfig = {
	logo: (
		<div className='nx-flex nx-items-center'>
			<svg
				width='24'
				height='24'
				viewBox='0 0 162 162'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<title>Terai</title>
				<path
					d='M70.2002 147.825C83.1788 149.958 96.4977 148.252 108.52 142.918C120.543 137.583 130.745 128.853 137.873 117.799C145.001 106.746 148.744 93.8502 148.642 80.6979C148.541 67.5456 144.599 54.7095 137.302 43.767'
					stroke='#5E6AD2'
					stroke-width='14'
					stroke-linecap='round'
					stroke-linejoin='round'
				/>
				<path
					d='M91.1253 14.175C78.1997 12.2012 64.9791 14.0239 53.0698 19.4218C41.1606 24.8196 31.0755 33.5602 24.04 44.5814C17.0044 55.6027 13.3213 68.4301 13.4382 81.505C13.5551 94.5798 17.467 107.339 24.6985 118.233'
					stroke='#5E6AD2'
					stroke-width='14'
					stroke-linecap='round'
					stroke-linejoin='round'
				/>
				<path
					d='M81 119C101.987 119 119 101.987 119 81C119 60.0132 101.987 43 81 43C60.0132 43 43 60.0132 43 81C43 101.987 60.0132 119 81 119Z'
					fill='#FF8900'
				/>
				<path
					d='M129 45C137.284 45 144 38.2843 144 30C144 21.7157 137.284 15 129 15C120.716 15 114 21.7157 114 30C114 38.2843 120.716 45 129 45Z'
					fill='currentColor'
				/>
				<path
					d='M35.25 144.75C43.5343 144.75 50.25 138.034 50.25 129.75C50.25 121.466 43.5343 114.75 35.25 114.75C26.9657 114.75 20.25 121.466 20.25 129.75C20.25 138.034 26.9657 144.75 35.25 144.75Z'
					fill='currentColor'
				/>
			</svg>
			<span className='nx-ml-2 nx-text-xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100'>
				Terai
			</span>
		</div>
	),
	docsRepositoryBase: 'https://github.com/terai-labs/terai',
	project: {
		link: 'https://github.com/terai-labs/terai'
	},
	toc: {
		backToTop: true
	},
	gitTimestamp: false,
	primaryHue: {
		light: 235,
		dark: 235
	},
	primarySaturation: {
		light: 40,
		dark: 40
	},
	footer: {
		text: (
			<span>
				MIT {new Date().getFullYear()} ©{' '}
				<a
					href='https://github.com/terai-labs/terai'
					target='_blank'
					rel='noreferrer'
				>
					Terai
				</a>
			</span>
		)
	}
}

export default config
