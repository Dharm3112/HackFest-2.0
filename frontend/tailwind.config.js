export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0B',    // Deep Black - Main app background
        surface: '#4D4C5A',       // Dark Slate - Cards, sidebars, and containers
        textMuted: '#B0B0B0',     // Light Grey - Subtext, table headers
        primary: '#0905FE',       // Electric Blue - Primary buttons (e.g., "Upload PDF")
        accent: '#4A63C6',        // Royal Cobalt - Active states, toggles
        highlight: '#7689CB',     // Periwinkle - Hover states, secondary borders
        glow: '#A9B3D4',          // Light Blue-Grey - Soft shadows/glows
        alert: '#95524E'          // Muted Red - Violation flags and critical warnings
      }
    }
  },
  plugins: [],
}
