import { object, string, number } from "zod"

export const testimonialAddSchema = object({
    quote: string().trim()
        .min(1, "Please write your quote")
        .min(10, "Quote must be at least 10 characters")
        .max(600, "Max 600 characters"),
    rating: number()
        .min(1, "Please select a rating")
        .max(5, "Rating must be at most 5"),
});

export const TESTIMONIAL_FIELD_ORDER: (keyof typeof testimonialAddSchema.shape)[] = [
    "quote",
    "rating",
];