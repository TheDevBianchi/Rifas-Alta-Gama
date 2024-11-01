// tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				// Shadcn required colors
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
					// Custom primary colors
					50: "#E6F1FF",
					100: "#CCE4FF",
					200: "#99C8FF",
					300: "#66ADFF",
					400: "#3391FF",
					500: "#0066FF",
					600: "#0052CC",
					700: "#003D99",
					800: "#002966",
					900: "#0C111D",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
					// Custom secondary colors
					50: "#F5F7FA",
					100: "#E4E7EB",
					200: "#CBD2D9",
					300: "#9AA5B1",
					400: "#7B8794",
					500: "#616E7C",
					600: "#52606D",
					700: "#3E4C59",
					800: "#323F4B",
					900: "#1F2933",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
					// Custom accent colors
					50: "#E3F8FF",
					100: "#B3ECFF",
					200: "#81DEFD",
					300: "#5ED0FA",
					400: "#40C3F7",
					500: "#2BB0ED",
					600: "#1992D4",
					700: "#127FBF",
					800: "#0B69A3",
					900: "#035388",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				// Dark mode custom colors
				dark: {
					background: "#0C111D",
					foreground: "#E6F1FF",
					card: "#1A1F2E",
					cardHover: "#242B3D",
					border: "#2A324A",
					input: "#1A1F2E",
					ring: "#3391FF",
				},
				// Status colors
				success: {
					light: "#10B981",
					dark: "#059669",
				},
				warning: {
					light: "#F59E0B",
					dark: "#D97706",
				},
				error: {
					light: "#EF4444",
					dark: "#DC2626",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
}