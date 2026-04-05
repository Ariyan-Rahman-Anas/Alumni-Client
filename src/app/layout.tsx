import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreProvider from "@/providers/StoreProvider";
import { Playfair_Display, Lora, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

/* ── Fonts ─────────────────────────────────────────────────── */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});


const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

/* ── Metadata ──────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "BAMHS — Battali Abdul Matin High School",
    template: "%s | BAMHS",
  },
  description:
    "The Official Website of Battali Abdul Matin High School. Located in Battali Bajar, Nangalkot, Cumilla, Chattogram, Bangladesh.",
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
    title: "BAMHS — Battali Abdul Matin High School",
    description:
      "The Official Website of Battali Abdul Matin High School, Bangladesh.",
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
      className={cn(playfair.variable, lora.variable, jetbrainsMono.variable, "font-sans")}
    >
      <body
        className="
          font-sans antialiased
          bg-surface
          max-w-full
          min-h-screen h-full
        ">
        <StoreProvider>
          <div className="flex flex-col justify-between min-h-screen">
            <Navbar />
            <main className="flex-1 pb-24 ">
              {children}
            </main>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}