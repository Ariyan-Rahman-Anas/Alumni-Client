"use server";
import { revalidatePath } from "next/cache";

export async function revalidateWebsiteLayout() {
    revalidatePath("/", "layout");
}
