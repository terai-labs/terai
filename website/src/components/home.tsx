// @ts-nocheck
import { useState } from 'react'

export function Home() {
	return (
		<div
			className='nx-flex nx-flex-col nx-justify-center nx-items-center'
			style={{
				textAlign: 'center',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				width: '100%',
				overflow: 'hidden'
			}}
		>
			{/* Global Grid Background */}
			<GridBackground />
			{/* Hero Section */}
			<section
				style={{
					width: '100%',
					minHeight: '85vh',
					position: 'relative',
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center'
				}}
			>

				{/* Gradient Orbs */}
				<div
					style={{
						position: 'absolute',
						top: '10%',
						left: '10%',
						width: '500px',
						height: '500px',
						borderRadius: '50%',
						background:
							'radial-gradient(circle, rgba(167, 136, 236, 0.15) 0%, transparent 70%)',
						filter: 'blur(60px)',
						pointerEvents: 'none',
						zIndex: 0
					}}
				/>
				<div
					style={{
						position: 'absolute',
						bottom: '20%',
						right: '10%',
						width: '400px',
						height: '400px',
						borderRadius: '50%',
						background:
							'radial-gradient(circle, rgba(94, 106, 210, 0.15) 0%, transparent 70%)',
						filter: 'blur(60px)',
						pointerEvents: 'none',
						zIndex: 0
					}}
				/>

				<div
					style={{
						maxWidth: '1200px',
						paddingInline: '24px',
						paddingBlock: '8vh',
						alignItems: 'center',
						display: 'flex',
						flexDirection: 'column',
						gap: 32,
						position: 'relative',
						zIndex: 1
					}}
				>
					<HeaderLogo />

					{/* Badge */}
					<div
						className='nx-bg-white/60 dark:nx-bg-neutral-900/60 nx-text-gray-700 dark:nx-text-gray-300'
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							paddingInline: 16,
							paddingBlock: 8,
							borderRadius: 24,
							border: '1px solid rgba(94, 106, 210, 0.3)',
							fontSize: '14px',
							fontWeight: '500',
							backdropFilter: 'blur(16px)'
						}}
					>
						<span
							style={{
								width: 8,
								height: 8,
								borderRadius: '50%',
								background: 'linear-gradient(135deg, #a788ec, #5e6ad2)',
								animation: 'pulse 2s ease-in-out infinite'
							}}
						/>
						Modern i18n for TypeScript
					</div>

					<h1
						style={{
							fontWeight: '800',
							fontSize: 'clamp(2.5rem, 8vw, 5rem)',
							lineHeight: '1.1',
							letterSpacing: '-0.04em',
							marginTop: 0,
							marginBottom: 0
						}}
					>
						Modern localization
						<br />
						<span
							style={{
								background:
									'linear-gradient(135deg, #a788ec 0%, #5e6ad2 50%, #FF8900 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text'
							}}
						>
							for TypeScript codebases
						</span>
					</h1>

					<p
						className='nx-text-gray-600 dark:nx-text-gray-400'
						style={{
							fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
							lineHeight: '1.6',
							maxWidth: '700px',
							marginTop: 0,
							marginBottom: 0
						}}
					>
						Terai is a modern i18n framework for TypeScript. <br />
						Optimized for developer experience in the frameworks you love.
					</p>

					<div
						style={{
							display: 'flex',
							gap: 16,
							marginTop: 16,
							flexWrap: 'wrap',
							justifyContent: 'center'
						}}
					>
						<a
							href='/terai/docs/overview/getting-started'
							style={{ textDecoration: 'none' }}
						>
							<button
								type='button'
								style={{
									color: 'white',
									fontSize: '16px',
									fontWeight: '600',
									paddingInline: 32,
									paddingBlock: 12,
									borderRadius: 16,
									background:
										'linear-gradient(135deg, #a788ec 0%, #5e6ad2 100%)',
									border: 'none',
									cursor: 'pointer',
									transition: 'all 0.3s ease',
									boxShadow: '0 4px 20px rgba(94, 106, 210, 0.3)',
									position: 'relative',
									overflow: 'hidden'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-2px)'
									e.currentTarget.style.boxShadow =
										'0 8px 30px rgba(94, 106, 210, 0.4)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0)'
									e.currentTarget.style.boxShadow =
										'0 4px 20px rgba(94, 106, 210, 0.3)'
								}}
							>
								Read the docs →
							</button>
						</a>
						<a
							href='https://github.com/terai-labs/terai'
							style={{ textDecoration: 'none' }}
						>
							<button
								type='button'
								style={{
									fontSize: '16px',
									fontWeight: '600',
									paddingInline: 32,
									paddingBlock: 12,
									borderRadius: 16,
									border: '2px solid rgba(160, 160, 160, 0.2)',
									cursor: 'pointer',
									transition: 'all 0.3s ease',
									backdropFilter: 'blur(10px)'
								}}
								className='nx-text-gray-900 dark:nx-text-white'
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-2px)'
									e.currentTarget.style.borderColor = 'rgba(94, 106, 210, 0.4)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0)'
									e.currentTarget.style.borderColor = 'rgba(160, 160, 160, 0.2)'
								}}
							>
								<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
									<svg
										width='20'
										height='20'
										viewBox='0 0 24 24'
										fill='currentColor'
										role='img'
										aria-labelledby='github-icon-title'
									>
										<title id='github-icon-title'>GitHub</title>
										<path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
									</svg>
									GitHub
								</span>
							</button>
						</a>
					</div>

					{/* Stats */}
					<div
						style={{
							display: 'flex',
							gap: 48,
							marginTop: 48,
							flexWrap: 'wrap',
							justifyContent: 'center'
						}}
					>
						{[
							{ label: 'Type Safe', value: '100%' },
							{ label: 'Bundle Size', value: 'Few KB' },
							{ label: 'Frameworks', value: '10+' }
						].map((stat, i) => (
							<div
								key={i}
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: 4,
									alignItems: 'center'
								}}
							>
								<div
									style={{
										fontSize: '2rem',
										fontWeight: '800',
										background: 'linear-gradient(135deg, #a788ec, #5e6ad2)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text'
									}}
								>
									{stat.value}
								</div>
								<div
									className='nx-text-gray-600 dark:nx-text-gray-400'
									style={{ fontSize: '0.875rem', fontWeight: '500' }}
								>
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How it Works Section */}
			<section
				style={{
					width: '100%',
					paddingBlock: '12vh',
					paddingInline: '24px',
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					overflow: 'hidden'
				}}
			>
				{/* Animated gradient background */}
				<div
					style={{
						position: 'absolute',
						top: '20%',
						left: '50%',
						transform: 'translateX(-50%)',
						width: '80%',
						height: '60%',
						background:
							'radial-gradient(ellipse at center, rgba(167, 136, 236, 0.08) 0%, transparent 70%)',
						filter: 'blur(80px)',
						pointerEvents: 'none',
						zIndex: 0
					}}
				/>

				<div
					style={{
						maxWidth: '1200px',
						width: '100%',
						position: 'relative',
						zIndex: 1,
						textAlign: 'center'
					}}
				>
					<div
						className='nx-bg-white/60 dark:nx-bg-neutral-900/60 nx-text-gray-700 dark:nx-text-gray-300'
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							paddingInline: 16,
							paddingBlock: 8,
							borderRadius: 24,
							border: '1px solid rgba(167, 136, 236, 0.3)',
							fontSize: '14px',
							fontWeight: '600',
							marginBottom: 24,
							backdropFilter: 'blur(12px)'
						}}
					>
						⚡ Workflow
					</div>

					<h2
						style={{
							fontWeight: '800',
							fontSize: 'clamp(2rem, 5vw, 3.5rem)',
							lineHeight: '1.2',
							marginBottom: 16,
							marginTop: 0,
							letterSpacing: '-0.03em'
						}}
					>
						Three steps to{' '}
						<span
							style={{
								background: 'linear-gradient(135deg, #a788ec, #5e6ad2, #FF8900)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text'
							}}
						>
							global reach
						</span>
					</h2>
					<p
						className='nx-text-gray-600 dark:nx-text-gray-400'
						style={{
							fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
							lineHeight: '1.6',
							maxWidth: '700px',
							marginBottom: 72,
							marginTop: 0,
							marginInline: 'auto'
						}}
					>
						Remove the pain from the localization process. Translate your
						products 10x faster.
					</p>

					{/* Timeline container */}
					<div
						style={{
							position: 'relative',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'flex-start',
							gap: 0,
							marginTop: 48
						}}
					>
						{/* Connecting line background */}
						<div
							style={{
								position: 'absolute',
								top: '100px',
								left: '15%',
								right: '15%',
								height: '4px',
								background:
									'linear-gradient(90deg, rgba(167, 136, 236, 0.3) 0%, rgba(94, 106, 210, 0.3) 50%, rgba(255, 137, 0, 0.3) 100%)',
								borderRadius: '4px',
								zIndex: 0
							}}
							className='workflow-line'
						/>

						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
								gap: 48,
								width: '100%',
								position: 'relative',
								zIndex: 1
							}}
						>
							{[
								{
									step: '01',
									title: 'Develop',
									description:
										'Write your code naturally using ts`` tagged templates. No manual key management required.',
									icon: '💻',
									color: '#a788ec',
									codeExample: "ts`Hello ${name}`"
								},
								{
									step: '02',
									title: 'Extract',
									description:
										'Static extraction automatically gathers all messages from your codebase with precision.',
									icon: '🔎',
									color: '#5e6ad2',
									codeExample: 'terai extract'
								},
								{
									step: '03',
									title: 'Translate',
									description:
										'Let AI work for you with ChatGPT, Google Translate, or your custom service.',
									icon: '🌍',
									color: '#FF8900',
									codeExample: 'terai translate'
								}
							].map((item, i) => (
								<ModernWorkflowStep key={i} {...item} index={i} />
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid Section */}
			<section
				style={{
					paddingBlock: '12vh',
					paddingInline: '24px',
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					width: '100%',
					background:
						'linear-gradient(180deg, transparent 0%, rgba(167, 136, 236, 0.03) 50%, transparent 100%)'
				}}
			>
				<Logo
					height={'600px'}
					width={'600px'}
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						filter: 'blur(140px)',
						opacity: 0.2,
						zIndex: 0,
						pointerEvents: 'none'
					}}
				/>

				<div
					style={{
						position: 'relative',
						zIndex: 1,
						width: '100%',
						maxWidth: '1400px'
					}}
				>
					<div
						className='nx-bg-white/60 dark:nx-bg-neutral-900/60 nx-text-gray-700 dark:nx-text-gray-300'
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							paddingInline: 16,
							paddingBlock: 8,
							borderRadius: 24,
							border: '1px solid rgba(255, 137, 0, 0.3)',
							fontSize: '14px',
							fontWeight: '600',
							marginBottom: 24,
							backdropFilter: 'blur(12px)'
						}}
					>
						✨ Features
					</div>

					<h2
						style={{
							fontWeight: '800',
							fontSize: 'clamp(2rem, 5vw, 3.5rem)',
							lineHeight: '1.2',
							marginBottom: 16,
							marginTop: 0,
							letterSpacing: '-0.03em'
						}}
					>
						Everything you need
					</h2>
					<p
						className='nx-text-gray-600 dark:nx-text-gray-400'
						style={{
							fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
							lineHeight: '1.6',
							maxWidth: '800px',
							marginBottom: 64,
							marginTop: 0,
							marginInline: 'auto'
						}}
					>
						Built for developers who want to ship faster without compromising on
						quality or user experience.
					</p>

					{/* Bento Grid Layout */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
							gap: 24,
							marginTop: 48
						}}
					>
						<FeatureCard
							icon='🧑‍💻'
							title='Developer-First'
							description='No more looking for keys in your source code. No more editing localisation files. No more manual data exports.'
							gradient='linear-gradient(135deg, rgba(167, 136, 236, 0.1) 0%, rgba(94, 106, 210, 0.1) 100%)'
						/>
						<FeatureCard
							icon='🚀'
							title='10x Faster'
							description='Remove the pain from the localization process. Translate your products significantly faster with automation.'
							gradient='linear-gradient(135deg, rgba(94, 106, 210, 0.1) 0%, rgba(255, 137, 0, 0.1) 100%)'
						/>
						<FeatureCard
							icon='🌱'
							title='Lightweight'
							description='Offer your product globally with just a few KB. Optimized bundle size ensures blazing-fast performance.'
							gradient='linear-gradient(135deg, rgba(255, 137, 0, 0.1) 0%, rgba(167, 136, 236, 0.1) 100%)'
						/>
						<FeatureCard
							icon='✂️'
							title='Code Splitting'
							description='Split your translation files with ease. Import only the messages your users need to see.'
							gradient='linear-gradient(135deg, rgba(167, 136, 236, 0.1) 0%, rgba(94, 106, 210, 0.1) 100%)'
						/>
						<FeatureCard
							icon='🕋'
							title='Smart Cache'
							description="Don't translate the same string twice. Translation cache intelligently reuses strings you've already translated."
							gradient='linear-gradient(135deg, rgba(94, 106, 210, 0.1) 0%, rgba(255, 137, 0, 0.1) 100%)'
						/>
						<FeatureCard
							icon='💎'
							title='TypeScript Native'
							description='Fully written in TypeScript with complete type safety. Get autocomplete and type checking out of the box.'
							gradient='linear-gradient(135deg, rgba(255, 137, 0, 0.1) 0%, rgba(167, 136, 236, 0.1) 100%)'
						/>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section
				style={{
					width: '100%',
					paddingBlock: '12vh',
					paddingInline: '24px',
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					background:
						'linear-gradient(180deg, transparent 0%, rgba(94, 106, 210, 0.05) 50%, transparent 100%)'
				}}
			>
				<div
					style={{
						maxWidth: '800px',
						textAlign: 'center',
						display: 'flex',
						flexDirection: 'column',
						gap: 32,
						alignItems: 'center'
					}}
				>
					<h2
						style={{
							fontWeight: '800',
							fontSize: 'clamp(2rem, 5vw, 3.5rem)',
							lineHeight: '1.2',
							margin: 0,
							letterSpacing: '-0.03em'
						}}
					>
						Ready to transform your
						<br />
						<span
							style={{
								background:
									'linear-gradient(135deg, #a788ec, #5e6ad2, #FF8900)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text'
							}}
						>
							localization workflow?
						</span>
					</h2>

					<p
						className='nx-text-gray-600 dark:nx-text-gray-400'
						style={{
							fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
							lineHeight: '1.6',
							margin: 0
						}}
					>
						Join developers who are already building multilingual applications
						with Terai
					</p>

					<div
						style={{
							display: 'flex',
							gap: 16,
							marginTop: 16,
							flexWrap: 'wrap',
							justifyContent: 'center'
						}}
					>
						<a
							href='/terai/docs/overview/getting-started'
							style={{ textDecoration: 'none' }}
						>
							<button
								type='button'
								style={{
									color: 'white',
									fontSize: '18px',
									fontWeight: '600',
									paddingInline: 40,
									paddingBlock: 18,
									borderRadius: 12,
									background:
										'linear-gradient(135deg, #a788ec 0%, #5e6ad2 100%)',
									border: 'none',
									cursor: 'pointer',
									transition: 'all 0.3s ease',
									boxShadow: '0 4px 20px rgba(94, 106, 210, 0.3)'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform =
										'translateY(-2px) scale(1.02)'
									e.currentTarget.style.boxShadow =
										'0 8px 30px rgba(94, 106, 210, 0.4)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0) scale(1)'
									e.currentTarget.style.boxShadow =
										'0 4px 20px rgba(94, 106, 210, 0.3)'
								}}
							>
								Get Started →
							</button>
						</a>
					</div>
				</div>
			</section>
		</div>
	)
}

// Modern Workflow Step Component
function ModernWorkflowStep({
	step,
	title,
	description,
	icon,
	color,
	index,
	codeExample
}: any) {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 24,
				position: 'relative',
				transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Floating circle with icon */}
			<div
				style={{
					position: 'relative',
					width: 200,
					height: 200,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				{/* Outer glow ring */}
				<div
					style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						borderRadius: '50%',
						background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
						filter: 'blur(20px)',
						opacity: isHovered ? 1 : 0.5,
						transition: 'all 0.4s ease',
						transform: isHovered ? 'scale(1.2)' : 'scale(1)'
					}}
				/>

				{/* Main circle */}
				<div
					className='nx-bg-white dark:nx-bg-neutral-900'
					style={{
						position: 'relative',
						width: 160,
						height: 160,
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						gap: 12,
						border: `3px solid ${color}40`,
						boxShadow: isHovered
							? `0 20px 60px ${color}30, 0 0 0 1px ${color}20`
							: `0 10px 30px ${color}20`,
						transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
						transform: isHovered ? 'translateY(-12px) scale(1.05)' : 'translateY(0) scale(1)',
						zIndex: 2,
						backdropFilter: 'blur(12px)'
					}}
				>
					{/* Icon */}
					<div
						style={{
							fontSize: '4rem',
							lineHeight: 1,
							transition: 'all 0.4s ease',
							transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0)'
						}}
					>
						{icon}
					</div>

					{/* Step number badge */}
					<div
						style={{
							position: 'absolute',
							top: -12,
							right: -12,
							width: 48,
							height: 48,
							borderRadius: '50%',
							background: `linear-gradient(135deg, ${color}, ${color}dd)`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '1.25rem',
							fontWeight: '900',
							color: 'white',
							boxShadow: `0 8px 16px ${color}40`,
							transition: 'all 0.4s ease',
							transform: isHovered ? 'scale(1.2) rotate(360deg)' : 'scale(1) rotate(0deg)'
						}}
					>
						{step}
					</div>
				</div>

				{/* Rotating border */}
				<div
					style={{
						position: 'absolute',
						width: 180,
						height: 180,
						borderRadius: '50%',
						border: `2px solid ${color}20`,
						borderTopColor: color,
						opacity: isHovered ? 1 : 0,
						transition: 'all 0.4s ease',
						animation: isHovered ? 'spin 3s linear infinite' : 'none',
						zIndex: 1
					}}
				/>
			</div>

			{/* Content card */}
			<div
				className='nx-bg-white dark:nx-bg-neutral-900'
				style={{
					width: '100%',
					padding: 24,
					borderRadius: 16,
					border: `1px solid ${isHovered ? color + '40' : 'rgba(160, 160, 160, 0.15)'}`,
					transition: 'all 0.4s ease',
					boxShadow: isHovered
						? `0 12px 32px ${color}20`
						: '0 4px 12px rgba(0, 0, 0, 0.05)',
					transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
					backdropFilter: 'blur(12px)'
				}}
			>
				<h3
					style={{
						fontSize: '1.5rem',
						fontWeight: '700',
						margin: 0,
						marginBottom: 12,
						lineHeight: '1.3',
						textAlign: 'center'
					}}
				>
					{title}
				</h3>
				<p
					className='nx-text-gray-600 dark:nx-text-gray-400'
					style={{
						fontSize: '0.9375rem',
						lineHeight: '1.6',
						margin: 0,
						marginBottom: 16,
						textAlign: 'center'
					}}
				>
					{description}
				</p>

				{/* Code example */}
				<div
					style={{
						background: isHovered
							? `linear-gradient(135deg, ${color}10, ${color}05)`
							: 'rgba(0, 0, 0, 0.03)',
						padding: 12,
						borderRadius: 8,
						fontFamily: 'monospace',
						fontSize: '0.875rem',
						textAlign: 'center',
						border: `1px solid ${isHovered ? color + '20' : 'rgba(160, 160, 160, 0.1)'}`,
						transition: 'all 0.4s ease',
						color: color,
						fontWeight: '600'
					}}
					className='dark:nx-bg-neutral-800'
				>
					{codeExample}
				</div>
			</div>
		</div>
	)
}

// Feature Card Component with hover effects
function FeatureCard({ icon, title, description, gradient }: any) {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<div
			className='nx-bg-white dark:nx-bg-neutral-900'
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				textAlign: 'left',
				border: '1px solid rgba(160, 160, 160, 0.15)',
				padding: 32,
				borderRadius: 20,
				gap: 16,
				transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				cursor: 'default',
				transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
				boxShadow: isHovered
					? '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(94, 106, 210, 0.2)'
					: '0 4px 12px rgba(0, 0, 0, 0.05)',
				position: 'relative',
				overflow: 'hidden',
				backdropFilter: 'blur(12px)'
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Icon container with gradient background */}
			<div
				style={{
					fontSize: '3rem',
					lineHeight: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: 72,
					height: 72,
					borderRadius: 16,
					background: gradient,
					transition: 'all 0.4s ease',
					transform: isHovered
						? 'scale(1.1) rotate(5deg)'
						: 'scale(1) rotate(0deg)'
				}}
			>
				{icon}
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
				<h3
					style={{
						fontSize: '1.375rem',
						lineHeight: '1.3',
						fontWeight: '700',
						margin: 0
					}}
				>
					{title}
				</h3>
				<p
					className='nx-text-gray-600 dark:nx-text-gray-400'
					style={{
						fontSize: '1rem',
						lineHeight: '1.6',
						margin: 0
					}}
				>
					{description}
				</p>
			</div>

			{/* Decorative corner element */}
			<div
				style={{
					position: 'absolute',
					top: -20,
					right: -20,
					width: 100,
					height: 100,
					borderRadius: '50%',
					background:
						'radial-gradient(circle, rgba(94, 106, 210, 0.15) 0%, transparent 70%)',
					opacity: isHovered ? 1 : 0,
					transition: 'opacity 0.4s ease',
					pointerEvents: 'none'
				}}
			/>
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
				strokeWidth='14'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
			<path
				d='M91.1253 14.175C78.1997 12.2012 64.9791 14.0239 53.0698 19.4218C41.1606 24.8196 31.0755 33.5602 24.04 44.5814C17.0044 55.6027 13.3213 68.4301 13.4382 81.505C13.5551 94.5798 17.467 107.339 24.6985 118.233'
				stroke='#5E6AD2'
				strokeWidth='14'
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
				className='nx-bg-white/60 dark:nx-bg-neutral-900/60'
				style={{
					zIndex: 1,
					position: 'absolute',
					padding: 12,
					borderRadius: 28,
					border: '1px solid rgba(160,160,160,0.2)',
					backdropFilter: 'blur(20px)',
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
				style={{ position: 'absolute', filter: 'blur(60px)', zIndex: -1 }}
			/>
		</div>
	)
}

// Grid Background Component (Vercel-inspired)
function GridBackground() {
	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: -1,
				overflow: 'hidden',
				pointerEvents: 'none'
			}}
		>
			{/* Grid lines */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: `
						linear-gradient(to right, rgba(160, 160, 160, 0.12) 1px, transparent 1px),
						linear-gradient(to bottom, rgba(160, 160, 160, 0.12) 1px, transparent 1px)
					`,
					backgroundSize: '80px 80px',
					maskImage: 'radial-gradient(ellipse 80% 50% at 50% 40%, black 40%, transparent 100%)'
				}}
				className='dark:opacity-50'
			/>

			{/* Accent grid lines (colored) */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: `
						linear-gradient(to right, rgba(167, 136, 236, 0.15) 1px, transparent 1px),
						linear-gradient(to bottom, rgba(94, 106, 210, 0.15) 1px, transparent 1px)
					`,
					backgroundSize: '80px 80px',
					maskImage: 'radial-gradient(ellipse 60% 40% at 50% 30%, black, transparent 70%)'
				}}
			/>

			{/* Gradient orbs for depth */}
			<div
				style={{
					position: 'absolute',
					top: '10%',
					left: '20%',
					width: '600px',
					height: '600px',
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(167, 136, 236, 0.08) 0%, transparent 70%)',
					filter: 'blur(60px)',
					pointerEvents: 'none'
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: '10%',
					right: '20%',
					width: '500px',
					height: '500px',
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(255, 137, 0, 0.08) 0%, transparent 70%)',
					filter: 'blur(60px)',
					pointerEvents: 'none'
				}}
			/>

			{/* Noise texture overlay */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
					opacity: 0.025,
					mixBlendMode: 'overlay',
					pointerEvents: 'none'
				}}
				className='dark:opacity-40'
			/>
		</div>
	)
}
