import type { Config } from "tailwindcss";

// ============================================================
//  BAMHS — tailwind.config.ts
//  School Alumni Portal: present & ex-students, staff, public
//  Theme: Forest Green + Warm Cream | Futuristic & Refined
//
//  IMPORTANT: primary2 and bloodBank are CSS-variable-backed.
//  Their actual values are injected at runtime via <style> in
//  layout.tsx so that the admin can change them from the DB
//  without a rebuild. All other color families are static.
// ============================================================

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    darkMode: "class",

    theme: {
        extend: {
            // ── 1. COLOR SYSTEM ──────────────────────────────────────
            colors: {
                // ── ShadCN token layer — CSS var-backed ─────────────────────────
                // These match the CSS custom properties defined in globals.css
                // and are required by shadcn/ui components.
                background: "var(--background)",
                foreground: "var(--foreground)",
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "oklch(0.985 0 0)",
                },
                sidebar: {
                    DEFAULT: "var(--sidebar)",
                    foreground: "var(--sidebar-foreground)",
                    primary: "var(--sidebar-primary)",
                    "primary-foreground": "var(--sidebar-primary-foreground)",
                    accent: "var(--sidebar-accent)",
                    "accent-foreground": "var(--sidebar-accent-foreground)",
                    border: "var(--sidebar-border)",
                    ring: "var(--sidebar-ring)",
                },

                // ── DYNAMIC — CSS var-backed (admin-configurable) ────────────────
                // Override by injecting :root { --color-primary-* } at runtime.
                primary2: {
                    50: "var(--color-primary-50)",
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
                // Override by injecting :root { --color-blood-bank-* } at runtime.
                bloodBank: {
                    50: "var(--color-blood-bank-50)",
                    100: "var(--color-blood-bank-100)",
                    200: "var(--color-blood-bank-200)",
                    300: "var(--color-blood-bank-300)",
                    400: "var(--color-blood-bank-400)",
                    500: "var(--color-blood-bank-500)",
                    600: "var(--color-blood-bank-600)",
                    700: "var(--color-blood-bank-700)",
                    800: "var(--color-blood-bank-800)",
                    900: "var(--color-blood-bank-900)",
                    950: "var(--color-blood-bank-950)",
                },

                // ── STATIC — hardcoded (not user-configurable) ───────────────────
                gunmetal: {
                    50: "#EEF5F7",
                    100: "#D4E3E7",
                    200: "#A8BEC4",
                    300: "#7A949C",
                    400: "#526870",
                    500: "#3D4F54",
                    600: "#2C3A3F",
                    700: "#243033",
                    800: "#1E2A2E",
                    900: "#1A2428",
                    950: "#151C1F",
                },

                accent2: {
                    50: "#F5F7EB",
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

                gold: {
                    50: "#FFFBEB",
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

                surface: {
                    DEFAULT: "#FDFAF2",
                    50: "#FDFAF2",
                    100: "#F7F3E8",
                    200: "#EEE9D8",
                    300: "#E0D8C0",
                    400: "#C8BCA0",
                    inverse: "#0A3D2B",
                },
            },

            // ── 2. TYPOGRAPHY ────────────────────────────────────────
            fontFamily: {
                sanchez: ["var(--font-sanchez)", "cursive", "system-ui", "sans-serif"],
                splash: ["var(--font-splash)", "cursive"],
            },

            // ── 3. BORDER RADIUS (shadcn tokens) ─────────────────────
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },

            // ── 4. SCREENS ───────────────────────────────────────────
            screens: {
                xs: "360px",
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                "2xl": "1400px",
                "3xl": "1600px",
                "4xl": "1920px",
                "5xl": "2560px",
            },

            // ── 5. Z-INDEX SCALE ─────────────────────────────────────
            zIndex: {
                nav:    "100",   // fixed navbar
                drawer: "200",   // mobile drawer / sheet
                modal:  "300",   // dialogs, popovers, dropdowns
                toast:  "400",   // toast notifications
                tip:    "500",   // tooltips
                top:    "9999",  // emergency override
            },

            // ── 6. KEYFRAMES (shadcn accordion + tw-animate-css) ─────
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },

    plugins: [
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("@tailwindcss/typography"),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("@tailwindcss/forms"),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("@tailwindcss/aspect-ratio"),
    ],
};

export default config;
