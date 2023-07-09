/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'inter': ['"Inter"', 'sans-serif'],
				'jetbrains-mono': ["JetBrains Mono", 'monospace'],
				'just-me': ['"Just Me Again Down Here"', 'cursive']
			}
		},
	},
	plugins: [
		require('tailwind-scrollbar')({
			nocompatible: true
		})
	],
}
