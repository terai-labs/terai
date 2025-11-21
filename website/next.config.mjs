import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
export default withMDX({
	// reactStrictMode: true,
	output: 'export',
	basePath: '/terai',
	images: {
		unoptimized: true
	}
})
