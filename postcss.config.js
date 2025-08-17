export default {
  plugins: {
    // Import CSS files and resolve @import statements
    'postcss-import': {},
    
    // Process Tailwind directives and generate utility classes
    tailwindcss: {},
    
    // Nest CSS rules (allows SCSS-like nesting)
    'postcss-nesting': {},
    
    // Add vendor prefixes automatically based on browserslist
    autoprefixer: {},
    
    // Optimize and minify CSS in production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          // Preserve important comments
          discardComments: {
            removeAll: false,
          },
          // Don't merge rules that might break functionality
          mergeRules: false,
        }],
      },
    }),
    
    // Remove unused CSS (works great with Tailwind)
    '@fullhuman/postcss-purgecss': process.env.NODE_ENV === 'production' ? {
      content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
      ],
      // Safelist important classes that might be added dynamically
      safelist: [
        /^(enter|leave|appear)(|-(active|from|to))$/,
        /data-.*$/,
        /^(.*-)?transition-.*$/,
      ],
      // Don't remove Tailwind's base styles
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    } : false,
  },
}