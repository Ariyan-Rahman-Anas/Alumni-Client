// /* eslint-disable @typescript-eslint/no-require-imports */
// // ============================================================
// //  BAMHS — tailwind.config.js
// //  School Alumni Portal: present & ex-students, staff, public
// //  Theme: Forest Green + Warm Cream | Futuristic & Refined
// // ============================================================

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//   ],

//   // ── Dark mode via class (add `dark` to <html>) ───────────
//   darkMode: "class",

//   theme: {
//     extend: {
//       // ── 1. COLOR SYSTEM ───────────────────────────────────
//       colors: {
//         // ── SHADCN TOKEN LAYER (DO NOT REMOVE) ─────────────────
//         background: "#FDFAF2",              // surface.DEFAULT
//         foreground: "#141412",              // neutral.900

//         primary: "#2E8B57",                 // primary.500 (forest green)
//         "primary-foreground": "#FFFFFF",

//         secondary: "#7E9E25",               // accent.500 (sage)
//         "secondary-foreground": "#FFFFFF",

//         accent: "#F59E0B",                  // gold.500
//         "accent-foreground": "#141412",

//         muted: "#F7F3E8",                   // surface.100
//         "muted-foreground": "#737370",      // neutral.500

//         border: "#E0D8C0",                  // surface.300
//         input: "#EEE9D8",                   // surface.200
//         ring: "#2E8B57",                    // primary.500



//         // Primary — Forest Green ramp (9 stops)
//         primary2: {
//           50: "#E8F5ED",
//           100: "#C3E8CE",
//           200: "#9DD8AE",
//           300: "#72C48C",
//           400: "#4DB472",
//           500: "#2E8B57",   // ← brand green (main CTA)
//           600: "#257048",
//           700: "#1A5436",
//           800: "#0F3C24",
//           900: "#0A3D2B",
//           950: "#051F15",
//         },

//         gunmetal: {
//           950: "#151C1F",
//           900: "#1A2428",
//           800: "#1E2A2E",   // ← dark card bg
//           700: "#243033",   // ← input bg
//           600: "#2C3A3F",   // ← hover surface
//           500: "#3D4F54",   // ← borders
//           400: "#526870",   // ← muted icons
//           300: "#7A949C",   // ← muted text
//           200: "#A8BEC4",   // ← secondary text
//           100: "#D4E3E7",   // ← light text on dark
//           50: "#EEF5F7",
//         },

//         // Accent — Warm Sage/Olive (complements forest green)
//         accent2: {
//           50: "#F5F7EB",
//           100: "#E6EDCC",
//           200: "#CFD99E",
//           300: "#B5C76E",
//           400: "#9AB545",
//           500: "#7E9E25",   // ← accent brand (badges, tags)
//           600: "#647E1C",
//           700: "#4B5F14",
//           800: "#32400D",
//           900: "#1E2607",
//         },

//         // Gold — warm highlight (honors, events, CTAs)
//         gold: {
//           50: "#FFFBEB",
//           100: "#FEF3C7",
//           200: "#FDE58A",
//           300: "#FCD34D",
//           400: "#FBBF24",
//           500: "#F59E0B",   // ← gold accent
//           600: "#D97706",
//           700: "#B45309",
//           800: "#92400E",
//           900: "#78350F",
//         },

//         // Surface — Warm Cream tones (backgrounds)
//         surface: {
//           DEFAULT: "#FDFAF2",    // page bg (light)
//           50: "#FDFAF2",
//           100: "#F7F3E8",    // card bg
//           200: "#EEE9D8",    // input bg / dividers
//           300: "#E0D8C0",    // subtle borders
//           400: "#C8BCA0",    // strong borders
//           inverse: "#0A3D2B",    // dark card bg
//         },

//         // Semantic — status colors
//         success: {
//           light: "#D1FAE5",
//           DEFAULT: "#059669",
//           dark: "#065F46",
//         },
//         warning: {
//           light: "#FEF9C3",
//           DEFAULT: "#D97706",
//           dark: "#92400E",
//         },
//         danger: {
//           light: "#FEE2E2",
//           DEFAULT: "#DC2626",
//           dark: "#991B1B",
//         },
//         info: {
//           light: "#DBEAFE",
//           DEFAULT: "#2563EB",
//           dark: "#1E3A8A",
//         },

//         // Role-based highlight colors (for user type badges)
//         role: {
//           student: { bg: "#E8F5ED", text: "#155A3E", border: "#9DD8AE" },
//           alumni: { bg: "#FFFBEB", text: "#92400E", border: "#FCD34D" },
//           staff: { bg: "#EEF2FF", text: "#3730A3", border: "#A5B4FC" },
//           admin: { bg: "#FDF2F8", text: "#86198F", border: "#E879F9" },
//           parent: { bg: "#F0F9FF", text: "#0C4A6E", border: "#7DD3FC" },
//         },

//         // Neutral — refined gray for text and UI
//         neutral: {
//           50: "#FAFAF9",
//           100: "#F4F4F2",
//           200: "#E5E5E0",
//           300: "#D4D4CE",
//           400: "#A3A39C",
//           500: "#737370",
//           600: "#525250",
//           700: "#3A3A38",
//           800: "#252523",
//           900: "#141412",
//           950: "#0A0A09",
//         },

//       }, // end colors


//       // ── 2. TYPOGRAPHY ─────────────────────────────────────
//       fontFamily: {
//         sanchez: ["var(--font-sanchez)", "ui-sans-serif", "cursive", "system-ui", "sans-serif"],
//         // sanchez: ["var(--font-sanchez)", "ui-sans-serif", "cursive", "system-ui", "sans-serif"],
//         splash: ["var(--font-splash)", "cursive",],
//       },

//       fontSize: {
//         "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
//         xs: ["0.75rem", { lineHeight: "1rem" }],
//         sm: ["0.875rem", { lineHeight: "1.375rem" }],
//         base: ["1rem", { lineHeight: "1.625rem" }],
//         lg: ["1.125rem", { lineHeight: "1.75rem" }],
//         xl: ["1.25rem", { lineHeight: "1.875rem" }],
//         "2xl": ["1.5rem", { lineHeight: "2rem" }],
//         "3xl": ["1.875rem", { lineHeight: "2.375rem" }],
//         "4xl": ["2.25rem", { lineHeight: "2.75rem" }],
//         "5xl": ["3rem", { lineHeight: "3.5rem", letterSpacing: "-0.02em" }],
//         "6xl": ["3.75rem", { lineHeight: "4.25rem", letterSpacing: "-0.025em" }],
//         "7xl": ["4.5rem", { lineHeight: "5rem", letterSpacing: "-0.03em" }],
//         "8xl": ["6rem", { lineHeight: "6.5rem", letterSpacing: "-0.035em" }],
//         "9xl": ["8rem", { lineHeight: "8.5rem", letterSpacing: "-0.04em" }],
//       },

//       letterSpacing: {
//         tightest: "-0.04em",
//         tighter: "-0.02em",
//         tight: "-0.01em",
//         normal: "0em",
//         wide: "0.02em",
//         wider: "0.05em",
//         widest: "0.1em",
//         display: "0.15em",  // for CAPS labels / section markers
//       },


//       // ── 3. SPACING & SIZING ───────────────────────────────
//       spacing: {
//         "0.5": "0.125rem",
//         "4.5": "1.125rem",
//         "5.5": "1.375rem",
//         "13": "3.25rem",
//         "15": "3.75rem",
//         "17": "4.25rem",
//         "18": "4.5rem",
//         "22": "5.5rem",
//         "26": "6.5rem",
//         "30": "7.5rem",
//         "34": "8.5rem",
//         "68": "17rem",
//         "84": "21rem",
//         "88": "22rem",
//         "92": "23rem",
//         "100": "25rem",
//         "112": "28rem",
//         "120": "30rem",
//         "128": "32rem",
//         "144": "36rem",
//       },

//       maxWidth: {
//         "8xl": "88rem",
//         "9xl": "96rem",
//         "10xl": "108rem",
//         "12xl": "120rem",
//         prose: "68ch",
//       },

//       minHeight: {
//         screen: "100dvh",   // dynamic viewport height (mobile safe)
//         hero: "88dvh",
//         "half": "50dvh",
//       },


//       // ── 4. BORDER RADIUS ─────────────────────────────────
//       borderRadius: {
//         none: "0",
//         xs: "0.125rem",
//         sm: "0.25rem",
//         DEFAULT: "0.375rem",
//         md: "0.5rem",
//         lg: "0.75rem",
//         xl: "1rem",
//         "2xl": "1.25rem",
//         "3xl": "1.5rem",
//         "4xl": "2rem",
//         pill: "9999px",
//         circle: "50%",
//       },


//       // ── 5. BOX SHADOW ─────────────────────────────────────
//       boxShadow: {
//         // Subtle green-tinted shadows (brand-aware)
//         xs: "0 1px 2px 0 rgba(10, 61, 43, 0.05)",
//         sm: "0 1px 3px 0 rgba(10, 61, 43, 0.08), 0 1px 2px -1px rgba(10, 61, 43, 0.06)",
//         DEFAULT: "0 4px 6px -1px rgba(10, 61, 43, 0.08), 0 2px 4px -2px rgba(10, 61, 43, 0.06)",
//         md: "0 4px 6px -1px rgba(10, 61, 43, 0.08), 0 2px 4px -2px rgba(10, 61, 43, 0.06)",
//         lg: "0 10px 15px -3px rgba(10, 61, 43, 0.10), 0 4px 6px -4px rgba(10, 61, 43, 0.06)",
//         xl: "0 20px 25px -5px rgba(10, 61, 43, 0.12), 0 8px 10px -6px rgba(10, 61, 43, 0.06)",
//         "2xl": "0 25px 50px -12px rgba(10, 61, 43, 0.20)",
//         "3xl": "0 35px 70px -15px rgba(10, 61, 43, 0.25)",

//         // Glow — for featured elements
//         "glow-sm": "0 0 12px 2px rgba(46, 139, 87, 0.25)",
//         "glow": "0 0 20px 4px rgba(46, 139, 87, 0.30)",
//         "glow-lg": "0 0 40px 8px rgba(46, 139, 87, 0.35)",
//         "glow-gold": "0 0 20px 4px rgba(245, 158, 11, 0.35)",

//         // Inner shadows
//         "inner-sm": "inset 0 1px 2px rgba(10, 61, 43, 0.06)",
//         "inner": "inset 0 2px 4px rgba(10, 61, 43, 0.10)",

//         none: "none",
//       },


//       // ── 6. GRADIENTS (via backgroundImage) ───────────────
//       backgroundImage: {
//         // Hero / section backgrounds
//         "hero-light": "linear-gradient(135deg, #E8F5ED 0%, #FDFAF2 50%, #F7F3E8 100%)",
//         "hero-dark": "linear-gradient(135deg, #0A3D2B 0%, #0F3C24 60%, #051F15 100%)",
//         "section-warm": "linear-gradient(180deg, #FDFAF2 0%, #F7F3E8 100%)",
//         "section-green": "linear-gradient(180deg, #E8F5ED 0%, #C3E8CE 100%)",

//         // Card gradients
//         "card-feature": "linear-gradient(135deg, #155A3E 0%, #0A3D2B 100%)",
//         "card-gold": "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
//         "card-glass": "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(247,243,232,0.90) 100%)",

//         // Decorative overlays
//         "overlay-green": "linear-gradient(180deg, transparent 0%, rgba(10,61,43,0.85) 100%)",
//         "overlay-light": "linear-gradient(180deg, transparent 0%, rgba(247,243,232,0.95) 100%)",

//         // Mesh background (for hero)
//         "mesh-forest": "radial-gradient(at 20% 20%, #C3E8CE 0%, transparent 55%), radial-gradient(at 80% 80%, #9DD8AE 0%, transparent 55%), radial-gradient(at 50% 50%, #FDFAF2 0%, transparent 70%)",

//         // Noise texture overlay class (add as pseudo-element)
//         "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",

//         // Radial for circular highlights
//         "radial-soft": "radial-gradient(ellipse at center, #E8F5ED 0%, transparent 70%)",
//         "radial-gold": "radial-gradient(ellipse at center, #FEF3C7 0%, transparent 70%)",
//       },


//       // ── 7. TRANSITIONS & ANIMATION ───────────────────────
//       transitionDuration: {
//         0: "0ms",
//         75: "75ms",
//         100: "100ms",
//         150: "150ms",
//         200: "200ms",
//         300: "300ms",
//         500: "500ms",
//         700: "700ms",
//         1000: "1000ms",
//       },

//       transitionTimingFunction: {
//         DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
//         linear: "linear",
//         in: "cubic-bezier(0.4, 0, 1, 1)",
//         out: "cubic-bezier(0, 0, 0.2, 1)",
//         "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
//         spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",  // overshoot spring
//         bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
//         smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//         snappy: "cubic-bezier(0.19, 1, 0.22, 1)",     // fast-in, glide-out
//       },

//       keyframes: {
//         // Page load fade-in + rise
//         "fade-up": {
//           "0%": { opacity: "0", transform: "translateY(20px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         "fade-down": {
//           "0%": { opacity: "0", transform: "translateY(-20px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         "fade-in": {
//           "0%": { opacity: "0" },
//           "100%": { opacity: "1" },
//         },
//         "scale-in": {
//           "0%": { opacity: "0", transform: "scale(0.95)" },
//           "100%": { opacity: "1", transform: "scale(1)" },
//         },
//         // Shimmer for skeleton loaders
//         shimmer: {
//           "0%": { backgroundPosition: "-200% 0" },
//           "100%": { backgroundPosition: "200% 0" },
//         },
//         // Pulse for notification dots
//         "pulse-dot": {
//           "0%, 100%": { opacity: "1", transform: "scale(1)" },
//           "50%": { opacity: "0.6", transform: "scale(1.3)" },
//         },
//         // Leaf sway — decorative
//         sway: {
//           "0%, 100%": { transform: "rotate(-2deg)" },
//           "50%": { transform: "rotate(2deg)" },
//         },
//         // Scroll ticker (news / announcements marquee)
//         marquee: {
//           "0%": { transform: "translateX(0%)" },
//           "100%": { transform: "translateX(-50%)" },
//         },
//         // Badge pop
//         pop: {
//           "0%": { transform: "scale(1)" },
//           "40%": { transform: "scale(1.15)" },
//           "100%": { transform: "scale(1)" },
//         },
//       },

//       animation: {
//         "fade-up": "fade-up 0.5s cubic-bezier(0.19, 1, 0.22, 1) both",
//         "fade-up-sm": "fade-up 0.35s cubic-bezier(0.19, 1, 0.22, 1) both",
//         "fade-down": "fade-down 0.5s cubic-bezier(0.19, 1, 0.22, 1) both",
//         "fade-in": "fade-in 0.4s ease both",
//         "scale-in": "scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
//         shimmer: "shimmer 1.8s linear infinite",
//         "pulse-dot": "pulse-dot 2s ease-in-out infinite",
//         sway: "sway 4s ease-in-out infinite",
//         marquee: "marquee 30s linear infinite",
//         pop: "pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
//       },


//       // ── 8. BACKDROP BLUR ─────────────────────────────────
//       backdropBlur: {
//         xs: "2px",
//         sm: "4px",
//         DEFAULT: "8px",
//         md: "12px",
//         lg: "16px",
//         xl: "24px",
//         "2xl": "40px",
//         "3xl": "64px",
//       },


//       // ── 9. Z-INDEX ────────────────────────────────────────
//       zIndex: {
//         0: "0",
//         10: "10",
//         20: "20",
//         30: "30",
//         40: "40",
//         50: "50",
//         nav: "100",   // sticky navbar
//         drawer: "200",   // mobile drawers
//         modal: "300",   // modals / dialogs
//         toast: "400",   // toast notifications
//         tip: "500",   // tooltips
//         top: "9999",  // emergency override
//       },


//       // ── 10. SCREENS (responsive breakpoints) ─────────────
//       screens: {
//         xs: "360px",
//         sm: "640px",
//         md: "768px",
//         lg: "1024px",
//         xl: "1280px",
//         "2xl": "1400px",
//         "3xl": "1600px",
//         "4xl": "1920px",
//         "5xl": "2560px",
//       },


//       // ── 11. ASPECT RATIO ─────────────────────────────────
//       aspectRatio: {
//         "4/3": "4 / 3",
//         "3/2": "3 / 2",
//         "16/9": "16 / 9",
//         "21/9": "21 / 9",
//         "1/1": "1 / 1",
//         "portrait": "3 / 4",
//         "card": "5 / 3",
//         "banner": "8 / 1",
//       },


//       // ── 12. RING (focus styles) ───────────────────────────
//       ringColor: {
//         DEFAULT: "rgba(46, 139, 87, 0.45)",
//         primary: "rgba(46, 139, 87, 0.45)",
//         gold: "rgba(245, 158, 11, 0.45)",
//         danger: "rgba(220, 38, 38, 0.45)",
//       },

//       ringOffsetColor: {
//         light: "#FDFAF2",
//         dark: "#0A3D2B",
//       },


//       // ── 13. OPACITY ───────────────────────────────────────
//       opacity: {
//         0: "0",
//         5: "0.05",
//         10: "0.10",
//         15: "0.15",
//         20: "0.20",
//         25: "0.25",
//         30: "0.30",
//         40: "0.40",
//         50: "0.50",
//         60: "0.60",
//         70: "0.70",
//         75: "0.75",
//         80: "0.80",
//         90: "0.90",
//         95: "0.95",
//         100: "1",
//       },


//       // ── 14. LINE CLAMP ────────────────────────────────────
//       lineClamp: {
//         1: "1",
//         2: "2",
//         3: "3",
//         4: "4",
//         5: "5",
//         6: "6",
//       },

//     }, // end extend
//   }, // end theme


//   // ── PLUGINS ───────────────────────────────────────────────
//   plugins: [
//     // Forms plugin (pip install @tailwindcss/forms)
//     require("@tailwindcss/forms")({
//       strategy: "class", // use `.form-input`, `.form-select` etc. — no global resets
//     }),

//     // Typography plugin (for rich text / blog / notices)
//     require("@tailwindcss/typography"),

//     // Aspect ratio plugin (for media embeds)
//     require("@tailwindcss/aspect-ratio"),

//     // Container queries (optional — for self-contained components)
//     // require("@tailwindcss/container-queries"),

//     // ── Custom component utilities ─────────────────────────
//     function ({ addUtilities, addComponents, theme }: any) {

//       // Glass morphism card
//       addComponents({
//         ".glass": {
//           background: "rgba(253, 250, 242, 0.75)",
//           backdropFilter: "blur(12px)",
//           WebkitBackdropFilter: "blur(12px)",
//           border: "1px solid rgba(46, 139, 87, 0.15)",
//         },
//         ".glass-dark": {
//           background: "rgba(10, 61, 43, 0.65)",
//           backdropFilter: "blur(16px)",
//           WebkitBackdropFilter: "blur(16px)",
//           border: "1px solid rgba(46, 139, 87, 0.25)",
//         },

//         // Skeleton loader
//         ".skeleton": {
//           background: "linear-gradient(90deg, #E8F5ED 25%, #C3E8CE 50%, #E8F5ED 75%)",
//           backgroundSize: "200% 100%",
//           animation: "shimmer 1.8s linear infinite",
//           borderRadius: theme("borderRadius.md"),
//         },

//         // Scroll area (custom scrollbar)
//         ".scrollbar-green": {
//           scrollbarWidth: "thin",
//           scrollbarColor: `${theme("colors.primary.300")} transparent`,
//           "&::-webkit-scrollbar": { width: "6px", height: "6px" },
//           "&::-webkit-scrollbar-track": { background: "transparent" },
//           "&::-webkit-scrollbar-thumb": {
//             backgroundColor: theme("colors.primary.300"),
//             borderRadius: "9999px",
//           },
//         },

//         // Focus ring preset
//         ".focus-ring": {
//           outline: "none",
//           "&:focus-visible": {
//             outline: "2px solid",
//             outlineColor: theme("colors.primary.500"),
//             outlineOffset: "2px",
//             borderRadius: theme("borderRadius.sm"),
//           },
//         },

//         // Stripe pattern (for tables / alternating rows)
//         ".stripe-green": {
//           "&:nth-child(even)": {
//             backgroundColor: theme("colors.surface.100"),
//           },
//         },
//       });

//       // Text gradient
//       addUtilities({
//         ".text-gradient-green": {
//           background: `linear-gradient(135deg, ${theme("colors.primary.500")}, ${theme("colors.accent.500")})`,
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           backgroundClip: "text",
//         },
//         ".text-gradient-gold": {
//           background: `linear-gradient(135deg, ${theme("colors.gold.500")}, ${theme("colors.gold.300")})`,
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           backgroundClip: "text",
//         },
//         // Smooth text rendering
//         ".antialiased-plus": {
//           WebkitFontSmoothing: "antialiased",
//           MozOsxFontSmoothing: "grayscale",
//           textRendering: "optimizeLegibility",
//         },
//         // Truncate with ellipsis
//         ".truncate-2": {
//           display: "-webkit-box",
//           WebkitLineClamp: "2",
//           WebkitBoxOrient: "vertical",
//           overflow: "hidden",
//         },
//         ".truncate-3": {
//           display: "-webkit-box",
//           WebkitLineClamp: "3",
//           WebkitBoxOrient: "vertical",
//           overflow: "hidden",
//         },
//       });
//     },
//   ],
// };




















/* eslint-disable @typescript-eslint/no-require-imports */
// ============================================================
//  BAMHS — tailwind.config.js
//  School Alumni Portal: present & ex-students, staff, public
//  Theme: Forest Green + Warm Cream | Futuristic & Refined
//  Dark: Gun Metal + Forest Green accent
// ============================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // ── Dark mode via class (add `dark` to <html>) ───────────
  darkMode: "class",

  theme: {
    extend: {
      // ── 1. COLOR SYSTEM ───────────────────────────────────
      colors: {

        // ── SHADCN TOKEN LAYER (DO NOT REMOVE) ──────────────
        // These read from CSS variables so they auto-switch in dark mode
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: "var(--color-primary-500)",
        "primary-foreground": "#FFFFFF",

        secondary: "var(--color-accent-500)",
        "secondary-foreground": "#FFFFFF",

        accent: "var(--color-gold-500)",
        "accent-foreground": "var(--color-text-inverse)",

        muted: "var(--color-surface-100)",
        "muted-foreground": "var(--color-text-muted)",

        border: "var(--color-border)",
        input: "var(--color-surface-200)",
        ring: "var(--color-primary-500)",

        // ── Surface — maps to CSS vars (auto dark switch) ───
        // Light: Warm Cream | Dark: Gun Metal
        surface: {
          DEFAULT: "var(--color-surface)",
          100:     "var(--color-surface-100)",
          200:     "var(--color-surface-200)",
          300:     "var(--color-surface-300)",
          400:     "var(--color-surface-400)",
          inverse: "#0A3D2B",
        },

        // ── Text — maps to CSS vars (auto dark switch) ──────
        text: {
          primary:   "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted:     "var(--color-text-muted)",
          inverse:   "var(--color-text-inverse)",
        },

        // ── Border — maps to CSS vars ───────────────────────
        "border-color": {
          DEFAULT: "var(--color-border)",
          strong:  "var(--color-border-strong)",
        },

        // ── Primary — Forest Green (maps to CSS vars) ───────
        // Reverses in dark mode (50 becomes darkest, 950 lightest)
        primary2: {
          50:  "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
          950: "var(--color-primary-950)",
        },

        // ── Accent — Warm Sage/Olive (static) ───────────────
        accent2: {
          50:  "#F5F7EB",
          100: "#E6EDCC",
          200: "#CFD99E",
          300: "#B5C76E",
          400: "#9AB545",
          500: "#7E9E25",
          600: "#647E1C",
          700: "#4B5F14",
          800: "#32400D",
          900: "#1E2607",
        },

        // ── Gold — warm highlight (static, same in both modes)
        gold: {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE58A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },

        // ── Gun Metal — dark surfaces (static, use directly) -
        gunmetal: {
          950: "#151C1F",
          900: "#1A2428",
          800: "#1E2A2E",
          700: "#243033",
          600: "#2C3A3F",
          500: "#3D4F54",
          400: "#526870",
          300: "#7A949C",
          200: "#A8BEC4",
          100: "#D4E3E7",
          50:  "#EEF5F7",
        },

        // ── Semantic — status colors (static) ───────────────
        success: {
          light:   "#D1FAE5",
          DEFAULT: "#059669",
          dark:    "#065F46",
        },
        warning: {
          light:   "#FEF9C3",
          DEFAULT: "#D97706",
          dark:    "#92400E",
        },
        danger: {
          light:   "#FEE2E2",
          DEFAULT: "#DC2626",
          dark:    "#991B1B",
        },
        info: {
          light:   "#DBEAFE",
          DEFAULT: "#2563EB",
          dark:    "#1E3A8A",
        },

        // ── Role-based highlight colors ──────────────────────
        role: {
          student: { bg: "#E8F5ED", text: "#155A3E", border: "#9DD8AE" },
          alumni:  { bg: "#FFFBEB", text: "#92400E", border: "#FCD34D" },
          staff:   { bg: "#EEF2FF", text: "#3730A3", border: "#A5B4FC" },
          admin:   { bg: "#FDF2F8", text: "#86198F", border: "#E879F9" },
          parent:  { bg: "#F0F9FF", text: "#0C4A6E", border: "#7DD3FC" },
        },

        // ── Neutral — refined gray (static) ─────────────────
        neutral: {
          50:  "#FAFAF9",
          100: "#F4F4F2",
          200: "#E5E5E0",
          300: "#D4D4CE",
          400: "#A3A39C",
          500: "#737370",
          600: "#525250",
          700: "#3A3A38",
          800: "#252523",
          900: "#141412",
          950: "#0A0A09",
        },

      }, // end colors


      // ── 2. TYPOGRAPHY ─────────────────────────────────────
      fontFamily: {
        sanchez: ["var(--font-sanchez)", "ui-sans-serif", "cursive", "system-ui", "sans-serif"],
        splash:  ["var(--font-splash)", "cursive"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        xs:    ["0.75rem",  { lineHeight: "1rem" }],
        sm:    ["0.875rem", { lineHeight: "1.375rem" }],
        base:  ["1rem",     { lineHeight: "1.625rem" }],
        lg:    ["1.125rem", { lineHeight: "1.75rem" }],
        xl:    ["1.25rem",  { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem",   { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],
        "4xl": ["2.25rem",  { lineHeight: "2.75rem" }],
        "5xl": ["3rem",     { lineHeight: "3.5rem",  letterSpacing: "-0.02em" }],
        "6xl": ["3.75rem",  { lineHeight: "4.25rem", letterSpacing: "-0.025em" }],
        "7xl": ["4.5rem",   { lineHeight: "5rem",    letterSpacing: "-0.03em" }],
        "8xl": ["6rem",     { lineHeight: "6.5rem",  letterSpacing: "-0.035em" }],
        "9xl": ["8rem",     { lineHeight: "8.5rem",  letterSpacing: "-0.04em" }],
      },

      letterSpacing: {
        tightest: "-0.04em",
        tighter:  "-0.02em",
        tight:    "-0.01em",
        normal:   "0em",
        wide:     "0.02em",
        wider:    "0.05em",
        widest:   "0.1em",
        display:  "0.15em",
      },


      // ── 3. SPACING & SIZING ───────────────────────────────
      spacing: {
        "0.5":  "0.125rem",
        "4.5":  "1.125rem",
        "5.5":  "1.375rem",
        "13":   "3.25rem",
        "15":   "3.75rem",
        "17":   "4.25rem",
        "18":   "4.5rem",
        "22":   "5.5rem",
        "26":   "6.5rem",
        "30":   "7.5rem",
        "34":   "8.5rem",
        "68":   "17rem",
        "84":   "21rem",
        "88":   "22rem",
        "92":   "23rem",
        "100":  "25rem",
        "112":  "28rem",
        "120":  "30rem",
        "128":  "32rem",
        "144":  "36rem",
      },

      maxWidth: {
        "8xl":  "88rem",
        "9xl":  "96rem",
        "10xl": "108rem",
        "12xl": "120rem",
        prose:  "68ch",
      },

      minHeight: {
        screen: "100dvh",
        hero:   "88dvh",
        half:   "50dvh",
      },


      // ── 4. BORDER RADIUS ──────────────────────────────────
      borderRadius: {
        none:    "0",
        xs:      "0.125rem",
        sm:      "0.25rem",
        DEFAULT: "0.375rem",
        md:      "0.5rem",
        lg:      "0.75rem",
        xl:      "1rem",
        "2xl":   "1.25rem",
        "3xl":   "1.5rem",
        "4xl":   "2rem",
        pill:    "9999px",
        circle:  "50%",
      },


      // ── 5. BOX SHADOW ─────────────────────────────────────
      boxShadow: {
        xs:      "0 1px 2px 0 rgba(10, 61, 43, 0.05)",
        sm:      "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        md:      "var(--shadow-md)",
        lg:      "var(--shadow-lg)",
        xl:      "var(--shadow-xl)",
        "2xl":   "0 25px 50px -12px rgba(10, 61, 43, 0.20)",
        "3xl":   "0 35px 70px -15px rgba(10, 61, 43, 0.25)",
        "glow-sm":   "0 0 12px 2px rgba(46, 139, 87, 0.25)",
        "glow":      "var(--shadow-glow)",
        "glow-lg":   "0 0 40px 8px rgba(46, 139, 87, 0.35)",
        "glow-gold": "0 0 20px 4px rgba(245, 158, 11, 0.35)",
        "inner-sm":  "inset 0 1px 2px rgba(10, 61, 43, 0.06)",
        "inner":     "inset 0 2px 4px rgba(10, 61, 43, 0.10)",
        none:        "none",
      },


      // ── 6. GRADIENTS (via backgroundImage) ────────────────
      backgroundImage: {
        "hero-light":    "linear-gradient(135deg, #E8F5ED 0%, #FDFAF2 50%, #F7F3E8 100%)",
        "hero-dark":     "linear-gradient(135deg, #0A3D2B 0%, #0F3C24 60%, #051F15 100%)",
        "hero-gunmetal": "linear-gradient(135deg, #151C1F 0%, #1E2A2E 60%, #151C1F 100%)",
        "section-warm":  "linear-gradient(180deg, #FDFAF2 0%, #F7F3E8 100%)",
        "section-green": "linear-gradient(180deg, #E8F5ED 0%, #C3E8CE 100%)",
        "card-feature":  "linear-gradient(135deg, #155A3E 0%, #0A3D2B 100%)",
        "card-gunmetal": "linear-gradient(135deg, #1E2A2E 0%, #151C1F 100%)",
        "card-gold":     "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        "card-glass":    "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(247,243,232,0.90) 100%)",
        "overlay-green": "linear-gradient(180deg, transparent 0%, rgba(10,61,43,0.85) 100%)",
        "overlay-light": "linear-gradient(180deg, transparent 0%, rgba(247,243,232,0.95) 100%)",
        "mesh-forest":   "radial-gradient(at 20% 20%, #C3E8CE 0%, transparent 55%), radial-gradient(at 80% 80%, #9DD8AE 0%, transparent 55%), radial-gradient(at 50% 50%, #FDFAF2 0%, transparent 70%)",
        "mesh-gunmetal": "radial-gradient(at 20% 20%, #2C3A3F 0%, transparent 55%), radial-gradient(at 80% 80%, #243033 0%, transparent 55%), radial-gradient(at 50% 50%, #151C1F 0%, transparent 70%)",
        "noise":         "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        "radial-soft":   "radial-gradient(ellipse at center, #E8F5ED 0%, transparent 70%)",
        "radial-gold":   "radial-gradient(ellipse at center, #FEF3C7 0%, transparent 70%)",
      },


      // ── 7. TRANSITIONS & ANIMATION ────────────────────────
      transitionDuration: {
        0:    "0ms",
        75:   "75ms",
        100:  "100ms",
        150:  "150ms",
        200:  "200ms",
        300:  "300ms",
        500:  "500ms",
        700:  "700ms",
        1000: "1000ms",
      },

      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        linear:  "linear",
        in:      "cubic-bezier(0.4, 0, 1, 1)",
        out:     "cubic-bezier(0, 0, 0.2, 1)",
        "in-out":"cubic-bezier(0.4, 0, 0.2, 1)",
        spring:  "cubic-bezier(0.34, 1.56, 0.64, 1)",
        bounce:  "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
        smooth:  "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        snappy:  "cubic-bezier(0.19, 1, 0.22, 1)",
      },

      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%":   { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.6", transform: "scale(1.3)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%":      { transform: "rotate(2deg)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pop: {
          "0%":   { transform: "scale(1)" },
          "40%":  { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
      },

      animation: {
        "fade-up":    "fade-up 0.5s cubic-bezier(0.19, 1, 0.22, 1) both",
        "fade-up-sm": "fade-up 0.35s cubic-bezier(0.19, 1, 0.22, 1) both",
        "fade-down":  "fade-down 0.5s cubic-bezier(0.19, 1, 0.22, 1) both",
        "fade-in":    "fade-in 0.4s ease both",
        "scale-in":   "scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        shimmer:      "shimmer 1.8s linear infinite",
        "pulse-dot":  "pulse-dot 2s ease-in-out infinite",
        sway:         "sway 4s ease-in-out infinite",
        marquee:      "marquee 30s linear infinite",
        pop:          "pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },


      // ── 8. BACKDROP BLUR ──────────────────────────────────
      backdropBlur: {
        xs:      "2px",
        sm:      "4px",
        DEFAULT: "8px",
        md:      "12px",
        lg:      "16px",
        xl:      "24px",
        "2xl":   "40px",
        "3xl":   "64px",
      },


      // ── 9. Z-INDEX ────────────────────────────────────────
      zIndex: {
        0:      "0",
        10:     "10",
        20:     "20",
        30:     "30",
        40:     "40",
        50:     "50",
        nav:    "100",
        drawer: "200",
        modal:  "300",
        toast:  "400",
        tip:    "500",
        top:    "9999",
      },


      // ── 10. SCREENS ───────────────────────────────────────
      screens: {
        xs:    "360px",
        sm:    "640px",
        md:    "768px",
        lg:    "1024px",
        xl:    "1280px",
        "2xl": "1400px",
        "3xl": "1600px",
        "4xl": "1920px",
        "5xl": "2560px",
      },


      // ── 11. ASPECT RATIO ──────────────────────────────────
      aspectRatio: {
        "4/3":     "4 / 3",
        "3/2":     "3 / 2",
        "16/9":    "16 / 9",
        "21/9":    "21 / 9",
        "1/1":     "1 / 1",
        portrait:  "3 / 4",
        card:      "5 / 3",
        banner:    "8 / 1",
      },


      // ── 12. RING ──────────────────────────────────────────
      ringColor: {
        DEFAULT: "rgba(46, 139, 87, 0.45)",
        primary: "rgba(46, 139, 87, 0.45)",
        gold:    "rgba(245, 158, 11, 0.45)",
        danger:  "rgba(220, 38, 38, 0.45)",
      },

      ringOffsetColor: {
        light: "#FDFAF2",
        dark:  "#151C1F",
      },


      // ── 13. OPACITY ───────────────────────────────────────
      opacity: {
        0:   "0",
        5:   "0.05",
        10:  "0.10",
        15:  "0.15",
        20:  "0.20",
        25:  "0.25",
        30:  "0.30",
        40:  "0.40",
        50:  "0.50",
        60:  "0.60",
        70:  "0.70",
        75:  "0.75",
        80:  "0.80",
        90:  "0.90",
        95:  "0.95",
        100: "1",
      },


      // ── 14. LINE CLAMP ────────────────────────────────────
      lineClamp: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
      },

    }, // end extend
  }, // end theme


  // ── PLUGINS ───────────────────────────────────────────────
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),

    function ({ addUtilities, addComponents, theme }: any) {

      addComponents({
        // Glass morphism card — light
        ".glass": {
          background:           "rgba(253, 250, 242, 0.75)",
          backdropFilter:       "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border:               "1px solid rgba(46, 139, 87, 0.15)",
        },
        // Glass morphism card — dark (gun metal tinted)
        ".glass-dark": {
          background:           "rgba(30, 42, 46, 0.70)",
          backdropFilter:       "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border:               "1px solid rgba(61, 79, 84, 0.40)",
        },

        // Skeleton loader — gunmetal in both modes
        ".skeleton": {
          background:  "#D4E3E7",
          animation:   "pulse 1.8s ease-in-out infinite",
          borderRadius: theme("borderRadius.md"),
        },
        ".dark .skeleton": {
          background:  "#243033",
          animation:   "pulse 1.8s ease-in-out infinite",
          borderRadius: theme("borderRadius.md"),
        },

        // Scrollbar
        ".scrollbar-green": {
          scrollbarWidth: "thin",
          scrollbarColor: `${theme("colors.primary2.300")} transparent`,
          "&::-webkit-scrollbar":        { width: "6px", height: "6px" },
          "&::-webkit-scrollbar-track":  { background: "transparent" },
          "&::-webkit-scrollbar-thumb":  {
            backgroundColor: theme("colors.primary2.300"),
            borderRadius:    "9999px",
          },
        },

        // Focus ring
        ".focus-ring": {
          outline: "none",
          "&:focus-visible": {
            outline:      "2px solid",
            outlineColor: theme("colors.primary2.500"),
            outlineOffset:"2px",
            borderRadius: theme("borderRadius.sm"),
          },
        },

        // Stripe pattern
        ".stripe-green": {
          "&:nth-child(even)": {
            backgroundColor: theme("colors.surface.100"),
          },
        },
      });

      addUtilities({
        ".text-gradient-green": {
          background:             `linear-gradient(135deg, ${theme("colors.primary2.500")}, ${theme("colors.accent2.500")})`,
          WebkitBackgroundClip:   "text",
          WebkitTextFillColor:    "transparent",
          backgroundClip:         "text",
        },
        ".text-gradient-gold": {
          background:             `linear-gradient(135deg, ${theme("colors.gold.500")}, ${theme("colors.gold.300")})`,
          WebkitBackgroundClip:   "text",
          WebkitTextFillColor:    "transparent",
          backgroundClip:         "text",
        },
        ".antialiased-plus": {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering:       "optimizeLegibility",
        },
        ".truncate-2": {
          display:           "-webkit-box",
          WebkitLineClamp:   "2",
          WebkitBoxOrient:   "vertical",
          overflow:          "hidden",
        },
        ".truncate-3": {
          display:           "-webkit-box",
          WebkitLineClamp:   "3",
          WebkitBoxOrient:   "vertical",
          overflow:          "hidden",
        },
      });
    },
  ],
};