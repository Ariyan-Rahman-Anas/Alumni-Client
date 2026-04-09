import { z, string, object } from "zod";

export const batchSchema = object({
    year: string().trim().min(4, "Year must be at least 4 characters"),
    })

export type BatchFormValues = z.infer<typeof batchSchema>;

/** Determines which field's error is shown first (top → bottom order). */
export const BATCH_FIELD_ORDER: (keyof BatchFormValues)[] = [
    "year",
];
