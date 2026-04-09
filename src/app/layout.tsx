import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/providers/StoreProvider";
import { Toaster } from "sonner";
import { Sanchez, Splash } from "next/font/google";
import { cn } from "@/lib/utils";

/* ── Fonts ─────────────────────────────────────────────────── */
const sanchez = Sanchez({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sanchez",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const splash = Splash({
  subsets: ["latin"],
  variable: "--font-splash",
  display: "swap",
  weight: ["400"],
  style: ["normal"],
});


/* ── Metadata ──────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Alumni Association | BAMHS — Battali Abdul Matin High School, Nangalkot, Cumilla, Chattogram, Bangladesh",
    template: "%s | BAMHS",
  },
  description:
    "The Official Website of Battali Abdul Matin High School's Alumni Association. Located in Battali Bajar, Nangalkot, Cumilla, Chattogram, Bangladesh.",
  keywords: [
    "BAMHS",
    "Battali Abdul Matin High School",
    "BAMHSIAN",
    "Alumni of BAMHS",
    "Battali",
    "Nangalkot",
    "Cumilla",
    "Chattogram",
    "Bangladesh",
  ],
  authors: [{ name: "BAMHS" }],
  openGraph: {
    title: "Alumni Association | BAMHS — Battali Abdul Matin High School, Nangalkot, Cumilla, Chattogram, Bangladesh",
    description:
      "The Official Website of Battali Abdul Matin High School's Alumni Association. Located in Battali Bajar, Nangalkot, Cumilla, Chattogram, Bangladesh.",
    type: "website",
    locale: "en_US",
  },
};

/* ── Root Layout ───────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(sanchez.variable, splash.variable,)}
    >
      <body
        className="
           antialiased
          bg-surface
          max-w-full
          min-h-screen h-full
        ">
        <StoreProvider>
          {children}
          <Toaster richColors position="top-right" />
        </StoreProvider>
      </body>
    </html>
  );
}