/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#d1d5db',
            '--tw-prose-headings': '#f9fafb',
            '--tw-prose-links': '#fbbf24',
            '--tw-prose-code': '#e5e7eb',
            '--tw-prose-pre-bg': '#1a1a2e',
            '--tw-prose-th-borders': '#374151',
            '--tw-prose-td-borders': '#374151',
            maxWidth: 'none',
            table: { width: '100%' },
            'th, td': { padding: '0.5rem 0.75rem' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
