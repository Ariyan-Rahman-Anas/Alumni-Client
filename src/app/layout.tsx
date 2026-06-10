import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/providers/StoreProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { Sanchez, Splash } from "next/font/google";
import { cn } from "@/lib/utils";
import SmoothScroller from "@/lib/SmoothScroller";
import { buildDynamicColorCss } from "@/lib/colorScale";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";

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

const FALLBACK_METADATA: Metadata = {
  title: {
    default:
      "Alumni Association of Battali Abdul Matin High School - BAMHS, Nangalkot, Cumilla, Chattogram, Bangladesh",
    template: "%s | BAMHS",
  },
  description:
    "The Official Website of Battali Abdul Matin High School's Alumni Association. Located in Battali Bazar, Nangalkot, Cumilla, Chattogram, Bangladesh.",
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
    title:
      "Alumni Association of Battali Abdul Matin High School - BAMHS, Nangalkot, Cumilla, Chattogram, Bangladesh",
    description:
      "The Official Website of Battali Abdul Matin High School's Alumni Association. Located in Battali Bazar, Nangalkot, Cumilla, Chattogram, Bangladesh.",
    type: "website",
    locale: "en_US",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const wm = await getWebsiteData();
  if (!wm?.schoolName) return FALLBACK_METADATA;

  const name: string = wm.schoolName;
  const shortName = toShortName(name);

  const locationParts = [wm.area, wm.thana, wm.district, wm.division, wm.country].filter(Boolean);
  const location = locationParts.join(", ");

  const defaultTitle = `Alumni Association of ${name}${location ? ` - ${shortName}, ${location}` : ""}`;
  const description = `The Official Website of ${name}'s Alumni Association.${location ? ` Located in ${location}.` : ""}${wm.motto ? ` ${wm.motto}.` : ""}`;
  const keywords = [shortName, name, `Alumni of ${shortName}`, ...(locationParts as string[])];

  return {
    title: { default: defaultTitle, template: `%s | ${shortName}` },
    description,
    keywords,
    authors: [{ name }],
    openGraph: { title: defaultTitle, description, type: "website", locale: "en_US" },
  };
}

/* ── Root Layout ───────────────────────────────────────────── */
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Reuse the same cached fetch — no extra HTTP round-trip
  const wm = await getWebsiteData();
  const dynamicColorCss = buildDynamicColorCss(
    wm?.primaryColor,
    wm?.bloodBankColor,
    wm?.primaryColorDark,
    wm?.bloodBankColorDark,
  );
  return (
    <html
      lang="en"
      className={cn(sanchez.variable, splash.variable)}
      suppressHydrationWarning
    >
      <body
        className="
          antialiased
          bg-white dark:bg-gunmetal-900
          max-w-full
          min-h-screen h-full
        ">
        {/* Dynamic brand colors from DB — rendered in body so Next.js App Router
            doesn't strip them. Browsers apply <style> tags anywhere in the document. */}
        {dynamicColorCss && (
          <style dangerouslySetInnerHTML={{ __html: dynamicColorCss }} />
        )}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StoreProvider>
            <TooltipProvider>
              <SmoothScroller>{children}</SmoothScroller>
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}