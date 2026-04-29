/**
 * Tailwind CSS Configuration
 * Forest Design System — adapted from @forest-ds/core tokens
 */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      /* ─── Forest Color Palette ─── */
      colors: {
        /* Named palette */
        forest:    'var(--color-forest, #04202C)',
        evergreen: 'var(--color-evergreen, #304040)',
        pine:      'var(--color-pine, #5B7065)',
        fog:       'var(--color-fog, #C9D1C8)',
        moss:      'var(--color-moss, #9EADA3)',
        bark:      'var(--color-bark, #1A3036)',
        midnight:  'var(--color-midnight, #021519)',

        /* Primary action color */
        primary:        'var(--color-primary, #04202C)',
        'primary-light':'var(--color-primary-light, #5B7065)',
        'primary-hover':'var(--color-primary-hover, #1A3036)',
        'primary-active':'var(--color-primary-active, #021519)',

        /* Gray scale → forest-tinted greens */
        nxt: {
          50:  'var(--color-nxt-50, #F7F8F7)',
          100: 'var(--color-nxt-100, #EFF2F0)',
          200: 'var(--color-nxt-200, #DFE4E0)',
          300: 'var(--color-nxt-300, #C9D1C8)',
          400: 'var(--color-nxt-400, #9EADA3)',
          500: 'var(--color-nxt-500, #7D8F84)',
          600: 'var(--color-nxt-600, #5B7065)',
          700: 'var(--color-nxt-700, #304040)',
          800: 'var(--color-nxt-800, #1A3036)',
          900: 'var(--color-nxt-900, #04202C)',
        },

        /* Surfaces */
        'nav-bg':        'var(--color-nav-bg, #04202C)',
        'page':          'var(--color-page, #F7F8F7)',
        'surface':       'var(--color-surface, #FFFFFF)',
        'surface-dark':  'var(--color-surface-dark, #304040)',
        'surface-darker':'var(--color-surface-darker, #1A3036)',
        'surface-darkest':'var(--color-surface-darkest, #021519)',

        /* Semantic status */
        success:       '#059669',
        'success-light':'#ECFDF5',
        warning:       '#D97706',
        'warning-light':'#FFFBEB',
        error:         '#DC2626',
        'error-light': '#FEF2F2',
        info:          '#2563EB',
        'info-light':  '#EFF6FF',
      },

      /* ─── Typography ─── */
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body:    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
        sans:    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        'forest-base': '15px',
        'forest-xs':   '12px',
        'forest-sm':   '14px',
        'forest-lg':   '18px',
        'forest-xl':   '20px',
        'forest-2xl':  '24px',
        'forest-3xl':  '30px',
        'forest-4xl':  '36px',
      },

      /* ─── Border Radius ─── */
      borderRadius: {
        'nxt-sm':   '4px',
        'nxt-md':   '8px',
        'nxt-lg':   '12px',
        'nxt-xl':   '16px',
        'nxt-pill': '9999px',
      },

      /* ─── Shadows ─── */
      boxShadow: {
        'nxt-sm':     '0 1px 2px rgba(4,32,44,0.04), 0 4px 12px -2px rgba(4,32,44,0.12)',
        'nxt-md':     '0 1px 2px rgba(0,0,0,0.03), 0 4px 12px -2px rgba(0,0,0,0.06), 0 12px 24px -4px rgba(0,0,0,0.04)',
        'nxt-lg':     '0 1px 3px rgba(4,32,44,0.04), 0 8px 24px -4px rgba(4,32,44,0.15), 0 16px 40px -8px rgba(4,32,44,0.08)',
        'forest':     '0 1px 2px rgba(4,32,44,0.04), 0 4px 12px -2px rgba(4,32,44,0.12)',
        'forest-lg':  '0 1px 3px rgba(4,32,44,0.04), 0 8px 24px -4px rgba(4,32,44,0.15), 0 16px 40px -8px rgba(4,32,44,0.08)',
        'soft':       '0 1px 2px rgba(0,0,0,0.03), 0 4px 12px -2px rgba(0,0,0,0.06), 0 12px 24px -4px rgba(0,0,0,0.04)',
      },

      /* ─── Transitions ─── */
      transitionDuration: {
        'nxt-fast':   '150ms',
        'nxt-normal': '200ms',
        'nxt-slow':   '300ms',
      },
      transitionTimingFunction: {
        'apple':  'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      /* ─── Navbar / Layout ─── */
      height: {
        navbar: '56px',
      },
      zIndex: {
        fixed: '50',
      },
    },
  },
  plugins: [],
}
