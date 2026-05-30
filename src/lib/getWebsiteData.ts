import { cache } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WebsiteData = Record<string, any>;

/**
 * Fetches website-management data from the API.
 * Wrapped in React `cache()` so it is deduplicated per request —
 * root layout, generateMetadata, and any child page all share the
 * same single HTTP call.
 */
export const getWebsiteData = cache(async (): Promise<WebsiteData | null> => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) return null;
  try {
    const res = await fetch(`${apiBase}/api/v1/website-management`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
});

/** Returns e.g. "BAMHS" from "Battali Abdul Matin High School" */
export function toShortName(schoolName: string): string {
  return schoolName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
