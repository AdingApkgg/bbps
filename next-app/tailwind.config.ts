import type { Config } from "tailwindcss"

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
        // 海岛奇兵配色 (BBPS)
        bb: {
          blue: {
            DEFAULT: "#0891D1",
            light: "#3DB2E8",
            dark: "#06668F",
          },
          green: {
            DEFAULT: "#5FB82E",
            light: "#7FD14A",
            dark: "#4A9123",
            army: "#4A6741",
          },
          orange: {
            DEFAULT: "#FF8C00",
            light: "#FFB347",
            dark: "#CC7000",
          },
          red: {
            DEFAULT: "#E63946",
            light: "#FF6B77",
            dark: "#B8212A",
          },
          yellow: {
            DEFAULT: "#FFD60A",
            light: "#FFE566",
            dark: "#CCAB08",
          },
          bg: {
            light: "#F5F5DC",
            DEFAULT: "#E8E0C8",
            dark: "#C8C0A8",
          },
          border: {
            DEFAULT: "#8B7355",
            light: "#A89070",
            dark: "#6B5535",
          },
          text: {
            DEFAULT: "#2C2416",
            light: "#5C5446",
            white: "#FFFFFF",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        display: ["Barlow Condensed", "sans-serif"],
        game: ["Russo One", "sans-serif"],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        bb: "6px",
        "bb-lg": "10px",
        "bb-xl": "14px",
      },
      boxShadow: {
        bb: "0 2px 0 rgba(0,0,0,0.2)",
        "bb-lg": "0 4px 0 rgba(0,0,0,0.25)",
        "bb-inset": "inset 0 2px 4px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
} satisfies Config
