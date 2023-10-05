/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    extend: {
      colors: {
        background: 'rgba(var(--t-background), <alpha-value>)',
        font: 'rgba(var(--t-font), <alpha-value>)'
      },
    }
	},
	plugins: [],
}
