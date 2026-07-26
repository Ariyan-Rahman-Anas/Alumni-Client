import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/providers/StoreProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { Sanchez, Splash } from "next/font/google";
import { cn } from "@/lib/utils";
import SmoothScroller from "@/lib/SmoothScroller";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";

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

export async function generateMetadata(): Promise<Metadata> {
  const wm = await getWebsiteData();

  const schoolName = wm?.schoolName ?? "Battali Abdul Matin High School";
  const shortName = wm?.schoolName ? toShortName(wm.schoolName)+"ian" : "BAMHSian";
  const location = `${wm?.thana ?? "Nangalkot"}, ${wm?.district ?? "Cumilla"}, ${wm?.division ?? "Chattogram"}, ${wm?.country ?? "Bangladesh"}`;
  const description =
    wm?.motto ||
    `The Official Website of ${schoolName}'s Alumni Association. Located in ${wm?.area ?? "Battali"}, ${location}.`;
  const fullTitle = `Alumni Association of ${schoolName} - ${shortName}, ${location}`;

  return {
    title: {
      default: fullTitle,
      template: `%s | ${shortName}`,
    },
    description,
    keywords: [shortName, schoolName, `${shortName}ian`, wm?.thana, wm?.district, wm?.division, wm?.country].filter(Boolean) as string[],
    authors: [{ name: shortName }],
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      locale: "en_US",
      images: wm?.bannerUrl ? [wm.bannerUrl] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(sanchez.variable, splash.variable)} suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-gunmetal-900 max-w-full min-h-screen h-full">
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