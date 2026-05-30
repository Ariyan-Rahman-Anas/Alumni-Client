"use server";
import { revalidatePath } from "next/cache";

/**
 * Busts the Next.js Data Cache for the root layout so that the dynamic
 * brand-color CSS is re-fetched from the DB on the next page request.
 * Call this from admin forms after any website-management update.
 */
export async function revalidateWebsiteLayout() {
    revalidatePath("/", "layout");
}
