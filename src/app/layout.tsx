// import type { Metadata } from "next";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import StoreProvider from "@/providers/StoreProvider";
// import { Sanchez } from "next/font/google";

// const sanchez = Sanchez({
//   subsets: ["latin", "latin-ext"],
//   variable: "--font-sanchez",
//   display: "swap",
//   weight: ["400"],
// });

// export const metadata: Metadata = {
//   title: "BAMHS-Battali Abdul Matin High School",
//   description: "The Official Website of Battali Abdul Matin High School. Located in Battali Bajar, Nangalkot, Cumilla, Chattogram, Bangladesh.",
//   keywords: ["BAMHS", "Battali Abdul Matin High School", "BAMHSIAN", "Alumni of BAMHS", "Battali", "Abdul Matin High School", "Bangladesh", "Cumilla", "Chattogram", "Nangalkot", "BAMHS Alumni", "Battali", "Abdul Matin High School", "Cumilla", "Chattogram", "Nangalkot", "BAMHS", "Battali", "Abdul Matin High School", "Bangladesh", "Chattogram", "Nangalkot"],
//   authors: [{ name: "BAMHS" }],
// };

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`
//           ${sanchez.variable}

//           antialiased text-white relative
//           max-w-[1920px] mx-auto h-full min-h-screen
//         `}
//       >
//         <StoreProvider>
//           <div className="flex flex-col justify-between min-h-screen">
//             <Navbar />
//             <div className="pt-12 md:pt-24 flex-1 flex items-center justify-center">{children}</div>
//             <Footer />
//           </div>
//         </StoreProvider>
//       </body>
//     </html>
//   );
// }





import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreProvider from "@/providers/StoreProvider";
import { Playfair_Display, DM_Sans, Lora, JetBrains_Mono } from "next/font/google";

/* ── Fonts ─────────────────────────────────────────────────── */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
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
      className={`
        ${playfair.variable}
        ${dmSans.variable}
        ${lora.variable}
        ${jetbrainsMono.variable}
      `}
    >
      <body
        className="
          font-sans antialiased
          bg-surface text-neutral-900
          max-w-[1920px] mx-auto
          min-h-screen h-full
        "
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <StoreProvider>
          <div className="flex flex-col justify-between min-h-screen">
            <Navbar />
            {/* pt accounts for fixed navbar height */}
            <main className="pt-14 md:pt-24 flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}