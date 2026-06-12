/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-cyan': { DEFAULT: '#00e5ff', 400: '#00ffcc', 500: '#00e5ff', 600: '#00b8d4' },
        'neon-pink': { DEFAULT: '#ff2d78', 400: '#ff79a8', 500: '#ff2d78', 600: '#d10059' },
        'dark-blue': {
          DEFAULT: '#050d1a',
          100: '#0a1929',
          200: '#0d2137',
          300: '#102a47',
          400: '#133254',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      boxShadow: {
        'neon-cyan': '0 0 8px #00e5ff80, 0 0 20px #00e5ff30',
        'neon-pink': '0 0 8px #ff2d7880, 0 0 20px #ff2d7830',
        'glass': 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(10,30,80,0.65), rgba(5,13,26,0.5))',
        'neon-gradient': 'linear-gradient(135deg, #00e5ff15, #ff2d7815)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'pulse-neon': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
