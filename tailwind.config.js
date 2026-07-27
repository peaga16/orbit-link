/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tecna', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        tecna: ['Tecna', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 70px rgba(239, 35, 42, 0.22), 0 0 120px rgba(127, 16, 21, 0.10)',
        panel: '0 24px 80px rgba(0, 0, 0, 0.36)',
      },
      backgroundImage: {
        'orbit-radial': 'radial-gradient(circle at center, rgba(239,35,42,.18), transparent 62%)',
      },
    },
  },
  plugins: [],
};
