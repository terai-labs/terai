// @ts-nocheck

export function Home() {
	return (
		<div
			className='nx-flex nx-flex-col nx-justify-center nx-items-center'
			style={{
				// overflow: 'hidden',
				textAlign: 'center',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				width: '100%'
			}}
		>
			<section
				style={{
					width: '100%',
					position: 'relative',
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				<DottedBackground />
				<div
					style={{
						paddingBlock: '15dvh',
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'column',
						gap: 20
					}}
				>
					<HeaderLogo />
					<h1
						style={{
							fontWeight: 'bolder',
							fontSize: 'xxx-large',
							lineHeight: '1',
							marginBottom: '20px',
							letterSpacing: '-0.03em',
							marginTop: 10
						}}
					>
						Modern localization <br /> for TypeScript codebases
					</h1>
					<span
						className='nx-text-gray-600 dark:nx-text-gray-400'
						style={{
							fontSize: 'x-large',
							lineHeight: '1.2'
						}}
					>
						Terai is a modern i18n framework for Javascript.
						<br /> Optimized for developer experience in the frameworks you
						love.
					</span>

					<div
						style={{
							display: 'flex',
							gap: 8,
							marginTop: '20px'
						}}
					>
						<a href='/docs'>
							<button
								type='button'
								style={{
									color: 'white',
									fontSize: 'medium',
									paddingInline: 16,
									paddingBlock: 8,
									borderRadius: 4,
									background: 'linear-gradient(#a788ec, #5e6ad2)'
								}}
							>
								Read the docs
							</button>
						</a>
						<a href='https://github.com/terai-labs/terai'>
							<button
								type='button'
								style={{
									color: 'white',
									fontSize: 'medium',
									paddingInline: 16,
									paddingBlock: 8,
									borderRadius: 4,
									background: 'black'
								}}
							>
								GitHub
							</button>
						</a>
					</div>
				</div>
			</section>

			<hr
				className={'dark:nx-border-neutral-800'}
				style={{
					width: '100dvw'
				}}
			/>

			<section
				style={{
					paddingBlock: '15dvh',
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden'
				}}
			>
				<Logo
					height={'400px'}
					width={'400px'}
					style={{
						position: 'absolute',
						filter: 'blur(120px)',
						zIndex: -1
					}}
				/>
				<h2
					style={{
						fontWeight: 'bolder',
						fontSize: 'xx-large',
						lineHeight: '1',
						marginBottom: '20px',
						letterSpacing: '-0.03em'
					}}
				>
					Why Terai?
				</h2>
				<span
					className='nx-text-gray-600 dark:nx-text-gray-400'
					style={{
						fontSize: 'x-large',
						lineHeight: '1'
					}}
				>
					Terai represents a fresh approach to localization, leveraging
					cutting-edge technology <br />
					and forward-thinking strategies to overcome the limitations of the
					past.
				</span>

				<ul
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr 1fr',
						gridTemplateRows: '1fr 1fr',
						marginTop: 80,
						gap: '20px'
					}}
				>
					<li
						className='nx-bg-white dark:nx-bg-dark'
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							textAlign: 'left',
							border: '0.5px solid rgba(160,160,160,0.1)',
							padding: 32,
							borderRadius: 16,
							gap: 8
						}}
					>
						<span style={{ fontSize: 'x-large' }}>🔎</span>
						<span
							style={{
								fontSize: 'large',
								lineHeight: '1',
								fontWeight: 'bold'
							}}
						>
							Static Extraction
						</span>
						<span
							style={{ fontSize: 'medium' }}
							className='nx-text-gray-600 dark:nx-text-gray-400'
						>
							Terai uses static extraction to meticulously gather your project's
							messages, ensuring a precise and efficient localization process.
						</span>
					</li>
					<li
						className='nx-bg-white dark:nx-bg-dark'
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							textAlign: 'left',
							border: '0.5px solid rgba(160,160,160,0.1)',
							padding: 32,
							borderRadius: 16,
							gap: 8
						}}
					>
						<span style={{ fontSize: 'x-large' }}>🤖</span>
						<span
							style={{
								fontSize: 'large',
								lineHeight: '1',
								fontWeight: 'bold'
							}}
						>
							Codegen
						</span>
						<span
							style={{ fontSize: 'medium' }}
							className='nx-text-gray-600 dark:nx-text-gray-400'
						>
							Automate the creation of a locale system, seamlessly structured
							around the extracted data, simplifying the management of
							translations.
						</span>
					</li>
					<li
						className='nx-bg-white dark:nx-bg-dark'
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							textAlign: 'left',
							border: '0.5px solid rgba(160,160,160,0.1)',
							padding: 32,
							borderRadius: 16,
							gap: 8
						}}
					>
						<span style={{ fontSize: 'x-large' }}>🚀</span>
						<span
							style={{
								fontSize: 'large',
								lineHeight: '1',
								fontWeight: 'bold'
							}}
						>
							Performance
						</span>
						<span
							style={{ fontSize: 'medium' }}
							className='nx-text-gray-600 dark:nx-text-gray-400'
						>
							Powered by a state-of-the-art tech stack, delivering top-tier
							performance for your application.
						</span>
					</li>
					<li
						className='nx-bg-white dark:nx-bg-dark'
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							textAlign: 'left',
							border: '0.5px solid rgba(160,160,160,0.1)',
							padding: 32,
							borderRadius: 16,
							gap: 8
						}}
					>
						<span style={{ fontSize: 'x-large' }}>🧑🏻‍💻</span>
						<span
							style={{
								fontSize: 'large',
								lineHeight: '1',
								fontWeight: 'bold'
							}}
						>
							Developer Experience
						</span>
						<span
							style={{ fontSize: 'medium' }}
							className='nx-text-gray-600 dark:nx-text-gray-400'
						>
							Terai prioritizes a superb developer experience, offering features
							like code splitting, local cache support, and more.
						</span>
					</li>
					<li
						className='nx-bg-white dark:nx-bg-dark'
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							textAlign: 'left',
							border: '0.5px solid rgba(160,160,160,0.1)',
							padding: 32,
							borderRadius: 16,
							gap: 8
						}}
					>
						<span style={{ fontSize: 'x-large' }}>✍️</span>
						<span
							style={{
								fontSize: 'large',
								lineHeight: '1',
								fontWeight: 'bold'
							}}
						>
							Flexibility
						</span>
						<span
							style={{ fontSize: 'medium' }}
							className='nx-text-gray-600 dark:nx-text-gray-400'
						>
							You have the freedom to choose the translator that best suits your
							preferences.
						</span>
					</li>
					<li
						className='nx-bg-white dark:nx-bg-dark'
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							textAlign: 'left',
							border: '0.5px solid rgba(160,160,160,0.1)',
							padding: 32,
							borderRadius: 16,
							gap: 8
						}}
					>
						<span style={{ fontSize: 'x-large' }}>🎨</span>
						<span
							style={{
								fontSize: 'large',
								lineHeight: '1',
								fontWeight: 'bold'
							}}
						>
							Customization
						</span>
						<span
							style={{ fontSize: 'medium' }}
							className='nx-text-gray-600 dark:nx-text-gray-400'
						>
							Tailor your own implementation to perfectly align with your
							specific use-case, giving you full control over the localization
							process.
						</span>
					</li>
				</ul>
			</section>

			<hr
				className={'dark:nx-border-neutral-800'}
				style={{
					width: '100dvw'
				}}
			/>

			<section
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					paddingBlock: '10dvh',
					justifyContent: 'center'
				}}
			>
				<h2
					style={{
						fontWeight: 'bolder',
						fontSize: 'xx-large',
						lineHeight: '1',
						marginTop: '20px',
						letterSpacing: '-0.03em'
					}}
				>
					Let's move localization forward 🚀
				</h2>
			</section>
		</div>
	)
}

function Logo(props: any) {
	return (
		<svg
			width='100'
			height='100'
			viewBox='0 0 162 162'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
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
	)
}

function HeaderLogo() {
	return (
		<div
			style={{
				position: 'relative',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<div
				style={{
					zIndex: 1,
					position: 'absolute',
					padding: 12,
					borderRadius: '20px',
					border: '1px solid rgba(160,160,160,0.1)',
					backdropFilter: 'blur(16px)',
					boxShadow: '0px 3px 6px rgba(0,0,0,0.1)'
				}}
			>
				<Logo style={{ opacity: 0 }} />
			</div>
			<Logo
				style={{ opacity: 0.5, transform: 'scale(1.2)', position: 'absolute' }}
			/>
			<Logo style={{ zIndex: 2 }} />
			<Logo
				style={{ position: 'absolute', filter: 'blur(80px)', zIndex: -1 }}
			/>
		</div>
	)
}

import { useEffect, useId, useRef } from 'react'
const DottedBackground = () => {
	const canvasRef = useRef(null)

	useEffect(() => {
		const canvas = canvasRef.current

		const context = canvas.getContext('2d')

		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		const width = (canvas.width = window.innerWidth)
		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		const height = (canvas.height = window.innerHeight)
		const dotColor = 'rgb(127, 127, 127)'

		const centerX = width / 2
		const centerY = height / 2
		const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)

		const drawDots = () => {
			const dotSpacing = 10
			for (let x = 0; x < width; x += dotSpacing) {
				for (let y = 0; y < height; y += dotSpacing) {
					const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
					const opacity = 0.5 * (1 - distance / maxDistance)

					context.fillStyle = `rgba(127, 127, 127, ${opacity})`
					context.beginPath()
					context.arc(x, y, 1, 0, Math.PI * 2)
					context.fill()
				}
			}
		}

		drawDots()
	}, [])

	return (
		<canvas
			style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				top: 0,
				left: 0,
				zIndex: -1
			}}
			ref={canvasRef}
		/>
	)
}
